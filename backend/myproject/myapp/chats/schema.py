import graphene
from ..models import MyUser, Message, Chat, Group
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import superuser_required, login_required
from django.contrib.auth import get_user_model


class MyUserType(DjangoObjectType):
    class Meta:
        model = MyUser


class MessageType(DjangoObjectType):
    class Meta:
        model = Message


class ChatType(DjangoObjectType):
    class Meta:
        model = Chat


class CreateChat(graphene.Mutation):
    chat = graphene.Field(ChatType)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        p_user = get_user_model().objects.get(id=id)
        p_my_user = MyUser.objects.get(user=p_user)

        user = info.context.user
        my_user = MyUser.objects.get(user=user)

        chat = Chat.objects.filter(partner__in=[p_user])
        # fin_user_chats = my_user.chats.filter(partner__in=[p_user])
        if set(chat):
            return CreateChat(chat=chat[0])
        else:
            our_chat = Chat()
            our_chat.save()
            our_chat.partner.add(*[p_user, user])
            my_user.chats.add(our_chat)
            p_my_user.chats.add(our_chat)
            return CreateChat(chat=our_chat)


class ChangeAvatar(graphene.Mutation):
    avatar = graphene.Field(MyUserType)

    class Arguments:
        id = graphene.ID(required=True)
        picture = graphene.String(required=True)

    def mutate(self, info, id, picture):
        user = MyUser.objects.filter(id=id)
        user.update(avatar=picture)
        return user


class CreateMessage(graphene.Mutation):
    message = graphene.Field(MessageType)

    class Arguments:
        body = graphene.String(required=True)
        chat_id = graphene.ID(required=True)

    def mutate(self, info, body, chat_id):
        user = info.context.user
        message = Message(
            body=body,
            authorId=user
        )
        message.save()
        chat = Chat.objects.get(id=chat_id)
        chat.messages.add(message)
        return CreateMessage(message=message)


class Mutation(graphene.ObjectType):
    create_chat = CreateChat.Field()
    create_message = CreateMessage.Field()
    change_avatar = ChangeAvatar.Field()


class Query(graphene.AbstractType):
    all_chats = graphene.List(MyUserType)
    me = graphene.List(MyUserType)
    user_by_id = graphene.Field(MyUserType, id=graphene.ID())
    chat_by_id = graphene.List(ChatType, id=graphene.ID())

    @login_required
    def resolve_all_chats(self, info, **kwargs):
        return MyUser.objects.filter(user=info.context.user)

    @login_required
    def resolve_me(self, info, **kwargs):
        user = MyUser.objects.filter(user=info.context.user)
        return user

    @login_required
    def resolve_user_by_id(self, info, id):
        user = get_user_model().objects.get(id=id)
        return MyUser.objects.get(user=user) or None

    @login_required
    def resolve_chat_by_id(self, info, id):
        chat = Chat.objects.filter(id=id)
        return chat

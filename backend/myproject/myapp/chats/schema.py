import graphene
from ..models import Post, MyUser, Group, Message, Chat
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
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        partner_user = get_user_model().objects.get(id=id)
        chat = Chat(
            partner=partner_user
        )
        chat.save()
        user = info.context.user
        my_user = MyUser.objects.get(user=user)
        my_user.chats.add(chat)
        return CreateChat(chat=chat)


class CreateMessage(graphene.Mutation):
    message = graphene.Field(MessageType)

    class Arguments:
        body = graphene.String(required=True)
        chat_id = graphene.Int(required=True)

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


class Query(graphene.AbstractType):
    all_chats = graphene.List(MyUserType)
    all_messages = graphene.List(MyUserType)

    @login_required
    def resolve_all_chats(self, info, **kwargs):
        return MyUser.objects.filter(user=info.context.user)

    @login_required
    def resolve_all_messages(self, info, **kwargs):
        return MyUser.objects.filter(user=info.context.user)

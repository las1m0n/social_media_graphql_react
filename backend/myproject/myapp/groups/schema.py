import graphene
from ..models import Post, MyUser, Group, Message, Chat
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import superuser_required, login_required


class GroupType(DjangoObjectType):
    class Meta:
        model = Group


class CreateGroup(graphene.Mutation):
    group = graphene.Field(GroupType)

    class Arguments:
        name = graphene.String(required=True)
        avatar = graphene.String(required=True)
        about = graphene.String(required=True)

    def mutate(self, info, name, avatar, about):
        group = Group(
            name=name,
            avatar=avatar,
            about=about,
            owner=info.context.user
        )
        group.save()
        user = info.context.user
        group.subscribers.add(user)
        my_user = MyUser.objects.get(user=user)
        my_user.groups.add(group)
        return CreateGroup(group=group)


class SubscribeGroup(graphene.Mutation):
    group = graphene.Field(GroupType)

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        user = info.context.user
        group = Group.objects.get(id=id)
        my_user = MyUser.objects.get(user=user)
        if user not in group.subscribers.all():
            group.subscribers.add(user)
            my_user.groups.add(group)
        else:
            group.subscribers.remove(user)
            my_user.groups.remove(group)
        return SubscribeGroup(group=group)


class Mutation(graphene.ObjectType):
    create_group = CreateGroup.Field()
    subscribe_group = SubscribeGroup.Field()


class Query(graphene.AbstractType):
    all_groups = graphene.List(GroupType)

    @login_required
    def resolve_all_groups(self, info, **kwargs):
        return MyUser.objects.get(user=info.context.user).groups

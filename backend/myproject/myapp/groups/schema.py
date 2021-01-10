import graphene
from ..models import MyUser, Group
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import superuser_required, login_required
from graphene_django.filter import DjangoFilterConnectionField


class GroupType(DjangoObjectType):
    class Meta:
        model = Group


class CreateGroup(graphene.Mutation):
    group = graphene.Field(GroupType)

    class Arguments:
        name = graphene.String(required=True)
        about = graphene.String(required=True)

    def mutate(self, info, name, about):
        group = Group(
            name=name,
            avatar="avatar",
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
        id = graphene.ID(required=True)

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


class Query(graphene.ObjectType):
    diff_group = graphene.List(GroupType)
    group_by_id = graphene.Field(GroupType, id=graphene.ID())

    @login_required
    def resolve_diff_group(self, info, **kwargs):
        my_user = MyUser.objects.get(user=info.context.user)
        user_groups = my_user.groups.all()
        all_groups = Group.objects.all()
        diff_groups = all_groups.difference(user_groups)
        return diff_groups

    @login_required
    def resolve_group_by_id(root, info, id):
        return Group.objects.get(pk=id)

from django.contrib.auth import get_user_model
from django.contrib.auth import logout
import graphene
from ..models import MyUser
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import superuser_required, login_required


class MyUserType(DjangoObjectType):
    class Meta:
        model = MyUser


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = get_user_model()(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()
        my_user = MyUser(user=user)
        my_user.save()
        return MyUser(user=user)


class AddToFriendList(graphene.Mutation):
    friend = graphene.Field(UserType)

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        user = info.context.user
        f_user = get_user_model().objects.get(pk=id)
        my_user = MyUser.objects.get(user=user)
        my_user.friends.add(f_user)
        return AddToFriendList(friend=f_user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    add_to_friend_list = AddToFriendList.Field()


class Query(graphene.AbstractType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)

    @superuser_required
    def resolve_users(self, info):
        return get_user_model().objects.all()

    @login_required
    def resolve_me(self, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception('Authentication credentials were not provided')
        return user

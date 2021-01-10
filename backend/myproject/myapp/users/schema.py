from django.contrib.auth import get_user_model
from django.contrib.auth import logout
from django.contrib.auth.models import User
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
        email = graphene.String(required=False)
        last_name = graphene.String(required=False)

    def mutate(self, info, username, password, email="rand", last_name="rand"):
        user = get_user_model()(
            username=username,
            email=email,
            last_name=last_name
        )
        user.set_password(password)
        user.save()
        my_user = MyUser(user=user)
        my_user.save()
        # login(info.context, user)
        return MyUser(user=user)


class AddToFriendList(graphene.Mutation):
    friend = graphene.Field(UserType)

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        user = info.context.user
        my_user = MyUser.objects.get(user=user)
        friend_user = get_user_model().objects.get(id=id)
        if friend_user not in my_user.friends.all():
            my_user.friends.add(friend_user)
        else:
            my_user.friends.remove(friend_user)
        return AddToFriendList(friend=friend_user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    add_to_friend_list = AddToFriendList.Field()


class Query(graphene.AbstractType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)
    diff_users = graphene.List(UserType)

    @login_required
    def resolve_users(self, info):
        return get_user_model().objects.all()

    @login_required
    def resolve_me(self, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception('Authentication credentials were not provided')
        return user

    @login_required
    def resolve_diff_users(self, info):
        my_user = MyUser.objects.get(user=info.context.user)
        user_friends = my_user.friends.all()
        all_users = get_user_model().objects.all()
        your_user = get_user_model().objects.filter(id=info.context.user.id)
        diff_users = all_users.difference(user_friends)
        diff_users_final = diff_users.difference(your_user)
        # diff_my_users = MyUser.objects.filter(friends__in=diff_users.all())
        return diff_users_final

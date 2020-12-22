import graphene
from ..models import Post, MyUser, Group, Message, Chat
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import superuser_required, login_required


class PostType(DjangoObjectType):
    class Meta:
        model = Post


class CreatePost(graphene.Mutation):
    post = graphene.Field(PostType)

    class Arguments:
        name = graphene.String(required=True)
        message = graphene.String(required=True)

    def mutate(self, info, name, message):
        post = Post(
            name=name,
            message=message,
            type="personal"
        )
        post.save()
        user = info.context.user
        my_user = MyUser.objects.get(user=user)
        my_user.posts.add(post)
        return CreatePost(post=post)


class CreateGroupPost(graphene.Mutation):
    post = graphene.Field(PostType)

    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(required=True)
        message = graphene.String(required=True)

    def mutate(self, info, id, name, message):
        post = Post(
            name=name,
            message=message,
            type="group"
        )
        post.save()
        group = Group.objects.get(id=id)
        group.posts.add(post)
        return CreateGroupPost(post=post)


class LikePost(graphene.Mutation):
    post = graphene.Field(PostType)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        user = info.context.user
        post = Post.objects.get(id=id)
        if user not in post.likes.all():
            post.likes.add(user)
        else:
            post.likes.remove(user)
        return LikePost(post=post)


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    like_post = LikePost.Field()
    create_group_post = CreateGroupPost.Field()


class Query(graphene.AbstractType):
    all_posts = graphene.List(PostType)

    @login_required
    def resolve_all_posts(self, info, **kwargs):
        return MyUser.objects.get(user=info.context.user).posts

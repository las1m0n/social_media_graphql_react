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


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()


class Query(graphene.AbstractType):
    all_posts = graphene.List(PostType)

    @login_required
    def resolve_all_posts(self, info, **kwargs):
        return MyUser.objects.get(user=info.context.user).posts

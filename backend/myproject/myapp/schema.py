import graphql_jwt
import graphene
from .users import schema as user_schema
from .posts import schema as posts_schema
from .chats import schema as chats_schema
from .groups import schema as groups_schema

mutations = [user_schema.Mutation, posts_schema.Mutation, chats_schema.Mutation, groups_schema.Mutation]
queries = [user_schema.Query, posts_schema.Query, chats_schema.Query, groups_schema.Query]


class Mutation(*mutations, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()


class Query(*queries, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)

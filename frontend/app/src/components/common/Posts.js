import {gql, useMutation, useQuery} from '@apollo/client/index';
import React, {useState} from 'react';

const USER_POSTS = gql`
query{
  allChats{
    posts{
      id
      name
      message
      createdAt
      type
      likes{
        username
      }
    }
  }
}
`;

const POST_CREATE = gql`
mutation createPost($name: String!, $message: String!){
  createPost(name: $name, message: $message){
    post{
      id
      name
      message
    }
  }
}
`;

const LIKE_POST = gql`
mutation likePost($id: ID!){
   likePost(id: $id){
    post{
      id
      likes{
        id
        lastName
        username
      }
    }
  }
}
`;

function PostCreate() {
    const [formState, setFormState] = useState({
        name: '',
        message: ''
    });

    const [createPost] = useMutation(POST_CREATE, {
        variables: {
            name: formState.name,
            message: formState.message,
        }
    });

    const post_create = (
        <div className="col-md-3 m-auto">
            <div className="card card-body mt-2">
                <h2 className="text-center">Post Create</h2>
                <div className="form-group">
                    <input
                        value={formState.name}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                name: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Post name"
                    />
                </div>
                <div className="form-group">
                    <input
                        value={formState.message}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                message: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Message"
                    />
                </div>
            </div>
            <div className="flex mt3">
                <div className="form-group">
                    <button
                        className="btn btn-danger"
                        onClick={createPost}
                    >
                        Create Post
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        post_create
    );
}

function LikePost(props) {
    const [formState, setFormState] = useState({
        liked: true
    });

    const [likePost] = useMutation(LIKE_POST, {
        variables: {
            id: props.id
        },
        onCompleted: ({action}) => {
            setFormState({
                ...formState,
                liked: !formState.liked
            })
        }
    });

    return (
        <div className="flex mt3">
            <button onClick={likePost}>{formState.liked ? "Like❤" : "Unlike"}</button>
        </div>
    );
}


export function Posts() {
    const {data, loading} = useQuery(USER_POSTS, {pollInterval: 1500});
    if (loading) return <p>Loading...</p>;
    const posts = (
        data.allChats.map((chat, id) => (
            <div key={id}>
                {chat.posts.map((item, index) => (
                    <div key={index}>
                        <p>Post #{item.id} {item.name} - {item.message} - {item.createdAt}</p>
                        <ul className="messages">
                            Likes:
                            {
                                item.likes.map((it, i) => (
                                        <div key={i}>
                                            <li>
                                                <p>{it.username}</p>
                                            </li>
                                        </div>
                                    )
                                )
                            }
                        </ul>
                        <div>
                            <LikePost id={item.id}/>
                        </div>
                    </div>
                ))
                }
            </div>
        ))
    );
    return (
        <div>
            <PostCreate/>
            <p>Posts</p>
            {data.allChats.length ? posts : <p>Нет постов</p>}
        </div>
    );
}
import React from 'react';
import {gql, useQuery} from "@apollo/client";
import Loader from "../../UI/Loader/Loader";
import "./PostList.css"
import LikePost from "../LikePost/LikePost";
import DeletePost from "../DeletePost/DeletePost";

const USER_POSTS = gql`
query{
  allChats{
    user{
      id
      username
    }
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

const PostList = () => {
    const {data, loading} = useQuery(USER_POSTS, {pollInterval: 1500});
    if (loading) return <Loader/>;

    const postList = data?.allChats[0];

    const postListJSX = () => (
        <div className="PostList">
            {
                postList.posts.map((post, index) => (
                    <div key={index}>
                        <p>{post.name}</p>
                        <div className="corner">
                            <DeletePost id={post.id}/>
                        </div>
                        <div className="Timing">
                            <p>{post.message}</p>
                            <p>{post.createdAt}</p>
                        </div>
                        <hr/>
                        <div className="Likes">
                            <div className="Timing">
                                <p>Likes</p>
                                <LikePost
                                    id={post.id}
                                    isLiked={post.likes.some(x => x.username === postList.user.username)}
                                />
                            </div>
                            <ul>
                                {
                                    post.likes ? (
                                            post.likes.map((it, i) => (
                                                    <div key={i}>
                                                        <li>
                                                            <p>{it.username}</p>
                                                        </li>
                                                    </div>
                                                )
                                            )
                                        )
                                        :
                                        <p>No Likes</p>
                                }
                            </ul>
                        </div>
                    </div>
                ))
            }
        </div>
    )

    return (
        <div>
            {postList ? postListJSX(): null}
            {postList ? postList.posts.length === 0 && postList ? <p>Нет постов</p> : null : null}
        </div>
    )
};

export default PostList;
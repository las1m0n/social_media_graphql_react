import React, {useState} from 'react';
import {gql, useMutation, useQuery} from '@apollo/client/index';

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
const LikePost = (props) => {
    const [likePost] = useMutation(LIKE_POST, {
        variables: {
            id: props.id
        }
    });

    return (
        <div>
            <button onClick={likePost} className="btn btn-like">{
                !props.isLiked
                    ? <i className="far fa-heart"/>
                    : <i className="fas fa-heart-broken"/>}
            </button>
        </div>
    )
}

export default LikePost;
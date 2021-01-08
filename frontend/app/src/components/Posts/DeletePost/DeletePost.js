import React from 'react';
import {gql, useMutation} from "@apollo/client";

const DELETE_POST = gql`
mutation deletePost($id: ID!){
   deletePost(id: $id){
   post{
   id
   }
  }
}
`;

const DeletePost = (props) => {
    const [deletePost] = useMutation(DELETE_POST, {
        variables: {
            id: props.id
        }
    });


    return (
        <div>
            <button onClick={deletePost} className="btn btn-like">
                <i className="fas fa-times"/>
            </button>
        </div>
    )
}

export default DeletePost;
import {gql, useMutation} from "@apollo/client";
import React from "react";

const ADD_TO_FRIEND_LIST = gql`
mutation addFriendList($id: Int!){
  addToFriendList(id: $id){
    friend{
      id
      username
    } 
  }
}
`;

const FriendList = (props) => {
    const [addToFriend] = useMutation(ADD_TO_FRIEND_LIST, {
        variables: {
            id: props.id
        }
    });

    return (
        <div>
            <button
                className="btn btn-friend"
                onClick={addToFriend}
            >
                <i className={props.icon} />
            </button>
        </div>
    )
}

export default FriendList;
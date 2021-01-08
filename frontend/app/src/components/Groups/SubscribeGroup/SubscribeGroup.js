import React from 'react';
import {gql, useMutation} from "@apollo/client";
import "../../Groups/Groups/Groups.css"

const SUBSCRIBE_USER = gql`
mutation($id: ID!){
   subscribeGroup(id: $id){
    group{
      name
      avatar
      subscribers{
        id
        lastName
      }
    }
  }
}
`;

const SubscribeGroup = (props) => {
    const [subscribeGroup] = useMutation(SUBSCRIBE_USER, {
        variables: {
            id: props.id
        }
    });

    return (
        <>
            <button onClick={subscribeGroup} className={"btn btn-title"}>
                {props.params.type} &nbsp; <i className={props.params.icon}/>
            </button>
        </>
    );
}

export default SubscribeGroup;
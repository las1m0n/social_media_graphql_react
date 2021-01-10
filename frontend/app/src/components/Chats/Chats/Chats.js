import React from 'react';
import {gql, useQuery} from "@apollo/client";
import {Link} from "react-router-dom";
import "./Chats.css"

const QUERY_CHATS = gql`
query{
  allChats{
    chats{
      id
      partner{
        id
        username
      }
      messages{
        createdAt
        body
        authorId{
            id
            username
      } 
    }
  }
}
}`;

const Chats = (props) => {
    const {data, loading} = useQuery(QUERY_CHATS, {pollInterval: 1500});
    console.log(data)
    if (loading) return <p>Loading...</p>;

    const chats = data?.allChats[0]

    const chatList = () => {
        return (
            <div>
                {chats.chats.length === 0 ? <h6>У Вас нет чатов</h6> :
                    chats?.chats.map((chat, index) => (
                        <div key={index} className="ChatsList">
                            <div className="space-between">
                                <i className="fas fa-users fa-2x" style={{marginTop: "20px"}}/>
                                <div>
                                    <p id={chat.id}>
                                        <Link to={`/chats/${chat.id}`} className="btn btn-chat">
                                            {chat.partner[0].username}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }

    return (
        <div className="Chats">
            <div className="ChatsWrapper">
                {chatList()}
            </div>
        </div>
    );
}

export default Chats;
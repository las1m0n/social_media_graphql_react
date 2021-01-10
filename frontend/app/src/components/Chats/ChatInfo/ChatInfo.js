import React from 'react';
import {gql, useQuery} from "@apollo/client";
import CreateMessage from "../CreateMessage/CreateMessage";
import "../Chats/Chats.css"

const CHAT_BY_ID = gql`
query chatById($id: ID!){
  chatById(id: $id){
    id
    partner{
      id
      username
      lastName
    }
    messages{
      body
      createdAt
      authorId{
        username
      }
    }
  }
}
`;

const ChatInfo = (props) => {
    const {loading, data} = useQuery(CHAT_BY_ID, {
        variables: {id: props.match.params.id}
    });
    if (loading) return <p>Loading...</p>;

    const partner_username = data?.chatById[0].partner[0].username
    const messages_bool = data?.chatById[0].messages
    const chat_id = data?.chatById[0].id

    const messageList = () => {
        return (
            <div>
                <h2>Сообщения</h2>
                <ul>
                    {messages_bool.map((message, index) => (
                        <div key={index} className="ChatsList">
                            <div>{message.authorId.username}</div>
                            <div className="space-between">
                                <p>{message.body}</p>
                                <p>{message.createdAt}</p>
                            </div>
                        </div>
                    ))
                    }
                </ul>
            </div>
        )
    }

    return (
        <>
            <div className="Chats">
                <div className="ChatsWrapper">
                    <p>Чат с {partner_username}</p>
                    <hr/>
                    {messages_bool.length !== 0 ? messageList() : <p>Нет сообщений с этим пользователем</p>}
                    <div>
                        <CreateMessage chat_id={chat_id}/>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ChatInfo;
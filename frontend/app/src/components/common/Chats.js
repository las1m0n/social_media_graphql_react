import {gql, useMutation, useQuery} from "@apollo/client";
import React, {useState} from 'react';
import {useParams} from "react-router";
import {Link} from "react-router-dom";

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
        lastName
      }
    }
  }
}
`;

const CREATE_MESSAGE = gql`
mutation createMessage($body: String!, $chatId: ID!){
  createMessage(body: $body, chatId: $chatId){
    message{
        id
        body
        createdAt
    }
  }
}
`;


function MessageCreate(props) {
    const [formState, setFormState] = useState({
        body: ''
    });

    const [createMessage] = useMutation(CREATE_MESSAGE, {
        variables: {
            body: formState.body,
            chatId: props.id
        },
        onCompleted: ({action}) => {
            window.location.reload()
        }
    });

    const message_create = (
        <div className="">
            <div className="card card-body mt-2">
                <div className="form-group">
                    <input
                        value={formState.body}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                body: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Your message..."
                    />
                </div>
            </div>
            <div className="flex mt3">
                <div className="form-group">
                    <button
                        className="btn btn-danger"
                        onClick={createMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        message_create
    );
}

export function ChatInfo() {
    let {id} = useParams();
    const {loading, error, data} = useQuery(CHAT_BY_ID, {
        variables: {id}
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>`Error! ${error}`</p>;

    return (
        <div>
            {data.chatById.map((item, index) => (
                <div key={index}>
                    <p>Диалог с: {item.partner.username}</p>
                    <p>Сообщения</p>
                    {item.messages.length ? (
                        <div>
                            {item.messages.map((it, id) => (
                                <div key={id}>
                                    <p>{it.authorId.lastName}: {it.body}</p>
                                    <p>{it.createdAt}</p>
                                </div>
                            ))
                            }
                        </div>
                    ) : <div><p>Нет сообщений</p></div>
                    }
                    <MessageCreate id={id}/>
                </div>))
            }
        </div>
    );
}

export function Chats() {
    const {data, loading} = useQuery(QUERY_CHATS, {pollInterval: 1500});
    if (loading) return <p>Loading...</p>;

    const chats = (
        data.allChats.map((chat, id) => (
            <div key={id}>
                {chat.chats.map((item, index) => (
                    <div key={index}>
                        <p>Chat with {item.partner.username}
                            <button>
                                <Link to={`/chats/${item.id}`}>
                                    ( ͡👁️ ͜ʖ ͡👁️)
                                </Link>
                            </button>
                        </p>
                        <ul className="messages">
                            Last Message:
                            {
                                item.messages.slice(0, 1).map((it, i) => (
                                        <div key={i}>
                                            <li>
                                                <p>{it.body} - {it.createdAt} </p>
                                            </li>
                                        </div>
                                    )
                                )
                            }
                        </ul>
                    </div>
                ))
                }
            </div>
        ))
    );


    return (
        <div>
            <p>Chats</p>
            {data.allChats.length ? chats : <p>Нет сообщений</p>}
        </div>
    );
}
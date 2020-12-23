import {gql, useMutation, useQuery} from "@apollo/client";
import React, {useState} from 'react';
import {Link, useHistory, useParams} from "react-router-dom";
import './User.css';
import ImageUploader from 'react-images-upload';

const QUERY_USER = gql`
query {
   allChats
   {
    id
    aboutMe
    avatar
    user{
      username
      email
      lastName
    }
    friends{
      id
      username
      lastName
    }
  }
  diffUsers
  {
    username
    email
    id
  }
}
`;

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

const USER_INFO = gql`
query userById($id: ID!){
  userById(id: $id){
    user{
      id
      username
      email
    }
    friends{
      id
      username
      email    
    }
    aboutMe
    avatar
    id
  }
}
`;

const CREATE_CHAT = gql`
mutation createChat($id: ID!){
  createChat(id: $id){
    chat{
      id
    }
  }
}
`;

const CHANGE_AVATAR = gql`
mutation changeAvatar($id: ID!, $picture: String!){
  changeAvatar(id: $id, picture: $picture){
    avatar{
        avatar
        id
    }
  }
}
`;

function CreateChat(props) {
    const history = useHistory();
    const [chatCreate] = useMutation(CREATE_CHAT, {
        variables: {
            id: props.id
        },
        onCompleted: ({createChat}) => {
            history.push(`/chats/${createChat.chat.id}`);
        }
    });

    return (
        <div>
            <button onClick={chatCreate} className="btn btn-success">
                Написать
            </button>
        </div>
    );
}

function Friend(props) {
    const [addToFriend] = useMutation(ADD_TO_FRIEND_LIST, {
        variables: {
            id: props.id
        },
        onCompleted: ({action}) => {
            window.location.reload()
        }
    });

    return (
        <div>
            <ul>
                <li>Friend #{props.id}
                    <Link to={`/users/${props.id}`}>
                        {props.username}
                    </Link>
                    <div className="flex mt3">
                        {props.type ? (<button onClick={addToFriend}>{props.type}</button>) : <div></div>}
                    </div>
                </li>
            </ul>
        </div>)
}

function ChangeAvatar(props) {
    const [pictures, setPictures] = useState(
        {
            url: ""
        }
    );
    const [changeAvatar] = useMutation(CHANGE_AVATAR, {
        variables: {
            id: props.id,
            picture: pictures.url
        },
        onCompleted: ({data})=> {
            window.location.reload();
        }
    });

    return (
        <div className="">
            <div className="card card-body mt-2">
                <div className="form-group">
                    <input
                        value={pictures.url}
                        onChange={(e) =>
                            setPictures({
                                ...pictures,
                                url: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="New URL Avatar"
                    />
                </div>
            </div>
            <div className="flex mt3">
                <div className="form-group">
                    <button
                        className="btn btn-danger"
                        onClick={changeAvatar}
                    >
                        Change Avatar
                    </button>
                </div>
            </div>
        </div>
    );
}

export function UserInfo() {
    let {id} = useParams();
    const {loading, error, data} = useQuery(USER_INFO, {
        variables: {id},
    });


    if (loading) return <p>Loading...</p>;
    if (error) return <p>`Error! ${error}`</p>;

    return (
        <div>
            <img src={data.userById.avatar} alt="no avatar" className="avatar"/>
            <p>Имя: {data.userById.user.username}</p>
            <p>Email: {data.userById.user.email}</p>
            <p>About Me: {data.userById.aboutMe}</p>
            <p> Friends: </p>
            {data.userById.friends.length ? (
                <div>
                    {data.userById.friends.map((item, index) => (
                        <div key={index}>
                            <Friend id={item.id} username={item.username}/>
                        </div>
                    ))
                    }
                </div>) : <div><p>Нет друзей</p></div>
            }
            <CreateChat id={data.userById.user.id}/>
        </div>
    );
}

export function User() {
    const {data, loading} = useQuery(QUERY_USER, {pollInterval: 1500});
    if (loading) return <p>Loading...</p>;

    const user_profile = (
        data.allChats.map((chat, id) => (
            <div key={id}>
                Your Profile:
                <img src={chat.avatar} alt="no avatar" className="avatar"/>
                <div>
                    <ChangeAvatar id={chat.id}/>
                </div>
                <li>About Me:{chat.aboutMe}</li>
                <li>Username: {chat.user.username}</li>
                <li>LastName: {chat.user.lastName}</li>
                <li>Email: {chat.user.email}</li>
                <li>Friends:</li>
                {chat.friends.map((item, index) => (
                    <div key={index}>
                        <Friend id={item.id} username={item.username} type="Убрать из списка друзей"/>
                    </div>
                ))
                }
                <li>Потенциальные друзья</li>
                {data.diffUsers.map((user, id) => (
                    <div key={id}>
                        <Friend id={user.id} username={user.username} type="Добавить в список друзей"/>
                    </div>
                ))}
            </div>
        ))
    );

    return (
        <div>
            {user_profile}
        </div>
    );
}
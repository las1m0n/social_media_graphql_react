import React from 'react';
import {gql, useMutation, useQuery} from "@apollo/client";
import "../../../containers/Home/Home.css";
import {useHistory} from "react-router-dom";

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

const ProfileUser = (props) => {
    const history = useHistory();
    const {loading, error, data} = useQuery(USER_INFO, {
        variables: {id: props.match.params.id}
    });

    const [chatCreate] = useMutation(CREATE_CHAT, {
        variables: {
            id: props.match.params.id
        },
        onCompleted: ({createChat}) => {
            console.log(createChat)
            history.push(`/chats/${createChat.chat.id}`);
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>`Error! ${error}`</p>;

    const user = data?.userById;

    const userInfoProfile = () => {
        return (
            <div>
                <p>{user.user.username}</p>
                <p>{user.aboutMe}</p>
            </div>
        )
    }

    const friendList = () => {
        return (
            <>
                <div className="friends">
                    {
                        user.friends.slice(0, 5).map((friend, i) => (
                                <div key={i}>
                                    <i className={"fas fa-user-friends"}/>
                                    <p>{friend.username}</p>
                                </div>
                            )
                        )
                    }
                </div>
            </>
        )
    }

    return (
        <>
            <div className="Home">
                <div className="HomeChild">
                    <div style={{marginLeft: "100px"}}>
                        <i className="fas fa-users fa-3x"/>
                    </div>
                    {/*<Link to={`/chats/${user.id}`} className="btn btn-title" style={{marginLeft: "85px"}}>*/}
                    <button onClick={chatCreate} className="btn btn-title" style={{marginLeft: "85px"}}>
                        Написать
                    </button>
                    {/*</Link>*/}
                </div>
                <div className="HomeChild">
                    <h2>Информация</h2>
                    {userInfoProfile()}
                </div>
                <div className="HomeChild">
                    <h2>Друзья</h2>
                    {friendList()}
                </div>
            </div>
        </>
    );
}

export default ProfileUser;
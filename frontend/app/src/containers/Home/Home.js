import React, {useEffect, useState} from 'react';
import './Home.css'
import {Link, NavLink} from "react-router-dom";
import Loader from "../../components/UI/Loader/Loader";
import {gql, useQuery} from "@apollo/client";
import PostList from "../../components/Posts/PostList/PostList";
import PostCreate from "../../components/Posts/PostCreate/PostCreate";
import FriendList from "../../components/FriendList/FriendList";
import EditProfile from "../../components/Profile/EditProfile/EditProfile";
import {connect} from "react-redux";
import {Redirect} from "react-router";

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

const Home = (props) => {
    const {loading, data} = useQuery(QUERY_USER, {pollInterval: 500});
    if (loading) return <Loader/>;

    const profile = data?.allChats[0]
    const diffFriends = data?.diffUsers


    const profileData = () => {
        return (
            <div key={profile.id}>
                <img src={"https://www.flaticon.com/svg/static/icons/svg/18/18601.svg"} alt="no avatar"
                     className="avatar"/>
                <p>{profile.user.username}</p>
            </div>
        )
    }

    const friends = () => {
        return (
            <div key={profile.id}>
                <h2>Друзья</h2>
                {profile.friends.length === 0 ? <h6>Нет друзей</h6> :
                    <ul>
                        {profile.friends.map((friend, index) => (
                            <div key={index} className="SpaceBetween">
                                <Link to={`/profile/${friend.id}`} className="link">
                                    <li>{friend.username}</li>
                                </Link>
                                <FriendList id={friend.id} icon="fas fa-user-slash"/>
                            </div>
                        ))
                        }
                    </ul>
                }
                <h2>Потенциальные друзья</h2>
                {diffFriends.length === 0 ? <h6>"Нет потенциальных друзей"</h6> :
                    <ul>
                        {diffFriends?.map((friend, id) => (
                            <div key={id} className="SpaceBetween">
                                <Link to={`/users/${friend.id}`} className="link">
                                    <li>{friend.username}</li>
                                </Link>
                                <FriendList id={friend.id} icon="fas fa-user-friends"/>
                            </div>
                        ))
                        }
                    </ul>
                }
            </div>
        )
    }


    return (
        <>
            {props.isAuthenticated ?
                <div className="Home">
                    <div className="HomeChild">
                        {profile ? profileData() : null}
                    </div>
                    <div className="HomeChild basis">
                        <h5 style={{color: "#fff", textAlign: "center"}}>Статус</h5>
                        <div>
                            {data?.allChats
                                ? <EditProfile about={profile.aboutMe}/>
                                : null}
                        </div>
                    </div>
                    <div className="HomeChild basis">
                        <h1>Стена</h1>
                        <PostCreate/>
                        <PostList/>
                    </div>
                    <div className="HomeChild friends">
                        {diffFriends ? friends() : null}
                    </div>
                </div>
                : <Redirect to="/auth"/>
            }
        </>
    )
}

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.auth.token
    }
}

export default connect(mapStateToProps)(Home);
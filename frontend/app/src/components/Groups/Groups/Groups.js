import {gql, useQuery} from '@apollo/client/index';
import React from 'react';
import {
    Link,
} from "react-router-dom";
import Loader from "../../UI/Loader/Loader";
import "../../../containers/Home/Home.css";
import "./Groups.css"
import SubscribeGroup from "../SubscribeGroup/SubscribeGroup";
import CreateGroup from "../CreateGroup/CreateGroup";

const USER_GROUPS = gql`
query{
  allChats{
    groups{
      id
      name
      about
      avatar
      posts{
        message
        createdAt
      }
      subscribers{
        username
        lastName
      }
      owner{
        username
        lastName
      }
    }
  }
  diffGroup{
    id
    name
    about
    avatar
    posts{
      name
      message
      createdAt
    }
    owner{
      username
      lastName
    }
    subscribers{
      username
      lastName
    }
  }
}
`;

const Groups = (props) => {
    const {data, loading} = useQuery(USER_GROUPS, {pollInterval: 1500});
    if (loading) return <Loader/>;

    const groups = data?.allChats[0]
    const friendsGroups = data?.diffGroup

    const groupsList = () => {
        return (
            <div key={groups.id}>
                {groups.groups.length === 0 ? <h6>У Вас нет групп</h6> :
                    groups?.groups.map((group, index) => (
                        <div key={index} className="Groups">
                            <div className="space-between">
                                <i className="fas fa-users fa-3x" style={{marginTop: "20px"}}/>
                                <div>
                                    <p id={group.id}>
                                        <Link to={`/groups/${group.id}`} className="btn btn-title">
                                            {group.name}
                                        </Link>
                                        <SubscribeGroup
                                            id={group.id}
                                            params={{type: "Unsubscribe", icon: "far fa-minus-square"}}
                                        />
                                    </p>
                                </div>
                            </div>
                            <hr/>
                            <div className="space-between">
                                <p>About: {group.about}</p>
                                <div className="subscribers">
                                    <p>Subscribers: {group.subscribers.length}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }

    const friendsGroupsList = () => {
        return (
            <div>
                {friendsGroups.length === 0 ? <h6>Нет таких групп</h6> :
                    friendsGroups.map((group, index) => (
                        <div key={index} className="Groups">
                            <div className="space-between">
                                <i className="fas fa-users fa-3x" style={{marginTop: "20px"}}/>
                                {/*<img src={group.avatar} className="avatar-group" alt="no avatar" />*/}
                                <div>
                                    <p id={group.id}>
                                        <Link to={`/groups/${group.id}`} className="btn btn-title">
                                            {group.name}
                                        </Link>
                                    </p>
                                    <SubscribeGroup
                                        id={group.id}
                                        params={{type: "Subscribe", icon: "far fa-plus-square"}}
                                    />
                                </div>
                            </div>
                            <hr/>
                            <div className="space-between">
                                <p>About: {group.about}</p>
                                <div className="subscribers">
                                    <p>Subscribers: {group.subscribers.length}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }

    return (
        <div className="Home">
            <div className="HomeChild">
                <h2>Группы</h2>
                {groups ? groupsList() : null}
            </div>
            <div className="HomeChild">
                <h2>Группы Ваших друзей</h2>
                {friendsGroups ? friendsGroupsList() : null}
            </div>
            <div className="HomeChild basis">
                <CreateGroup/>
            </div>
        </div>

    )
};

export default Groups;
import React from 'react';
import {gql, useQuery} from "@apollo/client";
import "../../../containers/Home/Home.css";
import GroupPostCreate from "./GroupPostCreate/GroupPostCreate";
import "./GroupInfo.css"
import "../Groups/Groups.css"

const GROUP_ID = gql`
query groupById($id: ID!){
  groupById(id: $id){
    id
    name
    about
    avatar
    subscribers{
      lastName
      username
    }
    owner{
      lastName
      username
    }
    posts{
      name
      message
      createdAt
    }
  }
}
`;

const GroupInfo = (props) => {
    const {loading, error, data} = useQuery(GROUP_ID, {
        variables: {id: props.match.params.id}
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>`Error! ${error}`</p>;

    const group = data?.groupById;

    const groupInfoProfile = () => {
        return (
            <div>
                <p>Название: {group.name}</p>
                <p>О группе: {group.about}</p>
                <div className="owner">
                    <p>Админ: {group.owner.username}</p>
                </div>
            </div>
        )
    }

    const postsGroup = () => {
        return (
            <>
                <div className="Groups">
                    {
                        group.posts.slice(0, 3).map((it, i) => (
                                <div key={i} className="space-between">
                                    <div>
                                        <p>{it.name}</p>
                                        <p>{it.message}</p>
                                    </div>
                                    <p>{it.createdAt}</p>
                                </div>
                            )
                        )
                    }
                </div>
            </>
        )
    }

    const subscribers = () => {
        return (
            <>
                <div className="subscribers">
                    {
                        group.subscribers.slice(0, 3).map((subscriber, i) => (
                                <div key={i}>
                                    <i className={"fas fa-user-friends"}/>
                                    <p>{subscriber.username}</p>
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
                        <p>{group.name}</p>
                    </div>
                </div>
                <div className="HomeChild">
                    <h2>Стена</h2>
                    {groupInfoProfile()}
                </div>
                <div className="HomeChild">
                    <h2>Подписчики</h2>
                    {subscribers()}
                </div>
                <div className="HomeChild basis GroupInfo">
                    <GroupPostCreate id={props.match.params.id}/>
                </div>
                <div className="HomeChild GroupInfo">
                    {postsGroup()}
                </div>
            </div>
        </>
    );
}


export default GroupInfo;
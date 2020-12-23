import {gql, useMutation, useQuery} from '@apollo/client/index';
import React, {useState} from 'react';
import {
    Link,
    useParams
} from "react-router-dom";

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
}
`;

const CREATE_GROUP = gql`
mutation createGroup($name: String!, $avatar: String!, $about: String!){
  createGroup(name: $name, avatar: $avatar, about: $about){
	group{
      name
      about
      subscribers{
        id
        username
      }
    }
  }
}
`;

const CREATE_POST_GROUP = gql`
mutation createPostGroup($id: ID!, $name: String!, $message: String!){
  createGroupPost(id:$id, name: $name, message: $message){
    post{
      name
      message
    }
  }
}
`;

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

const ALL_GROUPS = gql`
query{
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

function GroupCreate() {
    const [formState, setFormState] = useState({
        name: '',
        avatar: '',
        about: ''
    });

    const [createGroup] = useMutation(CREATE_GROUP, {
        variables: {
            name: formState.name,
            avatar: formState.avatar,
            about: formState.about
        }
    });

    const group_create = (
        <div className="col-md-3 m-auto">
            <div className="card card-body mt-2">
                <h2 className="text-center">Group Creation</h2>
                <div className="form-group">
                    <input
                        value={formState.name}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                name: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Group Name"
                    />
                </div>
                <div className="form-group">
                    <input
                        value={formState.avatar}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                avatar: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Choose avatar"
                    />
                </div>
                <div className="form-group">
                    <input
                        value={formState.about}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                about: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Choose about description"
                    />
                </div>
            </div>
            <div className="flex mt3">
                <div className="form-group">
                    <button
                        className="btn btn-danger"
                        onClick={createGroup}
                    >
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        group_create
    );
}

function GroupPostCreate(props) {
    const [formState, setFormState] = useState({
        name: '',
        message: ''
    });

    const [createGroupPost] = useMutation(CREATE_POST_GROUP, {
        variables: {
            id: props.id,
            name: formState.name,
            message: formState.message
        },
        onCompleted: ({post}) => {
            window.location.reload()
        }
    });

    return (
        <div>
            <div className="col-md-3 m-auto">
                <div className="card card-body mt-2">
                    <h2 className="text-center">Create Post</h2>
                    <div className="form-group">
                        <input
                            value={formState.name}
                            onChange={(e) =>
                                setFormState({
                                    ...formState,
                                    name: e.target.value
                                })
                            }
                            type="text"
                            className="form-control"
                            placeholder="Title"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            value={formState.message}
                            onChange={(e) =>
                                setFormState({
                                    ...formState,
                                    message: e.target.value
                                })
                            }
                            type="text"
                            className="form-control"
                            placeholder="Message"
                        />
                    </div>
                </div>
                <div className="flex mt3">
                    <div className="form-group">
                        <button
                            className="btn btn-danger"
                            onClick={createGroupPost}
                        >
                            Create Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Subscribe(props) {
    const [subscribeGroup] = useMutation(SUBSCRIBE_USER, {
        variables: {
            id: props.id
        },
        onCompleted: ({post}) => {
            window.location.reload()
        }
    });

    return (
        <div className="flex mt3">
            <button onClick={subscribeGroup}>{props.type}</button>
        </div>
    );
}

export function GroupInfo() {
    let {id} = useParams();
    const {loading, error, data} = useQuery(GROUP_ID, {
        variables: {id},
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>`Error! ${error}`</p>;

    return (
        <div>
            <p>Название: {data.groupById.name}</p>
            <img src={data.groupById.avatar} alt="no avatar"/>
            <p>О группе: {data.groupById.about}</p>
            <div className="owner">
                <p>Owner: {data.groupById.owner.lastName}
                    with username {data.groupById.owner.username}</p>
            </div>
            <ul className="subscribers">Subscribers:
                {
                    data.groupById.subscribers.slice(0, 3).map((it, i) => (
                            <div key={i}>
                                <li>
                                    <p>{it.lastName} with username {it.username}</p>
                                </li>
                            </div>
                        )
                    )
                }
            </ul>
            <div key={id}>
                <GroupPostCreate id={id}/>
            </div>
            <ul className="posts">Posts:
                {
                    data.groupById.posts.map((it, i) => (
                            <div key={i}>
                                <li>
                                    <p>{it.name}</p>
                                    <p>{it.message}</p>
                                    <p>{it.createdAt} </p>
                                </li>
                            </div>
                        )
                    )
                }
            </ul>
        </div>
    );
}


function YourGroups() {
    const {data, loading} = useQuery(USER_GROUPS, {pollInterval: 1500});
    if (loading) return <p>Loading...</p>;

    const your_group_list = (
        data.allChats.map((chat, id) => (
            <div key={id}>
                {chat.groups.map((item, index) => (
                    <div key={index}>
                        <p id={item.id}>
                            <Link to={`/groups/${item.id}`}>
                                {item.name}
                            </Link>
                        </p>
                        <p>About: {item.about}</p>
                        <div className="subscribeStatus">
                            <Subscribe id={item.id} type="Unsubscribe"/>
                            {/*<button onClick={Subscribe}>*/}
                            {/*    {chat.groups.includes(item) ? "Unsubscribe" : "Subscribe"}*/}
                            {/*</button>*/}
                        </div>
                        <img src={item.avatar} alt="no avatar"/>
                        <ul className="posts">
                            Posts:
                            {
                                item.posts.slice(0, 3).map((it, i) => (
                                        <div key={i}>
                                            <li>
                                                <p>{it.message} - {it.createdAt}  </p>
                                            </li>
                                        </div>
                                    )
                                )
                            }
                        </ul>
                        <ul className="subscribers">
                            Subscribers:
                            {
                                item.subscribers.length
                            }
                        </ul>
                        <div className="owner">
                            <p>Owner: {item.owner.lastName} with username {item.owner.username}</p>
                        </div>
                        <p>_______________</p>
                    </div>
                ))
                }
            </div>
        ))
    );

    return (
        your_group_list
    );

}

function PotentialGroups() {
    const {data, loading} = useQuery(ALL_GROUPS, {pollInterval: 1500});
    if (loading) return <p>Loading...</p>;
    const all_groups = (
        data.diffGroup.map((chat, id) => (
            <div key={id}>
                <p id={chat.id}>
                    <Link to={`/groups/${chat.id}`}>
                        {chat.name}
                    </Link>
                </p>
                <p>About: {chat.about}</p>
                <div className="subscribeStatus">
                    <Subscribe id={chat.id} type="Subscribe"/>
                </div>
                <img src={chat.avatar} alt="no avatar"/>
                <ul className="posts">
                    Posts:
                    {
                        chat.posts.slice(0, 3).map((it, i) => (
                                <div key={i}>
                                    <li>
                                        <p>{it.message} - {it.createdAt}  </p>
                                    </li>
                                </div>
                            )
                        )
                    }
                </ul>
                <ul className="subscribers">
                    Subscribers:
                    {
                        chat.subscribers.length
                    }
                </ul>
                <div className="owner">
                    <p>Owner: {chat.owner.lastName} with username {chat.owner.username}</p>
                </div>
                <p>_______________</p>
            </div>
        ))
    );

    return (
        all_groups
    );
}


export function Groups() {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <GroupCreate/>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <p>Ваши группы:</p>
                    <YourGroups/>
                </div>
                <div className="col-6">
                    <p>Рекомендуемые группы</p>
                    <PotentialGroups/>
                </div>
            </div>
        </div>
    );
}


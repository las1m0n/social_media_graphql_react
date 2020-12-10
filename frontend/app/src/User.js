import React from 'react';
import {useQuery, useMutation} from 'react-apollo';
import {gql} from 'apollo-boost';


const QUERY_USERS = gql`
query {
  users {
    id
    username
    email
  }
}
`;

const CREATE_USER = gql`
mutation createUser ($username: String!, $password: String!, $email: String!){
  createUser (username: $username, password: $password, email: $email){
    user{
       id
       username
       email
     }
    }  
}
`;


export function UserInfo() {
    const {data, loading} = useQuery(QUERY_USERS, {pollInterval: 500});
    if (loading) return <p>Loading...</p>;

    return data.users.map(({id, username, email}) => (
        <div key={id}>
            <p>
                User - {id}: {username} {email}
            </p>
        </div>
    ));
}

export function CreateUser() {

    let inputName, inputPassword, inputEmail;
    const [createUser, {data}] = useMutation(CREATE_USER);

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    createUser({
                        variables: {
                            username: inputName.value,
                            password: inputPassword.value,
                            lastName: inputEmail.value
                        }
                    });
                    inputName.value = '';
                    inputPassword.value = '';
                    inputEmail.value = '';
                    window.location.reload();
                }}
                style={{marginTop: '2em', marginBottom: '2em'}}
            >
                <label>Name: </label>
                <input
                    ref={node => {
                        inputName = node;
                    }}
                    style={{marginRight: '1em'}}
                />

                <label>Last Name: </label>
                <input
                    ref={node => {
                        inputPassword = node;
                    }}
                    style={{marginRight: '1em'}}
                />
                <input
                    ref={node => {
                        inputEmail = node;
                    }}
                    style={{marginRight: '1em'}}
                />
                <button type="submit" style={{cursor: 'pointer'}}>Add a User</button>
            </form>
        </div>
    );

}

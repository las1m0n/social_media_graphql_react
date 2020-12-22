import React, {useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import {useHistory} from 'react-router';

const LOGIN_USER = gql`
mutation TokenAuth($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    token
  }
}`;

const REGISTER_USER = gql`
mutation CreateUser($username: String!, $password: String!, $email: String!, $lastName: String!){
  createUser(username: $username, password: $password, email: $email, lastName: $lastName){
    user{
      id
      username
      email
      lastName
    }    
  }
  tokenAuth(username: $username, password: $password) {
    token
  }
}
`;

export default function Login() {
    const history = useHistory();
    const [formState, setFormState] = useState({
        login: true,
        email: '',
        password: '',
        username: ''
    });


    const [login] = useMutation(LOGIN_USER, {
        variables: {
            username: formState.username,
            password: formState.password
        },
        onCompleted: ({tokenAuth}) => {
            localStorage.setItem('token', tokenAuth.token);
            history.push('/');
        }
    });

    const [signup] = useMutation(REGISTER_USER, {
        variables: {
            username: formState.username,
            email: formState.email,
            password: formState.password,
            lastName: formState.lastName
        },
        onCompleted: ({tokenAuth}) => {
            localStorage.setItem('token', tokenAuth.token);
            history.push('/');
        }
    });

    return (
        <div className="col-md-3 m-auto">
            <div className="card card-body mt-2">
                <h2 className="text-center">{formState.login ? 'Login' : 'Sign Up'}</h2>
                {!formState.login && (
                    <div className="form-group">
                        <input
                            value={formState.email}
                            onChange={(e) =>
                                setFormState({
                                    ...formState,
                                    email: e.target.value
                                })
                            }
                            type="text"
                            className="form-control"
                            placeholder="Your email"
                        />
                        <input
                            value={formState.lastName}
                            onChange={(e) =>
                                setFormState({
                                    ...formState,
                                    lastName: e.target.value
                                })
                            }
                            type="text"
                            className="form-control"
                            placeholder="Your Last Name"
                        />
                    </div>
                )}
                <div className="form-group">
                    <input
                        value={formState.username}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                username: e.target.value
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Your username"
                    />
                </div>
                <div className="form-group">
                    <input
                        value={formState.password}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                password: e.target.value
                            })
                        }
                        type="password"
                        className="form-control"
                        placeholder="Choose a safe password"
                    />
                </div>
            </div>
            <div className="flex mt3">
                <div className="form-group">
                    <button
                        className="btn btn-primary"
                        onClick={formState.login ? login : signup}
                    >
                        {formState.login ? 'login' : 'create account'}
                    </button>
                </div>
                <div className="form-group">
                    <button
                        className="btn btn-primary"
                        onClick={(e) =>
                            setFormState({
                                ...formState,
                                login: !formState.login
                            })
                        }
                    >
                        {formState.login
                            ? 'need to create an account?'
                            : 'already have an account?'}
                    </button>
                </div>
            </div>
        </div>
    );
}

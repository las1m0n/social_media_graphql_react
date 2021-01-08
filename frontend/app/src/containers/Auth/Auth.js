import React from 'react';
import Button from "../../components/UI/Button/Button";
import './Auth.css'
import Input from "../../components/UI/Input/Input";
import is from 'is_js'
// import {connect} from "react-redux";
import {auth} from "../../store/actions/auth";
import {useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {useHistory} from "react-router";
import {connect} from 'react-redux';


const LOGIN_USER = gql`
mutation TokenAuth($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    token
    refreshExpiresIn
    refreshToken
  }
}`;

const REGISTER_USER = gql`
mutation CreateUser($username: String!, $password: String!, $email: String, $lastName: String){
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
    refreshToken
    refreshExpiresIn
  }
}
`;

// rcjc

function Auth(props) {
    const [state, setState] = useState({
        isFormValid: false,
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите корректный Email',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                errorMessage: 'Введите корректный пароль',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        }
    })

    const submitHandler = event => {
        event.preventDefault();
    }


    function validateControl(value, validation) {
        if (!validation) {
            return true
        }

        let isValid = true;
        if (validation.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (validation.email) {
            isValid = is.email(value) && isValid
        }

        if (validation.minLength) {
            isValid = value.length >= validation.minLength && isValid
        }

        return isValid
    }

    const onChangeHandler = (event, controlName) => {
        const formControls = {...state.formControls};
        const control = {...formControls[controlName]}

        control.value = event.target.value;
        control.touched = true;
        control.valid = validateControl(control.value, control.validation)

        formControls[controlName] = control

        let isFormValid = true;
        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        setState({
            formControls, isFormValid
        })
    }

    function renderInputs() {
        return Object.keys(state.formControls).map((controlName, index) => {
            const control = state.formControls[controlName]
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => onChangeHandler(event, controlName)}
                />
            )
        })
    }

    const history = useHistory();

    const [login] = useMutation(LOGIN_USER, {
        variables: {
            username: state.formControls.email.value,
            password: state.formControls.password.value
        },
        onCompleted: ({tokenAuth}) => {
            const expirationDate = new Date(new Date().getTime() + tokenAuth.refreshExpiresIn * 1000)
            localStorage.setItem('token', tokenAuth.token);
            localStorage.setItem('refreshToken', tokenAuth.refreshToken);
            localStorage.setItem('expirationDate', expirationDate)
            history.push('/');
        }
    });

    const [signup] = useMutation(REGISTER_USER, {
        variables: {
            username: state.formControls.email.value,
            password: state.formControls.password.value
        },
        onCompleted: ({tokenAuth}) => {
            const expirationDate = new Date(new Date().getTime() + tokenAuth.refreshExpiresIn * 1000)
            localStorage.setItem('token', tokenAuth.token);
            localStorage.setItem('expirationDate', expirationDate)
            history.push('/');
        }
    });

    return (
        <div className="Auth">
            <div>
                <h1>Авторизация</h1>

                <form onSubmit={submitHandler} className="AuthForm">

                    {renderInputs()}

                    <Button
                        type="green"
                        onClick={login}
                        disabled={!state.isFormValid}
                    >
                        Войти
                    </Button>
                    <Button
                        type="primary"
                        onClick={signup}
                        disabled={!state.isFormValid}
                    >
                        Регистрация
                    </Button>
                </form>
            </div>
        </div>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (token, expiresIn) => dispatch(auth(token, expiresIn)),
    }
}

export default connect(null, mapDispatchToProps)(Auth);

import {AUTH_SUCCESS, AUTH_LOGOUT} from './actionTypes';

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}


export function auth(token, expiresIn) {
    return async dispatch => {
        dispatch(authSuccess(token))
        dispatch(autoLogout(expiresIn))
    }
}

export function autoLogin() {
    return dispatch => {
        const token = localStorage.getItem('token')
        if (!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token))
                // dispatch(autoLogout(expirationDate.getTime() - new Date().getTime() / 1000))
            }
        }
    }
}

export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem("expirationDate")
    return {
        type: AUTH_LOGOUT,
    }
}
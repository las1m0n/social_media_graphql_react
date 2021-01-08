import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import './index.css';
import App from './App';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from "./store/reducers/rootReducer";
import thunk from "redux-thunk";
import {ApolloClient, createHttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import {setContext} from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql/'
});

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : null,
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});


const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk)
    )
)

const app = (
    <BrowserRouter>
        <Provider store={store}>
            <ApolloProvider client={client}>
                <App/>
            </ApolloProvider>
        </Provider>
    </BrowserRouter>
)

ReactDOM.render(
    app, document.getElementById('root')
);

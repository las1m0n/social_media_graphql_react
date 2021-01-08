import React, {useEffect} from "react";
import './App.css';
import Layout from "./hoc/Layout/Layout";
import ProfileUser from "./components/Profile/ProfileUser/ProfileUser";
import Home from "./containers/Home/Home";
import Groups from "./components/Groups/Groups/Groups";
import Chats from "./components/Chats/Chats/Chats";
import GroupInfo from "./components/Groups/GroupInfo/GroupInfo";
import ChatInfo from "./components/Chats/ChatInfo/ChatInfo";
import Auth from "./containers/Auth/Auth";
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import Logout from "./components/Logout/Logout";
import {autoLogin} from "./store/actions/auth";


const App = (props) => {
    useEffect(() => {
            props.autoLogin();
        }
    )

    let routes = (
        <Switch>
            <Route path="/auth" component={Auth}/>
            <Redirect exact to="/auth"/>
        </Switch>
    )
    console.log(props.isAuthenticated)
    if (props.isAuthenticated) {
        routes = (
            <Switch>
                <Route exact path="/groups" component={Groups}/>
                <Route exact path="/chats" component={Chats}/>
                <Route path="/profile/:id" component={ProfileUser}/>
                <Route path="/groups/:id" component={GroupInfo}/>
                <Route path="/chats/:id" component={ChatInfo}/>
                <Route exact path="/logout" component={Logout}/>
                <Route path="/" exact component={Home}/>
                <Redirect to="/"/>
            </Switch>
        )
    }

    return (
        <Layout>
            {routes}
        </Layout>
    )
}

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.auth.token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        autoLogin: () => dispatch(autoLogin())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

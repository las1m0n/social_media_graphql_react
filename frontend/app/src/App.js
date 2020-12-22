import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Media from './components/Media';
import Login from './components/Login';
import Header from './components/Header';
import {Chats, ChatInfo} from './components/common/Chats';
import {Posts} from './components/common/Posts';
import {Groups, GroupInfo} from './components/common/Groups';
import {UserInfo} from './components/common/User';


const App = () => (
    <Router>
        <div>
            <Header/>
            <Switch>
                <Route exact path="/login/" component={Login}/>
                <Route exact path="/" component={Media}/>
                <Route exact path="/chats/" component={Chats}/>
                <Route exact path="/groups/" component={Groups}/>
                <Route exact path="/posts/" component={Posts}/>
                <Route name="group" path="/groups/:id" component={GroupInfo}/>
                <Route name="users" path="/users/:id" component={UserInfo}/>
                <Route name="chats" path="/chats/:id" component={ChatInfo}/>
            </Switch>
        </div>
    </Router>
);

export default App;

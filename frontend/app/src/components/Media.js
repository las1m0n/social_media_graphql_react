import React from 'react'
import {User} from './common/User';
import {useHistory} from 'react-router';
import {Link } from 'react-router-dom';

export default function Media() {
    const history = useHistory();
    const authToken = localStorage.getItem('token');

    return (
        <div>
            {authToken
                ?
                (<div>
                    <Link to="/chats/" className="ml1 no-underline black">Chats</Link>
                    <Link to="/groups/" className="ml1 no-underline black">Groups</Link>
                    <Link to="/posts/" className="ml1 no-underline black">Posts</Link>
                    <User/>
                </div>)
                :
                history.push('/login')
            }
        </div>
    );
}
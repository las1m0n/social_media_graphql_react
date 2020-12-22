import React from 'react'
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Header = () => {
    const history = useHistory();
    const authToken = localStorage.getItem('token');
    return (
        <div className="flex pa1 justify-between nowrap orange">
            <div className="flex flex-fixed black">
                <div className="fw7 mr1">Social Media</div>
                <Link to="/" className="ml1 no-underline black">
                    Main Page
                </Link>
            </div>
            <div className="flex flex-fixed">
                {authToken ? (
                    <div
                        className="ml1 pointer black"
                        onClick={() => {
                            localStorage.removeItem('token');
                            history.push(`/login`);
                        }}
                    >
                        logout
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="ml1 no-underline black"
                    >
                        login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
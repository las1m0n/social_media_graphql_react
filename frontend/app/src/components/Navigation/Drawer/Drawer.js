import React from 'react';
import './Drawer.css';
import Backdrop from "../../UI/Backdrop/Backdrop";
import {NavLink} from 'react-router-dom';

export default class Drawer extends React.Component {
    clickHandler = () => {
        this.props.onClose();
    }

    renderLinks(links) {
        return links.map((link, index) => {
            return (
                <li key={index}>
                    <NavLink
                        to={link.to}
                        exact={link.exact}
                        onClick={this.clickHandler}
                    >
                        {link.label}
                    </NavLink>
                </li>
            )
        })
    }

    render() {
        const cls = ['Drawer']
        if (!this.props.isOpen) {
            cls.push('close')
        }

        const links = [];

        if (this.props.isAuthenticated) {
            links.push({to: '/', label: "Профиль", exact: true},)
            links.push({to: '/groups', label: "Группы", exact: true},)
            links.push({to: '/chats', label: "Чаты", exact: true},)
            links.push({to: '/logout', label: 'Выйти', exact: false})
        } else {
            links.push({to: '/auth', label: "Авторизация", exact: false})
        }

        return (
            <React.Fragment>
                <nav className={cls.join(' ')}>
                    <ul>
                        {this.renderLinks(links)}
                    </ul>
                </nav>
                {this.props.isOpen ? <Backdrop onClick={this.props.onClose}/> : null}
            </React.Fragment>
        )
    }
}

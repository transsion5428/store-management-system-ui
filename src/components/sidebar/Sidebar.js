import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleRight,
    faHouse,
    faTags,
    faBoxesStacked,
    faTruckFast,
    faBasketShopping,
    faUsers,
    faHandHoldingDollar,
    faUsersGear
} from '@fortawesome/free-solid-svg-icons';

import logo from '../../assets/logo.png';
import './sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [menus, setMenus] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const storedUser = JSON.parse(
            localStorage.getItem('user') || 'null'
        );

        const storedMenus = JSON.parse(
            localStorage.getItem('menus') || '[]'
        );

        setUser(storedUser);
        setMenus(storedMenus);
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'home':
                return faHouse;

            case 'category':
                return faTags;

            case 'inventory':
                return faBoxesStacked;

            case 'truck':
                return faTruckFast;

            case 'shopping':
                return faBasketShopping;

            case 'positions':
                return faUsers;

            case 'users':
                return faUsers;

            case 'sales':
                return faHandHoldingDollar;

            default:
                return faHouse;
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={`sidebar-container ${isSidebarOpen ? 'close' : ''}`}>
            <header>
                <div className="image-text">
                    <span className="image">
                        <img src={logo} alt="" />
                    </span>

                    <div className="text logo-text">
                        <span className="name">TECNO</span>
                        <span className="profession">Inventory</span>
                    </div>
                </div>

                <FontAwesomeIcon
                    icon={faAngleRight}
                    className="toggle"
                    onClick={toggleSidebar}
                />
            </header>

            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        {menus.map((menu) => (
                            <li
                                key={menu.id}
                                className={`nav-link ${isActive(menu.path) ? 'selected' : ''
                                    }`}
                            >
                                <Link to={menu.path}>
                                    <FontAwesomeIcon
                                        icon={getIcon(menu.icon)}
                                        className="icon"
                                    />

                                    <span className="text nav-text">
                                        {menu.menuName}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {user?.admin === true && (
                    <div className="bottom-content">
                        <ul>
                            <li
                                className={`${isActive('/users') ? 'selected' : ''
                                    }`}
                            >
                                <Link to="/users">
                                    <FontAwesomeIcon
                                        icon={faUsersGear}
                                        className="icon"
                                    />

                                    <span className="text nav-text">
                                        Users
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Sidebar;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faCaretDown,
    faUserGear,
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import './navbar.css';

const Navbar = ({ tabs, activePath, closeTab }) => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const textRef = useRef(null);
    const optionsRef = useRef(null);

    const handleToggleOptions = () => {
        setIsOpen(!isOpen);
    };

    function handleLogout(event) {
        event.preventDefault();
        localStorage.clear();
        navigate('/login');
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleClickOutside = (event) => {
            if (
                textRef.current &&
                !textRef.current.contains(event.target) &&
                optionsRef.current &&
                !optionsRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={`navbar-container ${isOpen ? 'open' : ''}`}>
            <div className="tabs-container">
                {tabs.map((tab) => (
                    <div
                        key={tab.path}
                        className={`page-tab ${activePath === tab.path ? 'active' : ''}`}
                        onClick={() => navigate(tab.path)}
                    >
                        <span>{tab.title}</span>

                        {tab.path !== '/home' && (
                            <button
                                className="close-tab"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeTab(tab.path);
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div
                className="text"
                onClick={handleToggleOptions}
                ref={textRef}
            >
                <FontAwesomeIcon icon={faUser} className="icon" />
                <span className="username">{user ? user.name : ''}</span>
                <FontAwesomeIcon icon={faCaretDown} className="arrow-icon" />
            </div>

            {isOpen && (
                <div className="options" ref={optionsRef}>
                    <ul>
                        <li>
                            <Link to={`/edit-user/${user ? user.userId : 0}`}>
                                <FontAwesomeIcon icon={faUserGear} className="icon" />
                                <span className="nav-text">Profile</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
                                <span className="nav-text">Logout</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
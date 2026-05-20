import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faChevronDown,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';

import './assignMenus.css';

import { API } from '../../../env';

const AssignSubMenus = ({
    menu,
    selectedSubMenus,
    setSelectedSubMenus
}) => {

    const [expanded, setExpanded] = useState(false);

    const [subMenus, setSubMenus] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // FETCH SUB MENUS
    const fetchSubMenus = async () => {

        try {

            setIsLoading(true);

            const res = await fetch(
                `${API}/api/v1/sub-menus/menu/${menu.value}`
            );

            const data = await res.json();

            setSubMenus(data);

        } catch (err) {

            console.error(err);

        } finally {

            setIsLoading(false);
        }
    };

    // LOAD WHEN EXPANDED
    useEffect(() => {

        if (expanded) {

            fetchSubMenus();
        }

    }, [expanded]);

    // HANDLE SUB MENU CHECKBOX
    const handleCheckbox = (subMenuId) => {

        setSelectedSubMenus(prev => {

            if (prev.includes(subMenuId)) {

                return prev.filter(id => id !== subMenuId);
            }

            return [...prev, subMenuId];
        });
    };

    return (
        <div className="submenu-wrapper">

            {/* EXPAND BUTTON */}

            <div className="submenu-header">

                <div className="submenu-title">

                    <span>
                        Sub Menus
                    </span>

                </div>

                <button
                    className="expand-btn"
                    onClick={() => setExpanded(!expanded)}
                >

                    <FontAwesomeIcon
                        icon={
                            expanded
                                ? faChevronDown
                                : faChevronRight
                        }
                    />

                </button>

            </div>

            {/* SUB MENUS */}

            {expanded && (

                <div className="submenu-list">

                    {isLoading ? (

                        <div className="no-submenu">
                            Loading...
                        </div>

                    ) : subMenus.length > 0 ? (

                        subMenus.map(subMenu => (

                            <div
                                key={subMenu.id}
                                className="submenu-item"
                            >

                                <input
                                    type="checkbox"
                                    checked={selectedSubMenus.includes(subMenu.id)}
                                    onChange={() => handleCheckbox(subMenu.id)}
                                />

                                <label>
                                    {subMenu.name}
                                </label>

                            </div>
                        ))

                    ) : (

                        <div className="no-submenu">
                            No Sub Menus Found
                        </div>

                    )}

                </div>
            )}

        </div>
    );
};

export default AssignSubMenus;
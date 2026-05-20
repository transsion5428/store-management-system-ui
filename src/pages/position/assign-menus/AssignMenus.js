import React, { useEffect, useState } from 'react';
import './assignMenus.css';
import { API } from '../../../env';

const AssignMenus = ({ position, onClose }) => {
    const [menus, setMenus] = useState([]);
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [selectedSubMenus, setSelectedSubMenus] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const fetchMenus = async () => {
        try {
            const res = await fetch(`${API}/api/v1/menu/all`);
            const data = await res.json();

            setMenus(data);

            if (position?.menus) {
                setSelectedMenus(position.menus.map(menu => menu.id));

                const subMenuIds = position.menus.flatMap(
                    menu => menu.subMenus?.map(sub => sub.id) || []
                );

                setSelectedSubMenus(subMenuIds);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const toggleExpand = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleMenuCheckbox = (menu) => {
        const menuId = menu.id;
        const subMenuIds = menu.subMenus?.map(sub => sub.id) || [];

        if (selectedMenus.includes(menuId)) {
            setSelectedMenus(prev =>
                prev.filter(id => id !== menuId)
            );

            setSelectedSubMenus(prev =>
                prev.filter(id => !subMenuIds.includes(id))
            );
        } else {
            setSelectedMenus(prev => [...prev, menuId]);
        }
    };

    const handleSubMenuCheckbox = (menu, subMenuId) => {
        if (selectedSubMenus.includes(subMenuId)) {
            const updated = selectedSubMenus.filter(id => id !== subMenuId);
            setSelectedSubMenus(updated);
        } else {
            setSelectedSubMenus(prev => [...prev, subMenuId]);

            if (!selectedMenus.includes(menu.id)) {
                setSelectedMenus(prev => [...prev, menu.id]);
            }
        }
    };

    const handleSubmit = async () => {
        setSubmitDisabled(true);

        try {
            const permissions = selectedMenus.map(menuId => {
                const menu = menus.find(m => m.id === menuId);

                return {
                    menuId,
                    subMenuIds:
                        menu?.subMenus
                            ?.filter(sub =>
                                selectedSubMenus.includes(sub.id)
                            )
                            .map(sub => sub.id) || []
                };
            });

            const payload = {
                permissions
            };

            const res = await fetch(
                `${API}/api/v1/positions/${position.id}/permissions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                throw new Error('Failed to assign permissions');
            }

            alert('Permissions assigned successfully');
            onClose();

        } catch (err) {
            console.error(err);
            alert('Error assigning permissions');
        } finally {
            setSubmitDisabled(false);
        }
    };
    return (
        <div className="drawer-content">
            <div className="menus-container">
                {menus.map(menu => (
                    <div key={menu.id} className="menu-card">

                        <div className="menu-header">
                            <div className="menu-left">
                                <input
                                    type="checkbox"
                                    checked={selectedMenus.includes(menu.id)}
                                    onChange={() => handleMenuCheckbox(menu)}
                                />

                                <label>{menu.menuName}</label>
                            </div>

                            {menu.subMenus?.length > 0 && (
                                <button
                                    className="expand-btn"
                                    onClick={() => toggleExpand(menu.id)}
                                >
                                    {expandedMenus[menu.id] ? '▼' : '▶'}
                                </button>
                            )}
                        </div>

                        {expandedMenus[menu.id] && menu.subMenus?.length > 0 && (
                            <div className="submenu-container">
                                {menu.subMenus.map(subMenu => (
                                    <div
                                        key={subMenu.id}
                                        className="submenu-checkbox"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSubMenus.includes(subMenu.id)}
                                            onChange={() =>
                                                handleSubMenuCheckbox(
                                                    menu,
                                                    subMenu.id
                                                )
                                            }
                                        />

                                        <label>{subMenu.name}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="button-container">
                <button
                    className="btn"
                    onClick={handleSubmit}
                    disabled={submitDisabled}
                >
                    Save Menus
                </button>
            </div>
        </div>
    );
};

export default AssignMenus;
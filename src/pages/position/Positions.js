import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import './positions.css';
import '../../styles/addbox.css';

import SearchBox from '../../components/search-box/SearchBox';
import Loading from '../../components/loading/Loading';

import { useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import AssignMenusDrawer from './assign-menus/AssignMenusDrawer';

// 🔥 IMPORT DRAWER
import NewPositionDrawer from './new-position/NewPositionDrawer';

const Positions = () => {

    localStorage.setItem('selectedView', 'positions');

    const navigate = useNavigate();

    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);

    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // DRAWER STATE
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);

    const [selectedPosition, setSelectedPosition] = useState(null);

    const fetchPositions = async () => {
        try {
            setIsLoading(true);

            // 1. Get positions
            const res = await fetch(`${API}/api/v1/positions`);
            const positionsData = await res.json();

            // 2. Get permissions for each position
            const enrichedPositions = await Promise.all(
                positionsData.map(async (position) => {
                    try {
                        const permissionRes = await fetch(
                            `${API}/api/v1/positions/${position.id}/permissions`
                        );

                        const permissionData = await permissionRes.json();

                        return {
                            ...position,
                            menus: permissionData.menus || []
                        };
                    } catch (err) {
                        console.error(`Permission fetch failed for position ${position.id}`, err);
                        return {
                            ...position,
                            menus: []
                        };
                    }
                })
            );

            setPositions(enrichedPositions);
            setFilteredPositions(enrichedPositions);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        if (!userVerification().isAuthenticated) {

            localStorage.clear();

            navigate('/login');

            return;
        }

        fetchPositions();

    }, [navigate]);

    // SEARCH
    useEffect(() => {

        const filtered = positions.filter((p) =>
            p.name?.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredPositions(filtered);

    }, [query, positions]);

    return (
        <div className="categories-container">

            <div className="text">
                Positions
            </div>

            <div className="options">

                <SearchBox
                    onSearch={(q) => setQuery(q)}
                    disabled={isLoading}
                />

                <button
                    className="add-box"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />

                    <span>
                        New Position
                    </span>

                </button>

            </div>

            {isLoading ? (

                <Loading />

            ) : (

                <div className="table-container">

                    <table className="table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>DESCRIPTION</th>
                                <th>MENUS</th>
                                <th>ASSIGN MENUS</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredPositions.length > 0 ? (

                                filteredPositions.map((position) => (

                                    <tr key={position.id}>

                                        <td>{position.id}</td>

                                        <td>{position.name}</td>

                                        <td>{position.description}</td>

                                        <td>
                                            {position.menus?.length > 0 ? (
                                                position.menus.map((menu) => (
                                                    <div key={menu.id} style={{ marginBottom: "8px" }}>
                                                        <strong>{menu.menuName}</strong>

                                                        {menu.subMenus?.length > 0 && (
                                                            <div style={{ marginLeft: "12px", color: "#666" }}>
                                                                {menu.subMenus.map((sub) => sub.name).join(", ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                "No Menus"
                                            )}
                                        </td>
                                        <td>

                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setSelectedPosition(position);
                                                    setAssignDrawerOpen(true);
                                                }}
                                            >
                                                Assign Menus
                                            </button>

                                        </td>

                                    </tr>
                                ))

                            ) : (

                                <tr>
                                    <td colSpan="4">
                                        No Positions Found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
            )}

            {/* 🔥 DRAWER */}

            {isDrawerOpen && (

                <div
                    className="drawer-overlay"
                    onClick={() => setIsDrawerOpen(false)}
                >

                    <div
                        className="drawer"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="drawer-header">

                            <h3>
                                New Position
                            </h3>

                            <button onClick={() => setIsDrawerOpen(false)}>
                                ✖
                            </button>

                        </div>

                        {/* 🔥 DRAWER COMPONENT */}

                        <NewPositionDrawer
                            onClose={() => {
                                setIsDrawerOpen(false);
                                fetchPositions();
                            }}
                        />

                    </div>

                </div>
            )}


            {assignDrawerOpen && (
                <div
                    className="drawer-overlay"
                    onClick={() => setAssignDrawerOpen(false)}
                >

                    <div
                        className="drawer"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="drawer-header">

                            <h3>
                                Assign Menus
                            </h3>

                            <button onClick={() => setAssignDrawerOpen(false)}>
                                ✖
                            </button>

                        </div>

                        <AssignMenusDrawer
                            position={selectedPosition}
                            onClose={() => {
                                setAssignDrawerOpen(false);
                                fetchPositions();
                            }}
                        />

                    </div>

                </div>
            )}

        </div>
    );
};

export default Positions;
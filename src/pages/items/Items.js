import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import './items.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';
import EditItemDrawer from './edit-item/EditItemDrawer';
import NewItemDrawer from './new-item/NewItemDrawer';

const Items = () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [paginator, setPaginator] = useState({});

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [drawerType, setDrawerType] = useState(null); // 🔥 NEW

    const navigate = useNavigate();

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);

                const url = new URL(`${API}/api/v1/article`);
                url.search = new URLSearchParams({
                    searchCriteria: query,
                    page,
                    pageSize: 5
                });

                const res = await fetch(url);
                const data = await res.json();
                setPaginator(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [query, page, navigate]);

    return (
        <div className="items-container">

            {/* SEARCH + BUTTON */}
            <div className="options">
                <SearchBox onSearch={setQuery} disabled={isLoading} />

                {/* 🔥 NEW ITEM BUTTON (DRAWER) */}
                <button
                    className="add-box"
                    onClick={() => {
                        setDrawerType('NEW');
                        setIsDrawerOpen(true);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New Item</span>
                </button>
            </div>

            {isLoading ? <Loading /> : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>BRAND</th>
                                <th>CATEGORY</th>
                                <th>STOCK</th>
                                <th>PURCHASE</th>
                                <th>SALE</th>
                                <th>WEIGHT</th>
                                <th>SUPPLIER</th>
                                <th>EDIT</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginator.articles?.map((a) => (
                                <tr key={a.articleId}>
                                    <td>{a.articleId}</td>
                                    <td>{a.name}</td>
                                    <td>{a.brand}</td>
                                    <td>{a.category?.name}</td>
                                    <td>{a.stock}</td>
                                    <td>${a.purchasePrice}</td>
                                    <td>${a.salePrice}</td>
                                    <td>{a.weight}</td>
                                    <td>{a.provider?.name}</td>

                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                setSelectedItemId(a.articleId);
                                                setDrawerType('EDIT'); // 🔥
                                                setIsDrawerOpen(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination paginator={paginator} onChangePage={setPage} />
                </div>
            )}

            {/* DRAWER */}
            {isDrawerOpen && (
                <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
                    <div className="drawer" onClick={(e) => e.stopPropagation()}>

                        <div className="drawer-header">
                            <h3>{drawerType === 'EDIT' ? 'Edit Item' : 'New Item'}</h3>
                            <button onClick={() => setIsDrawerOpen(false)}>✖</button>
                        </div>

                        {drawerType === 'EDIT' ? (
                            <EditItemDrawer
                                id={selectedItemId}
                                onClose={() => setIsDrawerOpen(false)}
                            />
                        ) : (
                            <NewItemDrawer
                                onClose={() => setIsDrawerOpen(false)}
                            />
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default Items;
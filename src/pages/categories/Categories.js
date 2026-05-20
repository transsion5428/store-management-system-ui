import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import './categories.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

// 👉 NEW (like Items)
import NewCategoryDrawer from './new-category/NewCategoryDrawer';
import EditCategoryDrawer from './edit-category/EditCategoryDrawer';

const Categories = () => {

    localStorage.setItem('selectedView', 'categories');

    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [isLoading, setIsLoading] = useState(true);
    const [paginator, setPaginator] = useState({});

    // 👉 Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState(null); // NEW | EDIT
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const navigate = useNavigate();

    // 👉 FETCH FUNCTION (Reusable 🔥)
    const fetchData = async () => {
        try {
            setIsLoading(true);

            const url = new URL(`${API}/api/v1/category`);
            url.search = new URLSearchParams({
                searchCriteria: query,
                page,
                pageSize
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

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        fetchData();
    }, [navigate, query, page]);

    const handleSearch = (q) => setQuery(q);
    const handlePage = (p) => setPage(p);

    return (
        <div className="categories-container">

            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />

                {/* 🔥 NEW CATEGORY (DRAWER) */}
                <button
                    className="add-box"
                    onClick={() => {
                        setDrawerType('NEW');
                        setIsDrawerOpen(true);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New Category</span>
                </button>
            </div>

            {isLoading ? <Loading /> : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EDIT</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginator.categories?.length > 0 ? (
                                paginator.categories.map(category => (
                                    <tr key={category.categoryId}>
                                        <td>{category.categoryId}</td>
                                        <td>{category.name}</td>

                                        <td>
                                            {/* 🔥 EDIT (DRAWER) */}
                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setSelectedCategoryId(category.categoryId);
                                                    setDrawerType('EDIT');
                                                    setIsDrawerOpen(true);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No results found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination paginator={paginator} onChangePage={handlePage} />
                </div>
            )}

            {/* 🔥 DRAWER */}
            {isDrawerOpen && (
                <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
                    <div className="drawer" onClick={(e) => e.stopPropagation()}>

                        <div className="drawer-header">
                            <h3>{drawerType === 'EDIT' ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={() => setIsDrawerOpen(false)}>✖</button>
                        </div>

                        {drawerType === 'EDIT' ? (
                            <EditCategoryDrawer
                                id={selectedCategoryId}
                                onClose={() => {
                                    setIsDrawerOpen(false);
                                    fetchData(); 
                                }}
                            />
                        ) : (
                            <NewCategoryDrawer
                                onClose={() => {
                                    setIsDrawerOpen(false);
                                    fetchData(); // 🔥 refresh
                                }}
                            />
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default Categories;
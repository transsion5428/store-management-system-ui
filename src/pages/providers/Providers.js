import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import './providers.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';
import NewProviderDrawer from './new-provider/NewProviderDrawer';
import EditProviderDrawer from './edit-provider/EditProviderDrawer';

const Providers = () => {
    localStorage.setItem('selectedView', 'providers');

    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [paginator, setPaginator] = useState({});

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProviderId, setSelectedProviderId] = useState(null);
    const [drawerType, setDrawerType] = useState(null);

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

                const url = new URL(`${API}/api/v1/provider`);
                url.search = new URLSearchParams({
                    searchCriteria: query,
                    page,
                    pageSize: 10
                });

                const response = await fetch(url);
                const result = await response.json();
                setPaginator(result);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [query, page, navigate]);

    return (
        <div className="providers-container">
            <div className="options">
                <SearchBox
                    onSearch={setQuery}
                    disabled={isLoading}
                />

                <button
                    className="provider-add-btn"
                    onClick={() => {
                        setDrawerType('NEW');
                        setIsDrawerOpen(true);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New Supplier</span>
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
                                <th>PHONE</th>
                                <th>EMAIL</th>
                                <th>GSTN No.</th>
                                <th>PAN No.</th>
                                <th>TAN No.</th>
                                <th>EDIT</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginator.providers?.length > 0 ? (
                                paginator.providers.map((provider) => (
                                    <tr key={provider.providerId}>
                                        <td>{provider.providerId}</td>
                                        <td>{provider.name}</td>
                                        <td>{provider.phoneNumber}</td>
                                        <td>{provider.email}</td>
                                        <td>{provider.gst}</td>
                                        <td>{provider.pan}</td>
                                        <td>{provider.tan}</td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setSelectedProviderId(provider.providerId);
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
                                    <td colSpan="5" className="no-results">
                                        No suppliers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination
                        paginator={paginator}
                        onChangePage={setPage}
                    />
                </div>
            )}

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
                                {drawerType === 'EDIT'
                                    ? 'Edit Supplier'
                                    : 'New Supplier'}
                            </h3>

                            <button onClick={() => setIsDrawerOpen(false)}>
                                ✖
                            </button>
                        </div>

                        {drawerType === 'EDIT' ? (
                            <EditProviderDrawer
                                id={selectedProviderId}
                                onClose={() => setIsDrawerOpen(false)}
                            />
                        ) : (
                            <NewProviderDrawer
                                onClose={() => setIsDrawerOpen(false)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Providers;
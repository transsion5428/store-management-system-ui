import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faPen,
    faEye,
    faXmark
} from '@fortawesome/free-solid-svg-icons';

import './providers.css';

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

    // ================= FILE POPUP =================
    const [isFilePopupOpen, setIsFilePopupOpen] = useState(false);

    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    const navigate = useNavigate();

    // ================= FETCH =================
    const fetchProviders = async () => {

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

    // ================= OPEN FILE POPUP =================
    const openFilePopup = (fileName) => {

        if (!fileName) {

            alert('File not available');

            return;
        }

        const fileUrl = `${API}/api/v1/api/files/view/${fileName}`;

        setSelectedFileUrl(fileUrl);

        setIsFilePopupOpen(true);
    };

    // ================= CLOSE FILE POPUP =================
    const closeFilePopup = () => {

        setSelectedFileUrl('');

        setIsFilePopupOpen(false);
    };

    useEffect(() => {

        if (!userVerification().isAuthenticated) {

            localStorage.clear();

            navigate('/login');

            return;
        }

        fetchProviders();

    }, [query, page]);

    return (

        <div className="items-container">

            {/* ================= FILTER BAR ================= */}

            <div className="filter-bar">

                <input
                    type="text"
                    placeholder="Search Supplier"
                    value={query}
                    onChange={(e) => {

                        setPage(1);

                        setQuery(e.target.value);
                    }}
                />

                <button
                    className="clear-btn"
                    onClick={() => {

                        setQuery('');

                        setPage(1);
                    }}
                >
                    Clear
                </button>

            </div>

            {/* ================= ACTION BAR ================= */}

            <div className="action-bar">

                <button
                    className="action-btn add-action"
                    onClick={() => {

                        setDrawerType('NEW');

                        setIsDrawerOpen(true);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />

                    Add Supplier
                </button>

            </div>

            {/* ================= TABLE ================= */}

            {isLoading ? (

                <Loading />

            ) : (

                <div className="table-section">

                    <div className="table-wrapper">

                        <table className="scrollable-table">

                            <thead>

                                <tr>

                                    <th>NAME</th>

                                    <th>PHONE</th>

                                    <th>EMAIL</th>

                                    <th>GSTN No.</th>

                                    <th>PAN No.</th>

                                    <th>TAN No.</th>

                                    <th>ACTION</th>

                                </tr>

                            </thead>

                            <tbody>

                                {paginator.providers?.length > 0 ? (

                                    paginator.providers.map((provider) => (

                                        <tr key={provider.providerId}>

                                            <td>{provider.name}</td>

                                            <td>{provider.phoneNumber}</td>

                                            <td>{provider.email}</td>

                                            {/* ================= GST ================= */}
                                            <td>

                                                <div className="doc-cell">

                                                    <span className="doc-number">
                                                        {provider.gst}
                                                    </span>

                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            openFilePopup(provider.gstnUrl)
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>

                                                </div>

                                            </td>

                                            {/* ================= PAN ================= */}
                                            <td>

                                                <div className="doc-cell">

                                                    <span className="doc-number">
                                                        {provider.pan}
                                                    </span>

                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            openFilePopup(provider.panUrl)
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>

                                                </div>

                                            </td>

                                            {/* ================= TAN ================= */}
                                            <td>

                                                <div className="doc-cell">

                                                    <span className="doc-number">
                                                        {provider.tan}
                                                    </span>

                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            openFilePopup(provider.tanUrl)
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>

                                                </div>

                                            </td>

                                            <td>

                                                <button
                                                    className="action-btn edit-action"
                                                    onClick={() => {

                                                        setSelectedProviderId(provider.providerId);

                                                        setDrawerType('EDIT');

                                                        setIsDrawerOpen(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPen} />

                                                    Edit Supplier
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="no-results"
                                        >
                                            No suppliers found
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* ================= PAGINATION ================= */}

                    <div className="pagination-fixed">

                        <Pagination
                            paginator={paginator}
                            onChangePage={setPage}
                        />

                    </div>

                </div>

            )}

            {/* ================= DRAWER ================= */}

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

                            <button
                                onClick={() => setIsDrawerOpen(false)}
                            >
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

            {/* ================= FILE POPUP ================= */}

            {isFilePopupOpen && (

                <div
                    className="file-popup-overlay"
                    onClick={closeFilePopup}
                >

                    <div
                        className="file-popup"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="file-popup-header">

                            <h3>Document Preview</h3>

                            <button onClick={closeFilePopup}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>

                        </div>

                        <div className="file-popup-body">

                            <img
                                src={selectedFileUrl}
                                alt="Document"
                                className="preview-image"
                            />

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
};

export default Providers;
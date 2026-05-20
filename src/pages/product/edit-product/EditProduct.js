import React, { useEffect, useState, useRef } from 'react';
import { API } from '../../../env';

const EditProduct = ({ selectedProducts = [], onClose, fetchProducts }) => {
    const [loading, setLoading] = useState(false);
    const [providers, setProviders] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);
    const [providerSearch, setProviderSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchProviders();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await fetch(`${API}/api/v1/provider/dropdown`);

            if (!response.ok) {
                throw new Error('Failed to fetch providers');
            }

            const data = await response.json();
            setProviders(data || []);
        } catch (error) {
            console.error('Provider Fetch Error:', error);
        }
    };

    const filteredProviders = providers.filter((provider) => {
        const alreadySelected = selectedProviders.some(
            (selected) => selected.value === provider.value
        );

        const matchesSearch = provider.label
            .toLowerCase()
            .includes(providerSearch.toLowerCase());

        return !alreadySelected && matchesSearch;
    });

    const addProvider = (provider) => {
        setSelectedProviders((prev) => [...prev, provider]);
        setProviderSearch('');
        setShowDropdown(false);
    };

    const removeProvider = (providerId) => {
        setSelectedProviders((prev) =>
            prev.filter((provider) => provider.value !== providerId)
        );
    };

    const handleAssignProvider = async () => {
        try {
            setLoading(true);

            const payload = {
                productIds: selectedProducts.map(
                    (product) => product.productId
                ),
                providerIds: selectedProviders.map(
                    (provider) => provider.value
                )
            };

            const response = await fetch(
                `${API}/api/v1/product/map-product-provider`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to assign providers');
            }

            fetchProducts?.();
            onClose?.();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <span style={styles.headerIndicator}></span>
                        <h2 style={styles.title}>Assign Providers</h2>
                    </div>

                    <button style={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div style={styles.body}>
                    <div style={styles.field}>
                        <label style={styles.label}>Selected Products</label>

                        <div style={styles.productContainer}>
                            {selectedProducts?.length > 0 ? (
                                selectedProducts.map((product) => (
                                    <div
                                        key={product.productId}
                                        style={styles.productChip}
                                    >
                                        {product.model}
                                    </div>
                                ))
                            ) : (
                                <span style={styles.emptyText}>
                                    No products selected
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Select Providers</label>

                        <div style={styles.selectedProvidersContainer}>
                            {selectedProviders.map((provider) => (
                                <div
                                    key={provider.value}
                                    style={styles.providerChip}
                                >
                                    {provider.label}
                                    <span
                                        style={styles.removeChip}
                                        onClick={() =>
                                            removeProvider(provider.value)
                                        }
                                    >
                                        ×
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={styles.searchWrapper} ref={dropdownRef}>
                            <input
                                type="text"
                                value={providerSearch}
                                placeholder="Search providers..."
                                style={styles.searchInput}
                                onFocus={() => setShowDropdown(true)}
                                onChange={(e) => {
                                    setProviderSearch(e.target.value);
                                    setShowDropdown(true);
                                }}
                            />

                            <span
                                style={styles.dropdownIcon}
                                onClick={() =>
                                    setShowDropdown(!showDropdown)
                                }
                            >
                                ▼
                            </span>

                            {showDropdown && (
                                <div style={styles.dropdown}>
                                    {filteredProviders.length > 0 ? (
                                        filteredProviders.map((provider) => (
                                            <div
                                                key={provider.value}
                                                style={styles.dropdownItem}
                                                onClick={() =>
                                                    addProvider(provider)
                                                }
                                            >
                                                {provider.label}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={styles.noData}>
                                            No provider found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <button
                        style={styles.cancelBtn}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        style={{
                            ...styles.saveBtn,
                            opacity:
                                loading ||
                                selectedProviders.length === 0 ||
                                selectedProducts.length === 0
                                    ? 0.6
                                    : 1
                        }}
                        onClick={handleAssignProvider}
                        disabled={
                            loading ||
                            selectedProviders.length === 0 ||
                            selectedProducts.length === 0
                        }
                    >
                        {loading ? 'Assigning...' : 'Assign Providers'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },

    modal: {
        width: '700px',
        background: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0,0,0,0.18)',
        fontFamily: '"Poppins", sans-serif'
    },

    header: {
        background: '#2c3e50',
        color: '#fff',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },

    headerIndicator: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#f97316'
    },

    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 600
    },

    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: '28px',
        cursor: 'pointer'
    },

    body: {
        padding: '24px',
        background: '#f8fafc'
    },

    field: {
        marginBottom: '22px'
    },

    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 600,
        marginBottom: '10px',
        color: '#2c3e50'
    },

    productContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        maxHeight: '140px',
        overflowY: 'auto',
        padding: '14px',
        background: '#fff',
        border: '1px solid #dbe3ea',
        borderRadius: '10px'
    },

    productChip: {
        padding: '8px 14px',
        background: '#2c3e50',
        color: '#fff',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 500
    },

    selectedProvidersContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '12px'
    },

    providerChip: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: '#22c55e',
        color: '#fff',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 500
    },

    removeChip: {
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    },

    emptyText: {
        color: '#94a3b8',
        fontSize: '14px'
    },

    searchWrapper: {
        position: 'relative',
        width: '100%'
    },

    searchInput: {
        width: '100%',
        padding: '12px 45px 12px 14px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        background: '#fff',
        outline: 'none',
        boxSizing: 'border-box'
    },

    dropdownIcon: {
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '12px',
        color: '#475569'
    },

    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: '#fff',
        border: '1px solid #dbe3ea',
        borderTop: 'none',
        maxHeight: '220px',
        overflowY: 'auto',
        zIndex: 99999,
        boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
    },

    dropdownItem: {
        padding: '12px 14px',
        cursor: 'pointer',
        fontSize: '14px',
        borderBottom: '1px solid #f1f5f9'
    },

    noData: {
        padding: '12px 14px',
        color: '#94a3b8',
        fontSize: '14px'
    },

    footer: {
        padding: '18px 24px',
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
    },

    cancelBtn: {
        padding: '10px 20px',
        borderRadius: '22px',
        border: '1px solid #d1d5db',
        background: '#fff',
        cursor: 'pointer',
        fontWeight: 500
    },

    saveBtn: {
        padding: '10px 22px',
        borderRadius: '22px',
        border: 'none',
        background: '#22c55e',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 600
    }
};

export default EditProduct;
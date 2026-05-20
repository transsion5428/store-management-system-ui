import React, { useEffect, useState } from 'react';
import './editItem.css';
import { useNavigate, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import SearchSelect from '../../../components/search-select/SearchSelect';
import trimFormValues from '../../../utils/trimFormValues';
import Loading from '../../../components/loading/Loading';

const EditItem = ({ id: propId, isDrawer, onClose }) => {

    localStorage.setItem('selectedView', 'items');

    const navigate = useNavigate();
    const params = useParams();

    // ✅ Handle both drawer + route
    const id = propId || params.id;

    const [isLoading, setIsLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        stock: 0,
        purchasePrice: 0,
        salePrice: 0,
        weight: '',
        providerId: 0,
        categoryId: 0
    });

    const [relationalData, setRelationalData] = useState({
        provider: {},
        category: {}
    });

    useEffect(() => {

        if (!id) return; // ✅ FIX

        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);

                const res = await fetch(`${API}/api/v1/article/${id}`);
                const data = await res.json();

                if (!data || data.error) {
                    navigate('/items');
                    return;
                }

                setFormData({
                    name: data.name,
                    brand: data.brand,
                    stock: data.stock,
                    purchasePrice: data.purchasePrice,
                    salePrice: data.salePrice,
                    weight: data.weight,
                    providerId: data.provider.providerId,
                    categoryId: data.category.categoryId
                });

                setRelationalData({
                    provider: data.provider,
                    category: data.category
                });

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleProviderSelect = (provider) => {
        setFormData({ ...formData, providerId: provider.providerId });
    };

    const handleCategorySelect = (category) => {
        setFormData({ ...formData, categoryId: category.categoryId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedData = trimFormValues(formData);
        setSubmitDisabled(true);

        try {
            const response = await fetch(`${API}/api/v1/article/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trimmedData),
            });

            if (response.ok) {
                alert('Item updated successfully');

                // ✅ CLOSE DRAWER OR NAVIGATE
                if (onClose) {
                    onClose();
                } else {
                    navigate('/items');
                }

                return;
            }

            alert('Failed to update item');
        } catch (err) {
            console.error(err);
            alert('Error updating item');
        }

        setSubmitDisabled(false);
    };

    /* =========================
       DRAWER VIEW
    ========================= */
    if (isDrawer) {
        return (
            <div className="drawer-content">

                {isLoading ? <Loading /> : (
                    <form onSubmit={handleSubmit}>

                        <div className="grid-form">

                            {/* NAME */}
                            <div className="form-item full">
                                <label>Name</label>
                                <input className="input" id="name" value={formData.name} onChange={handleChange} />
                            </div>

                            {/* STOCK + WEIGHT */}
                            <div className="two-col">
                                <div className="form-item">
                                    <label>Stock</label>
                                    <input className="input" type="number" id="stock" value={formData.stock} onChange={handleChange} />
                                </div>

                                <div className="form-item">
                                    <label>Weight</label>
                                    <input className="input" id="weight" value={formData.weight} onChange={handleChange} />
                                </div>
                            </div>

                            {/* BRAND */}
                            <div className="form-item full">
                                <label>Brand</label>
                                <input className="input" id="brand" value={formData.brand} onChange={handleChange} />
                            </div>

                            {/* PRICES */}
                            <div className="two-col">
                                <div className="form-item">
                                    <label>Purchase Price</label>
                                    <input className="input" type="number" id="purchasePrice" value={formData.purchasePrice} onChange={handleChange} />
                                </div>

                                <div className="form-item">
                                    <label>Sale Price</label>
                                    <input className="input" type="number" id="salePrice" value={formData.salePrice} onChange={handleChange} />
                                </div>
                            </div>

                            {/* SELECTS */}
                            <SearchSelect
                                label="Supplier"
                                placeholder="Search supplier..."
                                onSelected={handleProviderSelect}
                                apiUrl={`${API}/api/v1/provider`}
                                optionsAttr="providers"
                                initialSelectedOption={relationalData.provider}
                                isRequired
                            />

                            <SearchSelect
                                label="Category"
                                placeholder="Search category..."
                                onSelected={handleCategorySelect}
                                apiUrl={`${API}/api/v1/category`}
                                optionsAttr="categories"
                                initialSelectedOption={relationalData.category}
                                isRequired
                            />

                        </div>

                        <div className="button-container">
                            <button className="btn" disabled={submitDisabled}>
                                Update
                            </button>
                        </div>

                    </form>
                )}
            </div>
        );
    }

    /* =========================
       NORMAL PAGE VIEW
    ========================= */
    return (
        <div className="editItem-container">

            <div className="form-wrapper">
                <h2 className="form-title">Edit Item</h2>

                {isLoading ? <Loading /> : (
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>

                            <div className="grid-form">
                                {/* SAME FORM (reuse if needed) */}
                                <div className="form-item full">
                                    <label>Name</label>
                                    <input className="input" id="name" value={formData.name} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="button-container">
                                <button className="btn">Update</button>
                            </div>

                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditItem;
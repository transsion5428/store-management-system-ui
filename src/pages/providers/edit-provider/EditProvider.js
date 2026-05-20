import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import trimFormValues from '../../../utils/trimFormValues';
import Loading from '../../../components/loading/Loading';
import './editProvider.css';

const EditProvider = ({ id: propId, isDrawer, onClose }) => {
    localStorage.setItem('selectedView', 'providers');

    const navigate = useNavigate();
    const params = useParams();

    // Support drawer + route
    const id = propId || params.id;

    const [isLoading, setIsLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        phoneNumber: '',
        email: ''
    });

    useEffect(() => {
        if (!id) return;

        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        const fetchProvider = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(`${API}/api/v1/provider/${id}`);
                const data = await response.json();

                if (!data || data.error) {
                    navigate('/providers');
                    return;
                }

                setFormData({
                    phoneNumber: data.phoneNumber || '',
                    email: data.email || ''
                });
            } catch (error) {
                console.error(error);
                navigate('/providers');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProvider();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedData = trimFormValues(formData);
        setSubmitDisabled(true);

        try {
            const response = await fetch(`${API}/api/v1/provider/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedData),
            });

            if (response.ok) {
                alert('Supplier updated successfully');

                if (onClose) {
                    onClose();
                } else {
                    navigate('/providers');
                }

                return;
            }

            alert('Supplier could not be updated');
        } catch (error) {
            console.error(error);
            alert('Error updating supplier');
        }

        setSubmitDisabled(false);
    };

    /* =========================
       DRAWER VIEW
    ========================= */
    if (isDrawer) {
        return (
            <div className="drawer-content">
                {isLoading ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid-form">

                            <div className="form-item full">
                                <label>Phone Number</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="phoneNumber"
                                    maxLength="20"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-item full">
                                <label>Email Address</label>
                                <input
                                    className="input"
                                    type="email"
                                    id="email"
                                    maxLength="100"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="button-container">
                            <button
                                className="btn"
                                type="submit"
                                disabled={submitDisabled}
                            >
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
        <div className="editProvider-container">
            <div className="form-wrapper">
                <h2 className="form-title">Edit Supplier</h2>

                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <div className="grid-form">

                                <div className="form-item full">
                                    <label>Phone Number</label>
                                    <input
                                        className="input"
                                        type="text"
                                        id="phoneNumber"
                                        maxLength="20"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-item full">
                                    <label>Email Address</label>
                                    <input
                                        className="input"
                                        type="email"
                                        id="email"
                                        maxLength="100"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="button-container">
                                <button
                                    className="btn"
                                    type="submit"
                                    disabled={submitDisabled}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProvider;
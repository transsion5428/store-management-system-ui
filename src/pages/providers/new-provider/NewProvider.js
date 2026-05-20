import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';
import '../../../styles/new-edit-form.css';
import trimFormValues from '../../../utils/trimFormValues';

const NewProvider = ({ isDrawer = false, onClose }) => {
    localStorage.setItem('selectedView', 'providers');

    const navigate = useNavigate();

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: ''
    });

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
        }
    }, [navigate]);

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
            const response = await fetch(`${API}/api/v1/provider`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedData),
            });

            if (response.ok) {
                alert('Supplier created successfully');

                if (onClose) {
                    onClose();
                } else {
                    navigate('/providers');
                }

                return;
            }

            alert('Supplier could not be created, please verify the data');
        } catch (error) {
            console.error(error);
            alert('Error creating supplier');
        }

        setSubmitDisabled(false);
    };

    const formContent = (
        <form onSubmit={handleSubmit}>
            <div className="grid-form">

                {/* NAME */}
                <div className="form-item full">
                    <label htmlFor="name">Supplier Name</label>
                    <input
                        className="input"
                        type="text"
                        id="name"
                        maxLength="45"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* PHONE + EMAIL */}
                <div className="two-col">
                    <div className="form-item">
                        <label htmlFor="phoneNumber">Phone Number</label>
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

                    <div className="form-item">
                        <label htmlFor="email">Email Address</label>
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

            </div>

            <div className="button-container">
                <button
                    className="btn"
                    type="submit"
                    disabled={submitDisabled}
                >
                    {submitDisabled ? 'Creating...' : 'Create Supplier'}
                </button>
            </div>
        </form>
    );

    /* DRAWER MODE */
    if (isDrawer) {
        return (
            <div className="drawer-content">
                {formContent}
            </div>
        );
    }

    /* NORMAL PAGE MODE */
    return (
        <div className="editItem-container">
            <div className="form-wrapper">
                <h2 className="form-title">New Supplier</h2>

                <div className="form-container">
                    {formContent}
                </div>
            </div>
        </div>
    );
};

export default NewProvider;
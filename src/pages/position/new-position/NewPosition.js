import React, { useEffect, useState } from 'react';
import './newPosition.css';

import { useNavigate } from 'react-router-dom';

import userVerification from '../../../utils/userVerification';
import { API } from '../../../env';

import trimFormValues from '../../../utils/trimFormValues';
import Loading from '../../../components/loading/Loading';

const NewPosition = ({ isDrawer, onClose }) => {

    localStorage.setItem('selectedView', 'positions');

    const navigate = useNavigate();

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
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

            const response = await fetch(`${API}/api/v1/positions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trimmedData),
            });

            if (response.ok) {

                alert('Position created successfully');

                // CLOSE DRAWER
                if (onClose) {
                    onClose();
                } else {
                    navigate('/positions');
                }

                return;
            }

            alert('Failed to create position');

        } catch (err) {

            console.error(err);

            alert('Error creating position');
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

                            {/* POSITION NAME */}
                            <div className="form-item full">
                                <label>Position Name</label>

                                <input
                                    className="input"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div className="form-item full">

                                <label>Description</label>

                                <textarea
                                    className="textarea"
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                />

                            </div>

                        </div>

                        <div className="button-container">

                            <button
                                className="btn"
                                disabled={submitDisabled}
                            >
                                Create Position
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
        <div className="newPosition-container">

            <div className="form-wrapper">

                <h2 className="form-title">
                    New Position
                </h2>

                {isLoading ? <Loading /> : (

                    <div className="form-container">

                        <form onSubmit={handleSubmit}>

                            <div className="grid-form">

                                {/* POSITION NAME */}
                                <div className="form-item full">

                                    <label>Position Name</label>

                                    <input
                                        className="input"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* DESCRIPTION */}
                                <div className="form-item full">

                                    <label>Description</label>

                                    <textarea
                                        className="textarea"
                                        id="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                    />

                                </div>

                            </div>

                            <div className="button-container">

                                <button
                                    className="btn"
                                    disabled={submitDisabled}
                                >
                                    Create Position
                                </button>

                            </div>

                        </form>

                    </div>
                )}

            </div>

        </div>
    );
};

export default NewPosition;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userVerification from '../../../../utils/userVerification';
import { API } from '../../../../env';
import '../../../../styles/new-edit-form.css';
import trimFormValues from '../../../../utils/trimFormValues';
import Loading from '../../../../components/loading/Loading';

const EditUserData = () => {
    localStorage.setItem('selectedView', 'users');

    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [positions, setPositions] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phoneNumber: '',
        email: '',
        positionId: '',
        sessionUserId: 0
    });

    useEffect(() => {
        const userVer = userVerification();

        if (!userVer.isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        let isAllowed = false;

        try {
            if (
                userVer.user &&
                (userVer.user.admin === true ||
                    id === userVer.user.userId.toString())
            ) {
                isAllowed = true;
            }
        } catch (error) {
            isAllowed = false;
        }

        if (!isAllowed) {
            navigate('/home');
            return;
        }

        const fetchData = async () => {
            try {
                const [userResponse, positionsResponse] = await Promise.all([
                    fetch(`${API}/api/v1/user/${id}`),
                    fetch(`${API}/api/v1/positions`)
                ]);

                const userData = await userResponse.json();
                const positionsData = await positionsResponse.json();

                if (!userData || userData.error) {
                    navigate('/users');
                    return;
                }

                setPositions(positionsData || []);

                setFormData({
                    name: userData.name || '',
                    username: userData.username || '',
                    phoneNumber: userData.phoneNumber || '',
                    email: userData.email || '',
                    positionId: userData.positionId || '',
                    sessionUserId: userVer.user.userId
                });

                setIsLoading(false);

            } catch (error) {
                console.log(error);
                navigate('/users');
            }
        };

        fetchData();

    }, [id, navigate]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedFormData = trimFormValues(formData);

        setSubmitDisabled(true);

        try {
            const response = await fetch(`${API}/api/v1/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedFormData),
            });

            if (response.ok) {
                alert('User updated successfully');
                navigate(`/edit-user/${id}`);
                return;
            }

            alert('User could not be updated, please verify the data');

        } catch (error) {
            console.log(error);
            alert('Error updating user');
        }

        setSubmitDisabled(false);
    };

    return (
        <div className="editUserData-container">
            <div className="text">Edit User</div>

            {!isLoading ? (
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="grid-form">

                            <div className="form-item">
                                <label htmlFor="name">Name</label>
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

                            <div className="form-item">
                                <label htmlFor="username">Username</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="username"
                                    maxLength="20"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-item">
                                <label htmlFor="phoneNumber">Phone</label>
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
                                <label htmlFor="email">Email</label>
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

                            <div className="form-item">
                                <label htmlFor="positionId">Position</label>
                                <select
                                    className="input"
                                    id="positionId"
                                    value={formData.positionId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Position</option>

                                    {positions.map((position) => (
                                        <option
                                            key={position.id}
                                            value={position.id}
                                        >
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
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
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default EditUserData;
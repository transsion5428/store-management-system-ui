import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userVerification from '../../../utils/userVerification';
import api from '../../../api/axios';
import './newProvider.css';
import trimFormValues from '../../../utils/trimFormValues';

const NewProvider = ({ isDrawer = false, onClose }) => {

    localStorage.setItem('selectedView', 'providers');

    const navigate = useNavigate();

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',

        // GST / PAN / TAN VALUES
        gst: '',
        pan: '',
        tan: '',

        // FILE URLS
        gstnUrl: null,
        panUrl: null,
        tanUrl: null
    });

    // FILES
    const [attachments, setAttachments] = useState({
        gstnFile: null,
        panFile: null,
        tanFile: null
    });

    useEffect(() => {

        if (!userVerification().isAuthenticated) {

            localStorage.clear();
            navigate('/login');

        }

    }, [navigate]);

    /* =========================
       INPUT CHANGE
    ========================= */
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });

    };

    /* =========================
       FILE UPLOAD API
    ========================= */
    const uploadFile = async (file, fileType) => {

        try {

            const uploadData = new FormData();

            uploadData.append('entityType', 'PROVIDER');
            uploadData.append('entityId', 1);
            uploadData.append('fileType', fileType);
            uploadData.append('files', file);

            const response = await api.post(
                '/api/v1/api/files/upload',
                uploadData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log(`${fileType} uploaded`, response.data);

            const uploadedFile = response.data?.[0];

            if (!uploadedFile) return;

            // SAVE FILE URL
            if (fileType === 'GSTN') {

                setFormData((prev) => ({
                    ...prev,
                    gstnUrl: uploadedFile.fileUrl
                }));

            }

            if (fileType === 'PAN') {

                setFormData((prev) => ({
                    ...prev,
                    panUrl: uploadedFile.fileUrl
                }));

            }

            if (fileType === 'TAN') {

                setFormData((prev) => ({
                    ...prev,
                    tanUrl: uploadedFile.fileUrl
                }));

            }

        } catch (error) {

            console.error(error);
            alert(`${fileType} upload failed`);

        }

    };

    /* =========================
       FILE CHANGE
    ========================= */
    const handleFileChange = async (e) => {

        const file = e.target.files[0];
        const fieldName = e.target.name;

        if (!file) return;

        setAttachments((prev) => ({
            ...prev,
            [fieldName]: file
        }));

        // HIT API IMMEDIATELY
        if (fieldName === 'gstnFile') {

            await uploadFile(file, 'GSTN');

        }

        if (fieldName === 'panFile') {

            await uploadFile(file, 'PAN');

        }

        if (fieldName === 'tanFile') {

            await uploadFile(file, 'TAN');

        }

    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async (e) => {

        e.preventDefault();

        const trimmedData = trimFormValues(formData);

        setSubmitDisabled(true);

        try {

            console.log('FINAL REQUEST BODY', trimmedData);

            await api.post(
                '/api/v1/provider',
                trimmedData
            );

            alert('Supplier created successfully');

            if (onClose) {

                onClose();

            } else {

                navigate('/providers');

            }

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

                    <label htmlFor="name">
                        Supplier Name
                    </label>

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

                        <label htmlFor="phoneNumber">
                            Phone Number
                        </label>

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

                        <label htmlFor="email">
                            Email Address
                        </label>

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

                {/* GST */}
                <div className="form-item full">

                    <label htmlFor="gst">
                        GST Number
                    </label>

                    <input
                        className="input"
                        type="text"
                        id="gst"
                        maxLength="30"
                        value={formData.gst}
                        onChange={handleChange}
                    />

                </div>

                {/* GST FILE */}
                <div className="form-item full">

                    <label>
                        GSTN Document
                    </label>

                    <input
                        type="file"
                        name="gstnFile"
                        className="file-input"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                    />

                    {
                        formData.gstnUrl && (
                            <p className="upload-success">
                                GSTN uploaded successfully
                            </p>
                        )
                    }

                </div>

                {/* PAN */}
                <div className="form-item full">

                    <label htmlFor="pan">
                        PAN Number
                    </label>

                    <input
                        className="input"
                        type="text"
                        id="pan"
                        maxLength="30"
                        value={formData.pan}
                        onChange={handleChange}
                    />

                </div>

                {/* PAN FILE */}
                <div className="form-item full">

                    <label>
                        PAN Document
                    </label>

                    <input
                        type="file"
                        name="panFile"
                        className="file-input"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                    />

                    {
                        formData.panUrl && (
                            <p className="upload-success">
                                PAN uploaded successfully
                            </p>
                        )
                    }

                </div>

                {/* TAN */}
                <div className="form-item full">

                    <label htmlFor="tan">
                        TAN Number
                    </label>

                    <input
                        className="input"
                        type="text"
                        id="tan"
                        maxLength="30"
                        value={formData.tan}
                        onChange={handleChange}
                    />

                </div>

                {/* TAN FILE */}
                <div className="form-item full">

                    <label>
                        TAN Document
                    </label>

                    <input
                        type="file"
                        name="tanFile"
                        className="file-input"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                    />

                    {
                        formData.tanUrl && (
                            <p className="upload-success">
                                TAN uploaded successfully
                            </p>
                        )
                    }

                </div>

            </div>

            <div className="button-container">

                <button
                    className="btn"
                    type="submit"
                    disabled={submitDisabled}
                >
                    {
                        submitDisabled
                            ? 'Creating...'
                            : 'Create Supplier'
                    }
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

        <div className="newItem-container">

            <div className="form-wrapper">

                <h2 className="form-title">
                    New Supplier
                </h2>

                <div className="form-container">
                    {formContent}
                </div>

            </div>

        </div>

    );

};

export default NewProvider;
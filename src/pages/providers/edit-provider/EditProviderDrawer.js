import React from 'react';
import EditProvider from './EditProvider';

const EditProviderDrawer = ({ id, onClose }) => {

    return <EditProvider id={id} isDrawer={true} onClose={onClose} />;
};

export default EditProviderDrawer;
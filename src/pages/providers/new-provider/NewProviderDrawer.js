import React from 'react';
import NewProvider from './NewProvider';

const NewProviderDrawer = ({ id, onClose }) => {

    return <NewProvider id={id} isDrawer={true} onClose={onClose} />;
};

export default NewProviderDrawer;
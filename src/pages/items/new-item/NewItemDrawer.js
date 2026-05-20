import React from 'react';
import NewItem from './NewItem';

const NewItemDrawer = ({ id, onClose }) => {

    return <NewItem id={id} isDrawer={true} onClose={onClose} />;
};

export default NewItemDrawer;
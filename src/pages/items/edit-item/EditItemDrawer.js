import React from 'react';
import EditItem from './EditItem';

const EditItemDrawer = ({ id, onClose }) => {

    console.log("id======>>>>>>>"+id)
    return <EditItem id={id} isDrawer={true} onClose={onClose} />;
};

export default EditItemDrawer;
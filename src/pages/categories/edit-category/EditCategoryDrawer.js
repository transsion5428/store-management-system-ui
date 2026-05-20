import React from 'react';
import EditCategory from './EditCategory';
const EditCategoryDrawer = ( { id, onClose }) => {

    return <EditCategory isDrawer={true} onClose={onClose} id={id}/>;
};

export default EditCategoryDrawer;
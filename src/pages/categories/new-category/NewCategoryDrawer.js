import React from 'react';
import NewCategory from './NewCategory';


const NewCategoryDrawer = ({ onClose }) => {
    return <NewCategory isDrawer={true} onClose={onClose} />;
};

export default NewCategoryDrawer;
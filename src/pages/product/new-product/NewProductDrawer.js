import React from 'react';
import NewProduct from './NewProduct';

const NewProductDrawer = ({ id, onClose }) => {

    return <NewProduct  id={id} isDrawer={true} onClose={onClose} />;
};

export default NewProductDrawer;
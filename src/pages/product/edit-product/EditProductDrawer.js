import React from 'react';
import EditProduct from './EditProduct';

const EditProductDrawer = ({ selectedProducts, onClose, fetchProducts }) => {
    return (
        <EditProduct
            selectedProducts={selectedProducts}
            isDrawer={true}
            onClose={onClose}
            fetchProducts={fetchProducts}
        />
    );
};

export default EditProductDrawer;
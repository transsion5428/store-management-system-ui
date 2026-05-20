import React from 'react';
import NewPosition from './NewPosition';

const NewPositionDrawer = ({ onClose }) => {

    return (
        <NewPosition
            isDrawer={true}
            onClose={onClose}
        />
    );
};

export default NewPositionDrawer;
import React from 'react';
import AssignMenus from './AssignMenus';

const AssignMenusDrawer = ({ position, onClose }) => {

    return (
        <AssignMenus
            position={position}
            isDrawer={true}
            onClose={onClose}
        />
    );
};

export default AssignMenusDrawer;
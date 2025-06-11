import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowRoles }) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !allowRoles.includes(currentUser.role)) {
        return (
            <div style={{ color: 'red', fontWeight: 600, textAlign: 'center', marginTop: 40 }}>
                Bạn không có quyền truy cập trang này!
            </div>
        );
    }
    return children;
};

export default ProtectedRoute; 
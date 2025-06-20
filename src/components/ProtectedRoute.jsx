import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowRoles }) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let userCode = currentUser?.code;
    if (!userCode && currentUser?.role) {
        if (currentUser.role === 'Quản lý') userCode = 'Admin';
        else if (currentUser.role === 'Nhân viên') userCode = 'User';
        else userCode = currentUser.role;
    }
    if (!currentUser || !allowRoles.includes(userCode)) {
        return (
            <div style={{ color: 'red', fontWeight: 600, textAlign: 'center', marginTop: 40 }}>
                Bạn không có quyền truy cập trang này!
            </div>
        );
    }
    return children;
};

export default ProtectedRoute; 
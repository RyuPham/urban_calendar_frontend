import React from "react";
import { IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./Header.css";
import logo from "../../assets/images/urban-logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import ProfileModal from '../../pages/employee/ProfileModal';
import AlertPopup from '../common/AlertPopup';

console.log(logo); // Thêm dòng này để kiểm tra đường dẫn thực tế

const menuItems = [
  { label: "TRANG CHỦ", path: "/Home" },
  { label: "VỀ URBAN VIỆT NAM", path: "/about" },
  { label: "VỀ URBAN CORPORATION", path: "/corporation" },
  //{ label: "EMPLOYEES", path: "/employees" },
];

const Header = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openProfileModal, setOpenProfileModal] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Lấy quyền thực tế
  let userCode = user?.code;
  if (!userCode && user?.role) {
    if (user.role === 'Quản lý') userCode = 'Admin';
    else if (user.role === 'Nhân viên') userCode = 'User';
    else userCode = user.role;
  }

  return (
    <header className="urban-header">
      <div className="urban-header__left">
        <div className="urban-header__logo">
          <Link to="/Home">
            <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10, cursor: 'pointer' }} />
          </Link>
        </div>
        <nav className="urban-header__nav">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="urban-header__nav-item"
            >
              {item.label}
            </Link>
          ))}
          {/* Chỉ hiển thị CALENDAR cho user thường đã đăng nhập */}
          {isAuthenticated && userCode === 'User' && (
            <Link
              to="/calendar"
              className="urban-header__nav-item"
            >
              CALENDAR
            </Link>
          )}
          {isAuthenticated && userCode === 'Admin' && (
            <Link
              to="/admin/employees"
              className="urban-header__nav-item"
            >
              QUẢN LÝ NHÂN VIÊN
            </Link>
          )}
          {isAuthenticated && userCode === 'Admin' && (
            <Link
              to="/admin/schedule"
              className="urban-header__nav-item"
            >
              スケジュール
            </Link>
          )}
        </nav>
      </div>
      <div className="urban-header__right">
        {!isAuthenticated ? (
          <Link to="/login" className="urban-header__nav-item">
            ĐĂNG NHẬP
          </Link>
        ) : (
          <>
            <span
              className="urban-header__user-name"
            >
              {user?.name || user?.username || 'Người dùng'}
            </span>
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setOpenProfileModal(true)}
              color="primary"
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </>
        )}
      </div>
      <ProfileModal open={openProfileModal} onClose={() => setOpenProfileModal(false)} />
      <AlertPopup open={openAlert} message={alertMessage} type="error" onClose={() => setOpenAlert(false)} />
    </header>
  );
};

export default Header;

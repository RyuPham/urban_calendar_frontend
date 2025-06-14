import React from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
];

const Header = ({ onMenuClick }) => {
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

  const handleMenuClick = () => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      setAlertMessage('Chỉ admin mới mở được menu này!');
      setOpenAlert(true);
      return;
    }
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <header className="urban-header">
      <IconButton onClick={handleMenuClick} sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <div className="urban-header__logo">
        <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
      </div>
      <nav className="urban-header__nav" style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="urban-header__nav-item"
          >
            {item.label}
          </Link>
        ))}
        <Link
          to={isAuthenticated ? "/calendar" : "#"}
          className="urban-header__nav-item"
          style={{ marginLeft: 16, color: undefined, cursor: 'pointer' }}
          onClick={e => {
            if (!isAuthenticated) {
              e.preventDefault();
              setAlertMessage('Bạn cần đăng nhập để truy cập Calendar!');
              setOpenAlert(true);
            }
          }}
        >
          CALENDAR
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 400 }}>
          {!isAuthenticated ? (
            <Link to="/login" className="urban-header__nav-item">
              ĐĂNG NHẬP
            </Link>
          ) : (
            <>
              <span
                className="urban-header__nav-item"
                style={{ fontWeight: 600, color: '#1976d2', marginRight: 8, cursor: 'default' }}
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
      </nav>
      <ProfileModal open={openProfileModal} onClose={() => setOpenProfileModal(false)} />
      <AlertPopup open={openAlert} message={alertMessage} type="error" onClose={() => setOpenAlert(false)} />
    </header>
  );
};

export default Header;

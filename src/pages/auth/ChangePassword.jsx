import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AlertPopup from '../../components/common/AlertPopup';
import logo from '../../assets/images/urban-logo.png';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    // TODO: Gọi API đổi mật khẩu ở đây
    // Giả lập thành công:
    // Lấy user hiện tại từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = localStorage.getItem('employees');
    if (data && currentUser) {
      let employees = JSON.parse(data);
      const idx = employees.findIndex(e => e.id === currentUser.id);
      if (idx === -1) {
        setError('Không tìm thấy tài khoản!');
        return;
      }
      if (employees[idx].password !== oldPassword) {
        setError('Mật khẩu cũ không đúng!');
        return;
      }
      employees[idx].password = newPassword;
      localStorage.setItem('employees', JSON.stringify(employees));
      // Cập nhật currentUser nếu có
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, password: newPassword }));
    }
    setError('');
    setAlertMessage('Đổi mật khẩu thành công!');
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
      navigate('/');
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafd' }}>
      <Paper sx={{ p: 4, minWidth: 340, maxWidth: 400 }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={logo} alt="Urban Logo" style={{ height: 60, marginBottom: 12 }} />
        </Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>Change Password</Typography>
        <TextField
          label="Mật khẩu cũ"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button variant="contained" fullWidth onClick={handleChangePassword}>Đổi mật khẩu</Button>
        <AlertPopup open={openAlert} message={alertMessage} type="success" onClose={() => setOpenAlert(false)} />
      </Paper>
    </Box>
  );
};

export default ChangePassword; 
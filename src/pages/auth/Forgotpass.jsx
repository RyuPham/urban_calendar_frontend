import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import logo from '../../assets/images/urban-logo.png';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../data/mockData';

// Hàm sinh mã OTP ngẫu nhiên (6 số)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const Forgotpass = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState('');
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập mật khẩu mới + OTP
  const [newPassword, setNewPassword] = useState('');
  const [userFound, setUserFound] = useState(null);
  const [otp, setOtp] = useState(''); // Lưu mã OTP sinh ra (mô phỏng)
  const [otpInput, setOtpInput] = useState(''); // Lưu giá trị người dùng nhập OTP
  const navigate = useNavigate();

  // Xử lý khi submit email để lấy lại mật khẩu
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // 1. Kiểm tra email có tồn tại trong hệ thống không (mockUsers hoặc localStorage)
    let user = mockUsers.find(u => u.email === email);
    if (!user) {
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      user = employees.find(u => u.email === email);
    }
    if (!user) {
      setAlert('Email không tồn tại.');
      setUserFound(null);
    } else {
      // ===> ĐOẠN NÀY SAU NÀY SẼ GỌI API GỬI OTP VỀ EMAIL NGƯỜI DÙNG
      // Hiện tại chỉ mô phỏng: sinh OTP và hiển thị lên giao diện
      const generatedOtp = generateOTP();
      setOtp(generatedOtp);
      setAlert(`Mã OTP đã được gửi tới email của bạn (mô phỏng): ${generatedOtp}`);
      setUserFound(user);
      setStep(2);
    }
  };

  // Xử lý khi submit mật khẩu mới và OTP
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!userFound) return;
    // ===> ĐOẠN NÀY SAU NÀY SẼ GỌI API XÁC THỰC OTP
    // Hiện tại chỉ kiểm tra trực tiếp mã OTP nhập vào
    if (otpInput !== otp) {
      setAlert('Mã OTP không đúng. Vui lòng kiểm tra lại.');
      return;
    }
    // ===> ĐOẠN NÀY SAU NÀY SẼ GỌI API ĐỔI MẬT KHẨU
    // Hiện tại chỉ cập nhật mật khẩu trong localStorage/mockUsers
    let updated = false;
    let userIdx = mockUsers.findIndex(u => u.email === userFound.email);
    if (userIdx !== -1) {
      mockUsers[userIdx].password = newPassword;
      updated = true;
      localStorage.setItem('currentUser', JSON.stringify(mockUsers[userIdx]));
    } else {
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const idx = employees.findIndex(u => u.email === userFound.email);
      if (idx !== -1) {
        employees[idx].password = newPassword;
        localStorage.setItem('employees', JSON.stringify(employees));
        localStorage.setItem('currentUser', JSON.stringify(employees[idx]));
        updated = true;
      }
    }
    if (updated) {
      setAlert('Đổi mật khẩu thành công! Đang đăng nhập...');
      setTimeout(() => {
        navigate('/home');
      }, 1200);
    } else {
      setAlert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <img src={logo} alt="Urban Logo" style={{ height: 60, marginBottom: 12 }} />
          <Typography variant="h5" align="center" gutterBottom>
            Quên mật khẩu
          </Typography>
        </Box>
        {alert && (
          <Alert severity={alert.includes('thành công') ? 'success' : (alert.includes('không đúng') || alert.includes('không tồn tại') ? 'error' : 'info')} sx={{ mb: 2 }} onClose={() => setAlert('')}>
            {alert}
          </Alert>
        )}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <TextField
              fullWidth
              label="Nhập email của bạn"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
            >
              Tiếp tục
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit}>
            <TextField
              fullWidth
              label="Nhập mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Nhập mã OTP"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              margin="normal"
              required
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
            >
              Đặt lại mật khẩu mới
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default Forgotpass; 
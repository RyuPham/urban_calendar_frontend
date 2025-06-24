import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { login, clearError } from '../../features/auth/authSlice';
import logo from '../../assets/images/urban-logo.png';

const validationSchema = Yup.object({
  username: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isAuthenticated, user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

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
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Email"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            margin="normal"
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            LOGIN
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="text" size="small" onClick={() => navigate('/auth/forgotpass')}>
            Quên password?
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
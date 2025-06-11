import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../../data/mockData';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, password } = action.payload;
      let user = mockUsers.find(
        u => (u.username === username || u.email === username) && u.password === password
      );

      // Nếu không tìm thấy trong mockUsers, tìm trong localStorage 'employees'
      if (!user) {
        const data = localStorage.getItem('employees');
        if (data) {
          const employees = JSON.parse(data);
          user = employees.find(
            e => (e.username === username || e.email === username) && e.password === password
          );
        }
      }

      if (user) {
        state.isAuthenticated = true;
        state.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role || 'user',
          name: user.name
        };
        state.token = 'mock-jwt-token';
        state.error = null;
      } else {
        state.error = 'Invalid username/email or password';
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { login, logout, clearError } = authSlice.actions;

export default authSlice.reducer; 
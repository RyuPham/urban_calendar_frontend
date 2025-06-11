import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useSelector } from 'react-redux';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const isAdmin = user && user.role && user.role.toLowerCase() === 'admin';

  React.useEffect(() => {
    if (!isAdmin && sidebarOpen) setSidebarOpen(false);
  }, [isAdmin]);

  return (
    <>
      <Header onMenuClick={isAuthenticated ? () => setSidebarOpen(true) : undefined} />
      {isAuthenticated && isAdmin && (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}
      <Box
        sx={{
          marginTop: '52px',
          minHeight: `calc(100vh - 52px)`,
          width: '100%',
          background: '#f7f7f7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="main"
          sx={{
            width: '100%',
            maxWidth: 1200,
            pt: 8,
            px: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Layout; 
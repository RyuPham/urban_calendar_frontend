import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';


const drawerWidth = 240;

const menuItems = [
  { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
];

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        zIndex: 900,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          top: '52px',
          height: 'calc(100% - 52px)',
        },
      }}
    >
      <List>
        {/*=================== Menu Items ===================*/}
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
            sx={{
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              borderRadius: '12px',
              color: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? '#fff' : '#000',
              fontWeight: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? 'bold' : 'normal',
              backgroundColor: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? '#888' : 'transparent',
              '&:hover': {
                backgroundColor: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? '#888' : '#f5f5f5',
              },
              '& .MuiListItemIcon-root': {
                color: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? '#fff' : '#000',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
        {/*=================== Quản lý Role ===================*/}
        <ListItem
          button
          onClick={() => navigate('/admin/roles')}
          selected={location.pathname.startsWith('/admin/roles')}
          sx={{
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            borderRadius: '12px',
            color: location.pathname.startsWith('/admin/roles') ? '#fff' : '#000',
            fontWeight: location.pathname.startsWith('/admin/roles') ? 'bold' : 'normal',
            backgroundColor: location.pathname.startsWith('/admin/roles') ? '#888' : 'transparent',
            '&:hover': {
              backgroundColor: location.pathname.startsWith('/admin/roles') ? '#888' : '#f5f5f5',
            },
            '& .MuiListItemIcon-root': {
              color: location.pathname.startsWith('/admin/roles') ? '#fff' : '#000',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            <PeopleIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Quản lý Role" />}
        </ListItem>
        {/*=================== Quản lý văn phòng ===================*/}
        <ListItem
          button
          onClick={() => navigate('/admin/companies')}
          selected={location.pathname.startsWith('/admin/companies')}
          sx={{
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            borderRadius: '12px',
            color: location.pathname.startsWith('/admin/companies') ? '#fff' : '#000',
            fontWeight: location.pathname.startsWith('/admin/companies') ? 'bold' : 'normal',
            backgroundColor: location.pathname.startsWith('/admin/companies') ? '#888' : 'transparent',
            '&:hover': {
              backgroundColor: location.pathname.startsWith('/admin/companies') ? '#888' : '#f5f5f5',
            },
            '& .MuiListItemIcon-root': {
              color: location.pathname.startsWith('/admin/companies') ? '#fff' : '#000',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            <PeopleIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Quản lý văn phòng" />}
        </ListItem>
        {/*=================== Quản lý loại công việc ===================*/}
        <ListItem
          button
          onClick={() => navigate('/admin/job-types')}
          selected={location.pathname.startsWith('/admin/job-types')}
          sx={{
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            borderRadius: '12px',
            color: location.pathname.startsWith('/admin/job-types') ? '#fff' : '#000',
            fontWeight: location.pathname.startsWith('/admin/job-types') ? 'bold' : 'normal',
            backgroundColor: location.pathname.startsWith('/admin/job-types') ? '#888' : 'transparent',
            '&:hover': {
              backgroundColor: location.pathname.startsWith('/admin/job-types') ? '#888' : '#f5f5f5',
            },
            '& .MuiListItemIcon-root': {
              color: location.pathname.startsWith('/admin/job-types') ? '#fff' : '#000',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            <PeopleIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Quản lý loại công việc" />}
        </ListItem>
        {/*=================== Lịch làm việc (chỉ Admin) ===================*/}
        <ListItem
          button
          onClick={() => navigate('/admin/schedule')}
          selected={location.pathname.startsWith('/admin/schedule')}
          sx={{
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            borderRadius: '12px',
            color: location.pathname.startsWith('/admin/schedule') ? '#fff' : '#000',
            fontWeight: location.pathname.startsWith('/admin/schedule') ? 'bold' : 'normal',
            backgroundColor: location.pathname.startsWith('/admin/schedule') ? '#888' : 'transparent',
            '&:hover': {
              backgroundColor: location.pathname.startsWith('/admin/schedule') ? '#888' : '#f5f5f5',
            },
            '& .MuiListItemIcon-root': {
              color: location.pathname.startsWith('/admin/schedule') ? '#fff' : '#000',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Quản lý lịch làm việc" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
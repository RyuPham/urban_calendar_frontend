import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';
import AlertPopup from '../../components/common/AlertPopup';

// Mock data nhân viên
const mockEmployees = [
  {
    id: 1,
    name: 'LE HUYNH DIEP',
    position: 'Trưởng phòng',
    office: 'Trung tâm hành chính Miyagi',
    status: 'Đang làm việc',
  },
  {
    id: 2,
    name: 'NGUYEN TRUONG AN',
    position: 'Trưởng phòng',
    office: 'Văn phòng Sapporo',
    status: 'Công tác',
  },
  {
    id: 3,
    name: 'TRAN QUOC TOAN',
    position: 'Trưởng nhóm',
    office: 'Văn phòng Tokyo',
    status: 'Ra ngoài gặp kh',
  },
  {
    id: 4,
    name: 'TRAN DUY KHANH',
    position: 'Nhân viên',
    office: 'Văn phòng Yokohama',
    status: 'Làm việc từ xa',
  },
  {
    id: 5,
    name: 'DONG ANH THU',
    position: 'Nhân viên',
    office: 'Văn phòng Yokohama',
    status: 'Làm việc từ xa',
  },
  {
    id: 6,
    name: 'HOANG MINH DUONG',
    position: 'Nhân viên',
    office: 'Văn phòng Yokohama',
    status: 'Nghỉ phép có lương',
  },
  {
    id: 7,
    name: 'PHAM HONG LONG',
    position: 'Nhân viên',
    office: 'Văn phòng Yokohama',
    status: 'Đang làm việc',
  },
  {
    id: 8,
    name: 'NGUYEN VAN BINH',
    position: 'Nhân viên',
    office: 'Văn phòng Sapporo',
    status: 'Đang làm việc',
  },
  {
    id: 9,
    name: 'TRAN THI MAI',
    position: 'Trưởng nhóm',
    office: 'Văn phòng Tokyo',
    status: 'Ra ngoài gặp kh',
  },
  {
    id: 10,
    name: 'PHAM ANH TUAN',
    position: 'Trưởng phòng',
    office: 'Văn phòng Yokohama',
    status: 'Làm việc từ xa',
  },
  {
    id: 11,
    name: 'DOAN THI HONG',
    position: 'Nhân viên',
    office: 'Trung tâm hành chính Miyagi',
    status: 'Công tác',
  },
  {
    id: 12,
    name: 'LE QUOC KHANH',
    position: 'Trưởng nhóm',
    office: 'Văn phòng Tokyo',
    status: 'Nghỉ phép có lương',
  },
  {
    id: 13,
    name: 'VO NGOC PHUONG',
    position: 'Nhân viên',
    office: 'Văn phòng Sapporo',
    status: 'Đang làm việc',
  },
  {
    id: 14,
    name: 'NGUYEN HAI NAM',
    position: 'Trưởng phòng',
    office: 'Văn phòng Yokohama',
    status: 'Làm việc từ xa',
  },
  {
    id: 15,
    name: 'TRAN MINH TRANG',
    position: 'Nhân viên',
    office: 'Văn phòng Tokyo',
    status: 'Ra ngoài gặp kh',
  },
  {
    id: 16,
    name: 'BUI THI KIM ANH',
    position: 'Trưởng nhóm',
    office: 'Trung tâm hành chính Miyagi',
    status: 'Đang làm việc',
  },
  {
    id: 17,
    name: 'HOANG GIA BAO',
    position: 'Nhân viên',
    office: 'Văn phòng Sapporo',
    status: 'Công tác',
  },
  {
    id: 18,
    name: 'NGUYEN VAN DUC',
    position: 'Nhân viên',
    office: 'Văn phòng Tokyo',
    status: 'Làm việc từ xa',
  },
  {
    id: 19,
    name: 'PHAN THI LAN',
    position: 'Trưởng nhóm',
    office: 'Văn phòng Yokohama',
    status: 'Đang làm việc',
  },
  {
    id: 20,
    name: 'DINH HONG SON',
    position: 'Trưởng phòng',
    office: 'Văn phòng Sapporo',
    status: 'Ra ngoài gặp kh',
  },
  {
    id: 21,
    name: 'TRUONG MINH TAM',
    position: 'Nhân viên',
    office: 'Trung tâm hành chính Miyagi',
    status: 'Công tác',
  },
  {
    id: 22,
    name: 'DO THI NHUNG',
    position: 'Nhân viên',
    office: 'Văn phòng Tokyo',
    status: 'Nghỉ phép có lương',
  },
  {
    id: 23,
    name: 'VU QUANG HUY',
    position: 'Trưởng phòng',
    office: 'Văn phòng Yokohama',
    status: 'Đang làm việc',
  },
  {
    id: 24,
    name: 'LE THI KIEU OANH',
    position: 'Trưởng nhóm',
    office: 'Văn phòng Sapporo',
    status: 'Làm việc từ xa',
  },
  {
    id: 25,
    name: 'PHAM VAN HOANG',
    position: 'Nhân viên',
    office: 'Văn phòng Tokyo',
    status: 'Đang làm việc',
  },
  {
    id: 26,
    name: 'NGO THI HUONG',
    position: 'Trưởng nhóm',
    office: 'Văn phòng Yokohama',
    status: 'Công tác',
  },
  {
    id: 27,
    name: 'TRAN HUU NGHIA',
    position: 'Nhân viên',
    office: 'Trung tâm hành chính Miyagi',
    status: 'Ra ngoài gặp kh',
  },
];

const EMPLOYEE_KEY = 'employees';

const EmployeeTable = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  // State lọc
  const [positionFilter, setPositionFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  // State quản lý danh sách nhân viên
  const [employees, setEmployees] = useState([]);
  // State quản lý hover
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    position: '',
    office: '',
    role: '',
  });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [offices, setOffices] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Lấy danh sách chức vụ và địa điểm không trùng lặp
  const positions = Array.from(new Set(mockEmployees.map(e => e.position)));

  const filtered = employees.filter(emp =>
    (positionFilter ? emp.position === positionFilter : true) &&
    (officeFilter ? emp.office === officeFilter : true) &&
    (
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      (emp.username && emp.username.toLowerCase().includes(search.toLowerCase())) ||
      (emp.email && emp.email.toLowerCase().includes(search.toLowerCase())) ||
      (emp.phone && emp.phone.toLowerCase().includes(search.toLowerCase()))
    )
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  // Lấy dữ liệu cho trang hiện tại
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Khi mount, lấy dữ liệu từ localStorage nếu có, nếu không thì lấy mock
  useEffect(() => {
    const data = localStorage.getItem(EMPLOYEE_KEY);
    if (data) {
      setEmployees(JSON.parse(data));
    } else {
      setEmployees(mockEmployees);
      localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(mockEmployees));
    }
    // Lấy danh sách văn phòng từ localStorage
    const officeData = localStorage.getItem('companies');
    if (officeData) {
      try {
        const parsed = JSON.parse(officeData);
        // Nếu là mảng object thì lấy name, nếu là mảng string thì giữ nguyên
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          setOffices(parsed.map(c => c.name));
        } else {
          setOffices(parsed);
        }
      } catch {
        setOffices([]);
      }
    } else {
      setOffices([]);
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem('roles');
    if (data) setRoles(JSON.parse(data));
  }, []);

  // Khi employees thay đổi, lưu lại vào localStorage
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employees));
    }
  }, [employees]);

  // Hàm xóa nhân viên
  const handleDelete = (id) => {
    if (window.confirm('Muốn xóa nhân viên này?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleAddEmployee = () => {
    // Lấy lại danh sách văn phòng mới nhất khi mở form
    const officeData = localStorage.getItem('companies');
    if (officeData) {
      try {
        const parsed = JSON.parse(officeData);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          setOffices(parsed.map(c => c.name));
        } else {
          setOffices(parsed);
        }
      } catch {
        setOffices([]);
      }
    } else {
      setOffices([]);
    }
    setIsModalOpen(true);
    setNewEmployee({
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      gender: '',
      address: '',
      position: '',
      office: '',
      role: '',
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    // Validate họ tên không chứa ký tự đặc biệt
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!newEmployee.name || !nameRegex.test(newEmployee.name)) {
      setAlertMessage('Họ tên không được chứa ký tự đặc biệt và không được để trống!');
      setOpenAlert(true);
      return;
    }
    // Validate email đúng định dạng và phải có đuôi @gmail.com
    const emailRegex = /^[\w-.]+@gmail\.com$/;
    if (!newEmployee.email || !emailRegex.test(newEmployee.email)) {
      setAlertMessage('Email phải đúng định dạng');
      setOpenAlert(true);
      return;
    }
    // Validate số điện thoại không quá 15 số
    const phoneRegex = /^\d{1,15}$/;
    if (!newEmployee.phone || !phoneRegex.test(newEmployee.phone)) {
      setAlertMessage('Số điện thoại không được vượt quá 15 số!');
      setOpenAlert(true);
      return;
    }
    if (!newEmployee.username || !newEmployee.password || !newEmployee.gender || !newEmployee.address || !newEmployee.position || !newEmployee.office || !newEmployee.role) {
      setAlertMessage('Vui lòng nhập đầy đủ thông tin!');
      setOpenAlert(true);
      return;
    }
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees(prev => [...prev, { ...newEmployee, id: newId }]);
    setIsModalOpen(false);
  };

  // Hàm mở modal chi tiết khi double click
  const handleRowDoubleClick = (emp) => {
    setSelectedEmployee(emp);
    setEditEmployee(emp);
    setDetailModalOpen(true);
    setIsEditMode(false);
  };

  // Hàm lưu chỉnh sửa
  const handleSaveEdit = () => {
    // Validate họ tên không chứa ký tự đặc biệt
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!editEmployee.name || !nameRegex.test(editEmployee.name)) {
      setAlertMessage('Họ tên không được chứa ký tự đặc biệt và không được để trống!');
      setOpenAlert(true);
      return;
    }
    // Validate email đúng định dạng và phải có đuôi @gmail.com
    const emailRegex = /^[\w-.]+@gmail\.com$/;
    if (!editEmployee.email || !emailRegex.test(editEmployee.email)) {
      setAlertMessage('Email phải đúng định dạng');
      setOpenAlert(true);
      return;
    }
    // Validate số điện thoại không quá 15 số
    const phoneRegex = /^\d{1,15}$/;
    if (!editEmployee.phone || !phoneRegex.test(editEmployee.phone)) {
      setAlertMessage('Số điện thoại không được vượt quá 15 số!');
      setOpenAlert(true);
      return;
    }
    if (!editEmployee.username || !editEmployee.gender || !editEmployee.address || !editEmployee.position || !editEmployee.office) {
      setAlertMessage('Vui lòng nhập đầy đủ thông tin!');
      setOpenAlert(true);
      return;
    }
    const updatedEmployees = employees.map(e => e.id === editEmployee.id ? { ...editEmployee } : e);
    setEmployees(updatedEmployees);
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updatedEmployees));
    setSelectedEmployee(editEmployee);
    setIsEditMode(false);
    setDetailModalOpen(false);
  };

  // Hàm xóa nhân viên từ modal chi tiết
  const handleDeleteEmployee = () => {
    if (window.confirm('Bạn muốn xóa nhân viên này?')) {
      const updatedEmployees = employees.filter(e => e.id !== selectedEmployee.id);
      setEmployees(updatedEmployees);
      localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updatedEmployees));
      setDetailModalOpen(false);
    }
  };

  return (
    <Box sx={{
    width: '100vw',
    height: 'calc(100vh - 52px)', // nếu header cao 52px
    background: '#f7fafd',
    position: 'fixed',
    top: '52px',
    left: 0,
    overflow: 'auto',
    p: { xs: 0, md: 2 }, }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', background: '#283fd6', color: '#fff', p: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Danh sách nhân viên</Typography>
        <Button
          variant="contained"
          sx={{ background: '#1976d2', color: '#fff', fontWeight: 'bold' }}
          onClick={handleAddEmployee}
        >
          Thêm nhân viên
        </Button>
      </Box>
      {/* Bộ lọc */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, pb: 0 }}>
        <select
          value={positionFilter}
          onChange={e => setPositionFilter(e.target.value)}
          style={{ padding: 8, minWidth: 180, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">-- Lọc chức vụ --</option>
          {positions.map((pos, idx) => (
            <option key={idx} value={pos}>{pos}</option>
          ))}
        </select>
        <select
          value={officeFilter}
          onChange={e => setOfficeFilter(e.target.value)}
          style={{ padding: 8, minWidth: 180, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">-- Lọc địa điểm --</option>
          {offices.map((of, idx) => (
            <option key={idx} value={of}>{of}</option>
          ))}
        </select>
        <TextField
          placeholder="Tìm kiếm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 220, height: 45, '& .MuiInputBase-root': { height: 40 } }}
          size="small"
        />
      </Box>
      {/* Table Header */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <Box sx={{ background: '#BEBEBE', color: '#000000', p: 1, textAlign: 'center', borderBottom: '2px solid #fff', fontWeight: 'bold' }}>STT</Box>
          <Box sx={{ background: '#BEBEBE', color: '#000000', p: 1, textAlign: 'center', borderBottom: '2px solid #fff', fontWeight: 'bold' }}>Tên</Box>
          <Box sx={{ background: '#BEBEBE', color: '#000000', p: 1, textAlign: 'center', borderBottom: '2px solid #fff', fontWeight: 'bold' }}>Chức vụ</Box>
          <Box sx={{ background: '#BEBEBE', color: '#000000', p: 1, textAlign: 'center', borderBottom: '2px solid #fff', fontWeight: 'bold' }}>Địa điểm</Box>
        </Box>
        {/* Table Body */}
        {paginated.map((emp, idx) => (
          <Box
            key={emp.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover > *': {
                background: '#d1b7b7',
              },
            }}
            onDoubleClick={() => handleRowDoubleClick(emp)}
          >
            <Box sx={{ background: '#EED5D2', color: '#000000', p: 1, textAlign: 'center', borderBottom: '1px solid #fff' }}>{(page - 1) * rowsPerPage + idx + 1}</Box>
            <Box sx={{ background: '#EED5D2', color: '#000000', p: 1, textAlign: 'center', borderBottom: '1px solid #fff' }}>{emp.name}</Box>
            <Box sx={{ background: '#EED5D2', color: '#000000', p: 1, textAlign: 'center', borderBottom: '1px solid #fff' }}>{emp.position}</Box>
            <Box sx={{ background: '#EED5D2', color: '#000000', p: 1, textAlign: 'center', borderBottom: '1px solid #fff' }}>{emp.office}</Box>
          </Box>
        ))}
      </Box>
      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <IconButton onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ArrowBackIos fontSize="small" /></IconButton>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <Button
            key={num}
            variant={num === page ? 'contained' : 'outlined'}
            sx={{ mx: 0.5, minWidth: 36, background: num === page ? '#283fd6' : '#fff', color: num === page ? '#fff' : '#283fd6', borderColor: '#283fd6' }}
            onClick={() => setPage(num)}
          >
            {num}
          </Button>
        ))}
        <IconButton onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ArrowForwardIos fontSize="small" /></IconButton>
      </Box>
      {/* Modal thêm nhân viên */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, minWidth: 350 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Thêm nhân viên mới</Typography>
          <TextField
            label="Họ tên"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.name}
            onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <TextField
            label="Username"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.username}
            onChange={e => setNewEmployee({ ...newEmployee, username: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.password}
            onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.email}
            onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.phone}
            onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="gender-label">Giới tính</InputLabel>
            <Select
              labelId="gender-label"
              value={newEmployee.gender}
              label="Giới tính"
              onChange={e => setNewEmployee({ ...newEmployee, gender: e.target.value })}
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Địa chỉ"
            fullWidth
            sx={{ mb: 2 }}
            value={newEmployee.address}
            onChange={e => setNewEmployee({ ...newEmployee, address: e.target.value })}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="position-label">Chức vụ</InputLabel>
            <Select
              labelId="position-label"
              value={newEmployee.position}
              label="Chức vụ"
              onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
            >
              {positions.map((pos, idx) => (
                <MenuItem key={idx} value={pos}>{pos}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="office-label">Văn phòng</InputLabel>
            <Select
              labelId="office-label"
              value={newEmployee.office}
              label="Văn phòng"
              onChange={e => setNewEmployee({ ...newEmployee, office: e.target.value })}
            >
              {offices.map((of, idx) => (
                <MenuItem key={idx} value={of}>{of}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-label">Vai trò</InputLabel>
            <Select
              labelId="role-label"
              value={newEmployee.role}
              label="Vai trò"
              onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleModalClose}>Huỷ</Button>
            <Button variant="contained" onClick={handleModalSave}>Lưu</Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal chi tiết nhân viên */}
      <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, minWidth: 400, maxWidth: 500 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Thông tin nhân viên</Typography>
          {selectedEmployee && !isEditMode && (
            <>
              <Typography><b>Họ tên:</b> {selectedEmployee.name}</Typography>
              <Typography><b>Username:</b> {selectedEmployee.username}</Typography>
              <Typography><b>Email:</b> {selectedEmployee.email}</Typography>
              <Typography><b>Số điện thoại:</b> {selectedEmployee.phone}</Typography>
              <Typography><b>Giới tính:</b> {selectedEmployee.gender}</Typography>
              <Typography><b>Địa chỉ:</b> {selectedEmployee.address}</Typography>
              <Typography><b>Chức vụ:</b> {selectedEmployee.position}</Typography>
              <Typography><b>Văn phòng:</b> {selectedEmployee.office}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={() => { setIsEditMode(true); setEditEmployee(selectedEmployee); }}>Chỉnh sửa</Button>
                <Button variant="contained" color="error" onClick={handleDeleteEmployee}>Xóa</Button>
                <Button onClick={() => setDetailModalOpen(false)}>Đóng</Button>
              </Box>
            </>
          )}
          {selectedEmployee && isEditMode && (
            <>
              <TextField label="Họ tên" fullWidth sx={{ mb: 2 }} value={editEmployee.name} onChange={e => setEditEmployee({ ...editEmployee, name: e.target.value })} />
              <TextField label="Username" fullWidth sx={{ mb: 2 }} value={editEmployee.username} onChange={e => setEditEmployee({ ...editEmployee, username: e.target.value })} />
              <TextField label="Email" fullWidth sx={{ mb: 2 }} value={editEmployee.email} onChange={e => setEditEmployee({ ...editEmployee, email: e.target.value })} />
              <TextField label="Số điện thoại" fullWidth sx={{ mb: 2 }} value={editEmployee.phone} onChange={e => setEditEmployee({ ...editEmployee, phone: e.target.value })} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="gender-label-detail">Giới tính</InputLabel>
                <Select labelId="gender-label-detail" value={editEmployee.gender} label="Giới tính" onChange={e => setEditEmployee({ ...editEmployee, gender: e.target.value })}>
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Địa chỉ" fullWidth sx={{ mb: 2 }} value={editEmployee.address} onChange={e => setEditEmployee({ ...editEmployee, address: e.target.value })} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="position-label-detail">Chức vụ</InputLabel>
                <Select labelId="position-label-detail" value={editEmployee.position} label="Chức vụ" onChange={e => setEditEmployee({ ...editEmployee, position: e.target.value })}>
                  {positions.map((pos, idx) => (
                    <MenuItem key={idx} value={pos}>{pos}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="office-label-detail">Văn phòng</InputLabel>
                <Select labelId="office-label-detail" value={editEmployee.office} label="Văn phòng" onChange={e => setEditEmployee({ ...editEmployee, office: e.target.value })}>
                  {offices.map((of, idx) => (
                    <MenuItem key={idx} value={of}>{of}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={handleSaveEdit}>Lưu</Button>
                <Button onClick={() => setIsEditMode(false)}>Hủy</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <AlertPopup open={openAlert} message={alertMessage} type="error" onClose={() => setOpenAlert(false)} />
    </Box>
  );
};

export default EmployeeTable; 
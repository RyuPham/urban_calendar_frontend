import React, { useState, useEffect, useRef } from 'react';
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
  Avatar,
} from '@mui/material';
import {
  Search,
  ArrowBackIos,
  ArrowForwardIos,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import AlertPopup from '../../components/common/AlertPopup';
import styles from './EmployeeList.module.css';
import companies from '../admin/CompanyManagement';
import stylesProfile from './ProfileModal.module.css';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import axios from 'axios';
import chucvu from '../admin/ChucvuManagement';

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

const initialEmployeeState = {
  name: '',
  username: '',
  password: '',
  email: '',
  phone: '',
  startdate: new Date().toISOString().slice(0, 10),
  office: '',
  role: '',
  avatar: '',
  accountRole: '',
};

const EmployeeTable = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  // [UPDATED] State lọc vai trò
  const [roleFilter, setRoleFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  // State quản lý danh sách nhân viên
  const [employees, setEmployees] = useState([]);
  // State quản lý hover
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [roles, setRoles] = useState(chucvu);
  const [newEmployee, setNewEmployee] = useState(initialEmployeeState);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const offices = companies.map(c => c.name);

  // [UPDATED] Lọc nhân viên theo vai trò
  const filtered = employees.filter(emp =>
    (roleFilter ? emp.role === roleFilter : true) &&
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

  // Lấy dữ liệu nhân viên từ local storage khi component mount
  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem(EMPLOYEE_KEY));
    if (storedEmployees) {
      setEmployees(storedEmployees);
    }
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setNewEmployee(initialEmployeeState);
      setAvatarPreview('');
    }
  }, [isModalOpen]);

  // Hàm xóa nhân viên
  const handleDelete = (id) => {
    if (window.confirm('Muốn xóa nhân viên này?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleAddEmployee = () => {
    setNewEmployee(initialEmployeeState);
    setAvatarPreview(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewEmployee(initialEmployeeState);
    setAvatarPreview(null);
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
      setAlertMessage('SDT không được sai hoặc vượt quá 15 số!');
      setOpenAlert(true);
      return;
    }
    if (!newEmployee.password || !newEmployee.startdate || !newEmployee.office || !newEmployee.role) {
      setAlertMessage('Vui lòng nhập đầy đủ thông tin!');
      setOpenAlert(true);
      return;
    }
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const updatedEmployees = [...employees, { ...newEmployee, id: newId, status: 'Đang làm việc' }];
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);
    setIsModalOpen(false);
    setNewEmployee(initialEmployeeState);
    setAvatarPreview(null);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'upload_urban');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dp17vdzvm/image/upload',
        formData
      );
      const imageUrl = response.data.secure_url;
      setNewEmployee({ ...newEmployee, avatar: imageUrl });
      setAvatarPreview(imageUrl);
    } catch (error) {
      console.error('Lỗi upload ảnh lên Cloudinary:', error);
      setAlertMessage('Tải ảnh lên thất bại. Vui lòng thử lại.');
      setOpenAlert(true);
    } finally {
      setIsUploading(false);
    }
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
      setAlertMessage('Số điện thoại không được sai hoặc vượt quá 15 số!');
      setOpenAlert(true);
      return;
    }
    if (!editEmployee.startdate || !editEmployee.office) {
      setAlertMessage('Vui lòng nhập đầy đủ thông tin!');
      setOpenAlert(true);
      return;
    }
    // Không kiểm tra avatar, chỉ lưu lại thông tin
    const updatedEmployees = employees.map(e => e.id === editEmployee.id ? { ...editEmployee } : e);
    setEmployees(updatedEmployees);
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updatedEmployees));
    setSelectedEmployee(editEmployee);
    setIsEditMode(false);
    setDetailModalOpen(false);
  };

  // Hàm xóa nhân viên từ modal chi tiết
  const handleDeleteEmployee = () => {
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedEmployee) return;
      const updatedEmployees = employees.filter(e => e.id !== selectedEmployee.id);
      setEmployees(updatedEmployees);
      localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(updatedEmployees));
      setDetailModalOpen(false);
    setOpenConfirm(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'upload_urban'); // TODO: Replace with your upload preset

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dp17vdzvm/image/upload', // TODO: Replace with your cloud name
                formData
            );
            if (isModalOpen) {
              setNewEmployee({ ...newEmployee, avatar: response.data.secure_url });
            } else if (isEditMode) {
              setEditEmployee({ ...editEmployee, avatar: response.data.secure_url });
            }
        } catch (error) {
            setAlertMessage('Lỗi tải ảnh lên!');
            setOpenAlert(true);
            console.error('Error uploading image: ', error);
        }
    }
  };

  const handleAvatarClick = () => {
      fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.titleCenter}>Danh sách nhân viên</h2>
        <Button
          variant="contained"
          className={styles.addBtn}
          onClick={handleAddEmployee}
        >
          Thêm nhân viên
        </Button>
      </div>
      {/* Bộ lọc */}
      <div className={styles.filterBar}>
        {/* [UPDATED] Dropdown Chức vụ */}
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">-- Chức vụ --</option>
          {roles.map((role, idx) => (
            <option key={idx} value={role.name}>{role.name}</option>
          ))}
        </select>
        <select
          value={officeFilter}
          onChange={e => setOfficeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">-- Trụ sở --</option>
          {offices.map((of, idx) => (
            <option key={idx} value={of}>{of}</option>
          ))}
        </select>
        <TextField
          placeholder="Tìm kiếm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          style={{ minWidth: 220, height: 45 }}
        />
      </div>
      {/* Table Header */}
      <div className={styles.tableHeaderRow}>
        <div className={styles.tableHeaderCell}>STT</div>
        <div className={styles.tableHeaderCell}>Tên</div>
        <div className={styles.tableHeaderCell}>Chức vụ</div>
        <div className={styles.tableHeaderCell}>Trụ sở</div>
      </div>
        {/* Table Body */}
        {paginated.map((emp, idx) => (
        <div
            key={emp.id}
          className={styles.tableRow}
            onDoubleClick={() => handleRowDoubleClick(emp)}
          >
          <div className={styles.tableCell}>{(page - 1) * rowsPerPage + idx + 1}</div>
          <div className={styles.tableCell}>{emp.name}</div>
          <div className={styles.tableCell}>
            {(() => {
              // Tìm chức vụ theo tên hoặc id (nếu cần)
              const foundRole = roles.find(r => r.name === emp.role || r.id === emp.role);
              return foundRole ? foundRole.name : emp.role || '';
            })()}
          </div>
          <div className={styles.tableCell}>{emp.office}</div>
        </div>
        ))}
      {/* Pagination */}
      <div className={styles.pagination}>
        <IconButton onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ArrowBackIos fontSize="small" /></IconButton>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <Button
            key={num}
            variant={num === page ? 'contained' : 'outlined'}
            className={num === page ? `${styles.pageBtn} ${styles.pageBtnActive}` : styles.pageBtn}
            onClick={() => setPage(num)}
          >
            {num}
          </Button>
        ))}
        <IconButton onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ArrowForwardIos fontSize="small" /></IconButton>
      </div>
      {/* Modal thêm nhân viên */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <div className={styles.modalBox}>
          <h2 className={styles.addFormTitle}>Thêm nhân viên mới</h2>
          <div className={styles.addFormRow}>
            <div className={styles.addFormLeft}>
              <div className={styles.avatarContainer}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className={styles.avatarRect} />
                ) : (
                  <img src="https://via.placeholder.com/240x300?text=Avatar" alt="Avatar" className={styles.avatarRect} />
                )}
                <Box className={styles.avatarUploadSection}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
                    </Button>
                  </label>
                </Box>
              </div>
            </div>
            <div className={styles.addFormRight}>
          <TextField
            label="Họ tên"
            fullWidth
                className={styles.addFormField}
            value={newEmployee.name}
            onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                autoComplete="off"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
                className={styles.addFormField}
            value={newEmployee.password}
            onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
                autoComplete="new-password"
          />
          <TextField
            label="Email"
            fullWidth
                className={styles.addFormField}
            value={newEmployee.email}
            onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
                className={styles.addFormField}
            value={newEmployee.phone}
            onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })}
          />
          <TextField
            label="Ngày bắt đầu"
            fullWidth
            className={styles.addFormField}
            value={newEmployee.startdate}
            InputProps={{ readOnly: true }}
          />
              <FormControl fullWidth className={styles.addFormField}>
            <InputLabel id="office-label">Trụ sở</InputLabel>
            <Select
              labelId="office-label"
              value={newEmployee.office}
              label="Trụ sở"
              onChange={e => setNewEmployee({ ...newEmployee, office: e.target.value })}
            >
              {offices.map((of, idx) => (
                <MenuItem key={idx} value={of}>{of}</MenuItem>
              ))}
            </Select>
          </FormControl>
              <FormControl fullWidth className={styles.addFormField}>
            <InputLabel id="role-label">Chức vụ</InputLabel>
            <Select
              labelId="role-label"
              value={newEmployee.role}
              label="Chức vụ"
              onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className={styles.addFormField}>
            <InputLabel id="account-role-label">Vai trò</InputLabel>
            <Select
              labelId="account-role-label"
              value={newEmployee.accountRole}
              label="Vai trò tài khoản"
              onChange={e => setNewEmployee({ ...newEmployee, accountRole: e.target.value })}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
              <div className={styles.modalActions}>
                <Button onClick={() => {
                  setIsModalOpen(false);
                  setNewEmployee(initialEmployeeState);
                  setAvatarPreview('');
                }}>Huỷ</Button>
            <Button variant="contained" onClick={handleModalSave}>Lưu</Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* Modal chi tiết nhân viên */}
      {detailModalOpen && selectedEmployee && (
        <>
      <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
            {isEditMode ? (
              <div className={styles.modalBox}>
                <div className={styles.addFormRow}>
                  <div className={styles.addFormLeft}>
                    <div className={styles.avatarContainer}>
                      {editEmployee.avatar ? (
                        <img src={editEmployee.avatar} alt="Avatar" className={styles.avatarRect} />
                      ) : (
                        <img src="https://via.placeholder.com/240x300?text=Avatar" alt="Avatar" className={styles.avatarRect} />
                      )}
                      <label className={styles.avatarButton}>
                        Chọn ảnh đại diện
                        <input type="file" accept="image/*" hidden onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setIsUploading(true);
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('upload_preset', 'upload_urban');

                            try {
                              const response = await axios.post(
                                'https://api.cloudinary.com/v1_1/dp17vdzvm/image/upload',
                                formData
                              );
                              const imageUrl = response.data.secure_url;
                              setEditEmployee({ ...editEmployee, avatar: imageUrl });
                            } catch (error) {
                              console.error('Lỗi upload ảnh lên Cloudinary:', error);
                              setAlertMessage('Tải ảnh lên thất bại. Vui lòng thử lại.');
                              setOpenAlert(true);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <div className={styles.addFormRight}>
                    <TextField
                      label="Họ tên"
                      fullWidth
                      className={styles.addFormField}
                      value={editEmployee.name}
                      onChange={e => setEditEmployee({ ...editEmployee, name: e.target.value })}
                    />
                    <TextField
                      label="Email"
                      fullWidth
                      className={styles.addFormField}
                      value={editEmployee.email}
                      onChange={e => setEditEmployee({ ...editEmployee, email: e.target.value })}
                    />
                    <TextField
                      label="Số điện thoại"
                      fullWidth
                      className={styles.addFormField}
                      value={editEmployee.phone}
                      onChange={e => setEditEmployee({ ...editEmployee, phone: e.target.value })}
                    />
                    <FormControl fullWidth className={styles.addFormField}>
                      <InputLabel id="gender-label-edit">Ngày bắt đầu</InputLabel>
                      <Select
                        labelId="gender-label-edit"
                        value={editEmployee.startdate}
                        label="Ngày bắt đầu"
                        onChange={e => setEditEmployee({ ...editEmployee, startdate: e.target.value })}
                      >
                  <MenuItem value={new Date().toLocaleDateString('en-CA')}>{new Date().toLocaleDateString('en-CA')}</MenuItem>
                </Select>
              </FormControl>
                    <FormControl fullWidth className={styles.addFormField}>
                      <InputLabel id="position-label-edit">Trụ sở</InputLabel>
                      <Select
                        labelId="position-label-edit"
                        value={editEmployee.office}
                        label="Trụ sở"
                        onChange={e => setEditEmployee({ ...editEmployee, office: e.target.value })}
                      >
                  {offices.map((of, idx) => (
                    <MenuItem key={idx} value={of}>{of}</MenuItem>
                  ))}
                </Select>
              </FormControl>
                    <FormControl fullWidth className={styles.addFormField}>
                      <InputLabel id="role-label-edit">Chức vụ</InputLabel>
                      <Select
                        labelId="role-label-edit"
                        value={editEmployee.role}
                        label="Chức vụ"
                        onChange={e => setEditEmployee({ ...editEmployee, role: e.target.value })}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div className={styles.modalActions}>
                      <Button onClick={() => setIsEditMode(false)}>Hủy</Button>
                <Button variant="contained" onClick={handleSaveEdit}>Lưu</Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={stylesProfile.profileModalBox}>
                <div className={stylesProfile.profileHeader}>
                  <div className={stylesProfile.profileAvatarCol}>
                    {selectedEmployee.avatar ? (
                      <img src={selectedEmployee.avatar} alt="Avatar" className={stylesProfile.profileAvatarRect} />
                    ) : (
                      <div className={`${stylesProfile.profileAvatarRect} ${stylesProfile.profileAvatarPlaceholder}`} />
                    )}
                  </div>
                  <div className={stylesProfile.profileNameCol}>
                    <div className={stylesProfile.profileName}>{selectedEmployee.name}</div>
                  </div>
                </div>
                <div className={stylesProfile.profileInfoSection}>
                  <div className={stylesProfile.profileInfoBlock}>
                    <div className={stylesProfile.profileInfoTitle}>Thông tin cá nhân</div>
                    <div className={stylesProfile.profileInfoGrid}>
                      <div>
                        <div className={stylesProfile.profileInfoLabel}>Email</div>
                        <div className={stylesProfile.profileInfoValue}>{selectedEmployee.email}</div>
                      </div>
                      <div>
                        <div className={stylesProfile.profileInfoLabel}>Số điện thoại</div>
                        <div className={stylesProfile.profileInfoValue}>{selectedEmployee.phone}</div>
                      </div>
                      <div>
                        <div className={stylesProfile.profileInfoLabel}>Ngày bắt đầu</div>
                        <div className={stylesProfile.profileInfoValue}>{selectedEmployee.startdate}</div>
                      </div>
                    </div>
                  </div>
                  <div className={stylesProfile.profileInfoBlock}>
                    <div className={stylesProfile.profileInfoTitle}>Thông tin công việc</div>
                    <div className={stylesProfile.profileInfoGrid}>
                      <div>
                        <div className={stylesProfile.profileInfoLabel}>Trụ sở</div>
                        <div className={stylesProfile.profileInfoValue}>{selectedEmployee.office}</div>
                      </div>
                      <div>
                        <div className={stylesProfile.profileInfoLabel}>Chức vụ</div>
                        <div className={stylesProfile.profileInfoValue}>
                          {(() => {
                            // Tìm chức vụ theo tên hoặc id (nếu cần)
                            const foundRole = roles.find(r => r.name === selectedEmployee.role || r.id === selectedEmployee.role);
                            return foundRole ? foundRole.name : selectedEmployee.role || '';
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={stylesProfile.profileModalActions}>
                  <Button variant="contained" onClick={() => { setIsEditMode(true); setEditEmployee(selectedEmployee); }}>Chỉnh sửa</Button>
                  <Button variant="contained" color="error" onClick={handleDeleteEmployee}>Xóa</Button>
                  <Button onClick={() => setDetailModalOpen(false)}>Đóng</Button>
                </div>
              </div>
            )}
          </Modal>
          <ConfirmDialog
            open={openConfirm}
            title="Xác nhận xóa nhân viên"
            content="Bạn muốn xóa nhân viên này?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setOpenConfirm(false)}
            okText="Xóa"
            cancelText="Hủy"
          />
            </>
          )}
      <AlertPopup open={openAlert} message={alertMessage} type="error" onClose={() => setOpenAlert(false)} className={isModalOpen ? styles.alertOnModal : ''} />
    </div>
  );
};

export default EmployeeTable; 
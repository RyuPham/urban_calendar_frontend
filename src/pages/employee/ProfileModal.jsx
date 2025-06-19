import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import AlertPopup from '../../components/common/AlertPopup';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileModal.module.css';
import empStyles from './EmployeeList.module.css';

const EMPLOYEE_KEY = 'employees';

const ProfileModal = ({ open, onClose }) => {
    const user = useSelector(state => state.auth.user) || JSON.parse(localStorage.getItem('currentUser'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        if (user) {
            const data = localStorage.getItem(EMPLOYEE_KEY);
            if (data) {
                const employees = JSON.parse(data);
                const emp = employees.find(e => e.id === user.id);
                setEmployee(emp || user);
                setAvatarPreview((emp || user).avatar || null);
            } else {
                setEmployee(user);
                setAvatarPreview(user.avatar || null);
            }
        }
    }, [user, open]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setEditEmployee({ ...editEmployee, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!editEmployee.name || !editEmployee.phone || !editEmployee.gender || !editEmployee.address) {
            setAlertMessage('Vui lòng nhập đầy đủ thông tin!');
            setOpenAlert(true);
            return;
        }
        // Cập nhật localStorage
        const data = localStorage.getItem(EMPLOYEE_KEY);
        if (data) {
            let employees = JSON.parse(data);
            employees = employees.map(e => e.id === editEmployee.id ? { ...e, ...editEmployee, avatar: editEmployee.avatar || avatarPreview } : e);
            localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employees));
        }
        setEmployee({ ...editEmployee, avatar: editEmployee.avatar || avatarPreview });
        setAvatarPreview(editEmployee.avatar || avatarPreview);
        setIsEditMode(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!user || !employee) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <div className={isEditMode ? empStyles.modalBox : styles.profileModalBox}>
                {!isEditMode ? (
                    <>
                        <div className={styles.profileHeader}>
                            <div className={styles.profileAvatarCol}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className={styles.profileAvatarRect} />
                                ) : (
                                    <div className={`${styles.profileAvatarRect} ${styles.profileAvatarPlaceholder}`} />
                                )}
                            </div>
                            <div className={styles.profileNameCol}>
                                <div className={styles.profileName}>{employee.name}</div>
                            </div>
                        </div>
                        <div className={styles.profileInfoSection}>
                            <div className={styles.profileInfoBlock}>
                                <div className={styles.profileInfoTitle}>Thông tin cá nhân</div>
                                <div className={styles.profileInfoGrid}>
                                    <div>
                                        <div className={styles.profileInfoLabel}>Email</div>
                                        <div className={styles.profileInfoValue}>{employee.email}</div>
                                    </div>
                                    <div>
                                        <div className={styles.profileInfoLabel}>Số điện thoại</div>
                                        <div className={styles.profileInfoValue}>{employee.phone}</div>
                                    </div>
                                    <div>
                                        <div className={styles.profileInfoLabel}>Giới tính</div>
                                        <div className={styles.profileInfoValue}>{employee.gender}</div>
                                    </div>
                                    <div>
                                        <div className={styles.profileInfoLabel}>Địa chỉ</div>
                                        <div className={styles.profileInfoValue}>{employee.address}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.profileInfoBlock}>
                                <div className={styles.profileInfoTitle}>Thông tin công việc</div>
                                <div className={styles.profileInfoGrid}>
                                    <div>
                                        <div className={styles.profileInfoLabel}>Chức vụ</div>
                                        <div className={styles.profileInfoValue}>{employee.position}</div>
                                    </div>
                                    <div>
                                        <div className={styles.profileInfoLabel}>Văn phòng</div>
                                        <div className={styles.profileInfoValue}>{employee.office}</div>
                                    </div>
                                    <div>
                                        <div className={styles.profileInfoLabel}>Vai trò</div>
                                        <div className={styles.profileInfoValue}>{employee.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.profileModalActions} style={{ justifyContent: 'space-between' }}>
                            <div className={styles.groupButton}>
                                <Button variant="contained" color="primary" onClick={() => { setIsEditMode(true); setEditEmployee(employee); }} style={{ marginRight: 8 }}>
                                    Chỉnh sửa
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => { onClose(); setTimeout(() => navigate('/change-password'), 200); }}>
                                    Đổi mật khẩu
                                </Button>
                            </div>
                            <div>
                                <Button onClick={onClose}>Đóng</Button>
                                <Button color="error" variant="outlined" onClick={handleLogout}>Đăng xuất</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={empStyles.modalBox}>
                        <div className={empStyles.addFormRow}>
                            <div className={empStyles.addFormLeft}>
                                <div className={empStyles.avatarContainer}>
                                    {editEmployee.avatar ? (
                                        <img src={editEmployee.avatar} alt="Avatar" className={empStyles.avatarRect} />
                                    ) : (
                                        <img src="https://via.placeholder.com/240x300?text=Avatar" alt="Avatar" className={empStyles.avatarRect} />
                                    )}
                                    <label className={empStyles.avatarButton}>
                                        Chọn ảnh đại diện
                                        <input type="file" accept="image/*" hidden onChange={e => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setEditEmployee({ ...editEmployee, avatar: reader.result });
                                                    setAvatarPreview(reader.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </label>
                                </div>
                            </div>
                            <div className={empStyles.addFormRight}>
                                <TextField
                                    label="Họ tên"
                                    fullWidth
                                    className={empStyles.addFormField}
                                    value={editEmployee.name}
                                    onChange={e => setEditEmployee({ ...editEmployee, name: e.target.value })}
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    className={empStyles.addFormField}
                                    value={editEmployee.email}
                                    onChange={e => setEditEmployee({ ...editEmployee, email: e.target.value })}
                                />
                                <TextField
                                    label="Số điện thoại"
                                    fullWidth
                                    className={empStyles.addFormField}
                                    value={editEmployee.phone}
                                    onChange={e => setEditEmployee({ ...editEmployee, phone: e.target.value })}
                                />
                                <FormControl fullWidth className={empStyles.addFormField}>
                                    <InputLabel id="gender-label-edit">Giới tính</InputLabel>
                                    <Select
                                        labelId="gender-label-edit"
                                        value={editEmployee.gender}
                                        label="Giới tính"
                                        onChange={e => setEditEmployee({ ...editEmployee, gender: e.target.value })}
                                    >
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                        <MenuItem value="Khác">Khác</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Địa chỉ"
                                    fullWidth
                                    className={empStyles.addFormField}
                                    value={editEmployee.address}
                                    onChange={e => setEditEmployee({ ...editEmployee, address: e.target.value })}
                                />
                                <div className={empStyles.modalActions}>
                                    <Button onClick={() => setIsEditMode(false)}>Hủy</Button>
                                    <Button variant="contained" onClick={handleSave}>Lưu</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <AlertPopup open={openAlert} message={alertMessage} type="error" onClose={() => setOpenAlert(false)} />
            </div>
        </Modal>
    );
};

export default ProfileModal; 
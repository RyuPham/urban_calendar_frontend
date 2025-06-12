// import React, { useState, useEffect } from 'react';
// import {
//     Table,
//     Button,
//     Modal,
//     Form,
//     Input,
//     message,
//     Space,
// } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import AlertPopup from '../../components/common/AlertPopup';
// import ConfirmDialog from '../../components/common/ConfirmDialog';

// const EmployeeManagement = () => {
//     const [employees, setEmployees] = useState([]);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [form] = Form.useForm();
//     const [editingId, setEditingId] = useState(null);
//     const [offices, setOffices] = useState([]);
//     const [openAlert, setOpenAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');
//     const [alertType, setAlertType] = useState('success');
//     const [confirmOpen, setConfirmOpen] = useState(false);
//     const [confirmId, setConfirmId] = useState(null);

//     useEffect(() => {
//         const data = localStorage.getItem('employees');
//         if (data) {
//             setEmployees(JSON.parse(data));
//         } else {
//             // Chỉ set dữ liệu mẫu nếu localStorage chưa có
//             const initial = [
//                 { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', phone: '0123456789', position: 'Nhân viên', office: '' },
//                 { id: 2, name: 'Trần Thị B', email: 'b@email.com', phone: '0987654321', position: 'Trưởng phòng', office: '' }
//             ];
//             setEmployees(initial);
//             localStorage.setItem('employees', JSON.stringify(initial));
//         }
//         // Lấy danh sách văn phòng từ localStorage (key mới: companies)
//         const officeData = localStorage.getItem('companies');
//         if (officeData) setOffices(JSON.parse(officeData));
//     }, []);

//     useEffect(() => {
//         localStorage.setItem('employees', JSON.stringify(employees));
//     }, [employees]);

//     const handleAdd = () => {
//         setEditingId(null);
//         form.resetFields();
//         // Lấy lại danh sách văn phòng mới nhất khi mở form (key mới: companies)
//         const officeData = localStorage.getItem('companies');
//         if (officeData) setOffices(JSON.parse(officeData));
//         setIsModalVisible(true);
//     };

//     const handleEdit = (record) => {
//         setEditingId(record.id);
//         form.setFieldsValue(record);
//         // Lấy lại danh sách văn phòng mới nhất khi mở form (key mới: companies)
//         const officeData = localStorage.getItem('companies');
//         if (officeData) setOffices(JSON.parse(officeData));
//         setIsModalVisible(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             setEmployees(prev => prev.filter(emp => emp.id !== id));
//             setAlertMessage('Xoá nhân viên thành công');
//             setAlertType('success');
//             setOpenAlert(true);
//         } catch (error) {
//             setAlertMessage('Xoá nhân viên thất bại');
//             setAlertType('error');
//             setOpenAlert(true);
//         }
//     };

//     const handleSubmit = async () => {
//         try {
//             const values = await form.validateFields();
//             if (editingId) {
//                 // Update
//                 setEmployees(prev =>
//                     prev.map(emp => (emp.id === editingId ? { ...emp, ...values, id: editingId } : emp))
//                 );
//                 setAlertMessage('Cập nhật nhân viên thành công');
//                 setAlertType('success');
//                 setOpenAlert(true);
//             } else {
//                 // Create
//                 const newId = Math.max(0, ...employees.map(e => e.id)) + 1;
//                 setEmployees(prev => [...prev, { ...values, id: newId }]);
//                 setAlertMessage('Thêm nhân viên thành công');
//                 setAlertType('success');
//                 setOpenAlert(true);
//             }
//             setIsModalVisible(false);
//         } catch (error) {
//             setAlertMessage('Lưu nhân viên thất bại');
//             setAlertType('error');
//             setOpenAlert(true);
//         }
//     };

//     const columns = [
//         {
//             title: 'Họ tên',
//             dataIndex: 'name',
//             key: 'name',
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//         },
//         {
//             title: 'Số điện thoại',
//             dataIndex: 'phone',
//             key: 'phone',
//         },
//         {
//             title: 'Chức vụ',
//             dataIndex: 'position',
//             key: 'position',
//         },
//         {
//             title: 'Thao tác',
//             key: 'actions',
//             render: (_, record) => (
//                 <Space>
//                     <Button
//                         type="primary"
//                         icon={<EditOutlined />}
//                         onClick={() => handleEdit(record)}
//                     >
//                         Sửa
//                     </Button>
//                     <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => { setConfirmId(record.id); setConfirmOpen(true); }}>
//                         Xoá
//                     </Button>
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <div style={{ padding: '24px' }}>
//             <div style={{ marginBottom: '16px' }}>
//                 <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     onClick={handleAdd}
//                 >
//                     Thêm nhân viên
//                 </Button>
//             </div>

//             <Table
//                 columns={columns}
//                 dataSource={employees}
//                 rowKey="id"
//             />

//             <Modal
//                 title={editingId ? 'Sửa nhân viên' : 'Thêm nhân viên'}
//                 open={isModalVisible}
//                 onOk={handleSubmit}
//                 onCancel={() => setIsModalVisible(false)}
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         name="name"
//                         label="Họ tên"
//                         rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="email"
//                         label="Email"
//                         rules={[
//                             { required: true, message: 'Vui lòng nhập email!' },
//                             { type: 'email', message: 'Email không hợp lệ!' },
//                         ]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="phone"
//                         label="Số điện thoại"
//                         rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="position"
//                         label="Chức vụ"
//                         rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         name="office"
//                         label="Văn phòng"
//                         rules={[{ required: true, message: 'Vui lòng chọn văn phòng!' }]}
//                     >
//                         <select style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}>
//                             <option value="">Chọn văn phòng</option>
//                             {offices.map((company) => (
//                                 <option key={company.id || company.name} value={company.name}>{company.name}</option>
//                             ))}
//                         </select>
//                     </Form.Item>
//                 </Form>
//             </Modal>

//             <ConfirmDialog
//                 open={confirmOpen}
//                 title="Bạn có chắc chắn muốn xoá nhân viên này?"
//                 onConfirm={() => { handleDelete(confirmId); setConfirmOpen(false); }}
//                 onCancel={() => setConfirmOpen(false)}
//                 okText="Xoá"
//                 cancelText="Huỷ"
//             />

//             <AlertPopup open={openAlert} message={alertMessage} type={alertType} onClose={() => setOpenAlert(false)} />
//         </div>
//     );
// };

// export default EmployeeManagement; 
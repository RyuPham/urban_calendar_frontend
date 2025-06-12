import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AlertPopup from '../../components/common/AlertPopup';

const COMPANY_DRAFT_KEY = 'companyFormDraft';
const COMPANY_LIST_KEY = 'companies';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Load companies from localStorage
  useEffect(() => {
    const data = localStorage.getItem(COMPANY_LIST_KEY);
    if (data) {
      setCompanies(JSON.parse(data));
    } else {
      setCompanies([]);
    }
  }, []);

  // cho phép lưu thông tin trong localStorage
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem(COMPANY_LIST_KEY, JSON.stringify(companies));
    }
  }, [companies]);

  // Lưu nháp khi nhập liệu
  const handleFormChange = (_, allValues) => {
    localStorage.setItem(COMPANY_DRAFT_KEY, JSON.stringify(allValues));
  };

  // Xóa nháp
  const clearDraft = () => localStorage.removeItem(COMPANY_DRAFT_KEY);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    const draft = localStorage.getItem(COMPANY_DRAFT_KEY);
    if (draft) {
      form.setFieldsValue(JSON.parse(draft));
    }
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa công ty này?',
      onOk: () => {
        setCompanies(companies.filter(company => company.id !== id));
        setAlertMessage('Xóa công ty thành công');
        setAlertType('success');
        setOpenAlert(true);
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let newCompany;
      if (editingId) {
        setCompanies(prev =>
          prev.map(company => (company.id === editingId ? { ...company, ...values, id: editingId } : company))
        );
        newCompany = { ...values, id: editingId };
        setAlertMessage('Cập nhật công ty thành công');
        setAlertType('success');
        setOpenAlert(true);
      } else {
        const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
        newCompany = { ...values, id: newId };
        setCompanies(prev => [...prev, newCompany]);
        setAlertMessage('Thêm công ty thành công');
        setAlertType('success');
        setOpenAlert(true);
      }
      form.setFieldsValue(newCompany);
      clearDraft();
      setIsModalVisible(false);
    } catch (error) {
      setAlertMessage('Lưu công ty thất bại');
      setAlertType('error');
      setOpenAlert(true);
    }
  };

  const columns = [
    {
      title: 'Tên công ty',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', paddingBottom: 32 }}>
      <div style={{
        background: '#283fd6',
        color: '#fff',
        padding: '16px 24px',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 style={{ margin: 0 }}>Quản lý văn phòng</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm văn phòng
        </Button>
      </div>
      <div style={{ padding: 24 }}>
        <Table
          columns={columns}
          dataSource={companies}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', color: '#bfbfbf', padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>
                  <span role="img" aria-label="inbox">📥</span>
                </div>
                No data
              </div>
            )
          }}
        />
      </div>
      <Modal
        title={editingId ? 'Sửa văn phòng' : 'Thêm văn phòng'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => { setIsModalVisible(false); clearDraft(); }}
      >
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Form.Item
            name="name"
            label="Tên văn phòng"
            rules={[{ required: true, message: 'Vui lòng nhập tên văn phòng!' }]}
          >
            <Input placeholder="Nhập tên văn phòng" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[]}
          >
            <Input.TextArea placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>
      <AlertPopup open={openAlert} message={alertMessage} type={alertType} onClose={() => setOpenAlert(false)} />
    </div>
  );
};

export default CompanyManagement; 
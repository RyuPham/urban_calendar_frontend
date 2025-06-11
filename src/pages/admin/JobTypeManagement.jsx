import React, { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../../data/localStorage';
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

const JOBTYPE_DRAFT_KEY = 'jobTypeFormDraft';
const JOBTYPE_LIST_KEY = 'jobTypes';

const JobTypeManagement = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Load jobTypes from localStorage
  useEffect(() => {
    const storedJobTypes = getLocalStorage('jobTypes');
    if (!storedJobTypes) {
      setJobTypes([]);
    } else {
      setJobTypes(storedJobTypes);
    }
  }, []);

  // cho phép lưu thông tin trong localStorage
  useEffect(() => {
    if (jobTypes.length > 0) {
      localStorage.setItem(JOBTYPE_LIST_KEY, JSON.stringify(jobTypes));
    }
  }, [jobTypes]);

  // Lưu nháp khi nhập liệu
  const handleFormChange = (_, allValues) => {
    localStorage.setItem(JOBTYPE_DRAFT_KEY, JSON.stringify(allValues));
  };

  // Xóa nháp
  const clearDraft = () => localStorage.removeItem(JOBTYPE_DRAFT_KEY);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    const draft = localStorage.getItem(JOBTYPE_DRAFT_KEY);
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
      content: 'Bạn có chắc chắn muốn xóa loại hình này?',
      onOk: () => {
        setJobTypes(prev => prev.filter(jt => jt.id !== id));
        setAlertMessage('Xóa loại hình thành công');
        setAlertType('success');
        setOpenAlert(true);
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let newJobType;
      if (editingId) {
        setJobTypes(prev =>
          prev.map(jt => (jt.id === editingId ? { ...jt, ...values, id: editingId } : jt))
        );
        newJobType = { ...values, id: editingId };
        setAlertMessage('Cập nhật loại hình thành công');
        setAlertType('success');
        setOpenAlert(true);
      } else {
        const newId = jobTypes.length > 0 ? Math.max(...jobTypes.map(jt => jt.id)) + 1 : 1;
        newJobType = { ...values, id: newId };
        setJobTypes(prev => [...prev, newJobType]);
        setAlertMessage('Thêm loại hình thành công');
        setAlertType('success');
        setOpenAlert(true);
      }
      form.setFieldsValue(newJobType);
      clearDraft();
      setIsModalVisible(false);
    } catch (error) {
      setAlertMessage('Lưu loại hình thất bại');
      setAlertType('error');
      setOpenAlert(true);
    }
  };

  const columns = [
    {
      title: 'Tên loại hình',
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
        <h2 style={{ margin: 0 }}>Quản lý loại hình việc làm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm loại hình
        </Button>
      </div>
      <div style={{ padding: 24 }}>
        <Table
          columns={columns}
          dataSource={jobTypes}
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
        title={editingId ? 'Sửa loại hình' : 'Thêm loại hình'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => { setIsModalVisible(false); clearDraft(); }}
      >
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Form.Item
            name="name"
            label="Tên loại hình"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại hình!' }]}
          >
            <Input placeholder="Nhập tên loại hình" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>
      <AlertPopup open={openAlert} message={alertMessage} type={alertType} onClose={() => setOpenAlert(false)} />
    </div>
  );
};

export default JobTypeManagement; 
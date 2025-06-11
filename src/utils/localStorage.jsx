// Utility functions for localStorage operations
export const getLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial data for different entities
export const initialData = {
  employees: [
    {
      id: 1,
      name: 'LE HUYNH DIEP',
      position: 'Trưởng phòng',
      office: 'Trung tâm hành chính Miyagi',
      status: 'Đang làm việc',
    },
    // ... other initial employees
  ],
  roles: [
    { id: 1, name: 'Admin', description: 'Quản trị viên hệ thống' },
    { id: 2, name: 'Manager', description: 'Quản lý' },
    { id: 3, name: 'Employee', description: 'Nhân viên' },
  ],
  companies: [
    { id: 1, name: 'Company A', address: 'Tokyo, Japan' },
    { id: 2, name: 'Company B', address: 'Osaka, Japan' },
  ],
  jobTypes: [
    { id: 1, name: 'Full-time', description: 'Toàn thời gian' },
    { id: 2, name: 'Part-time', description: 'Bán thời gian' },
    { id: 3, name: 'Contract', description: 'Hợp đồng' },
  ],
};

// Initialize data if not exists
export const initializeData = () => {
  Object.entries(initialData).forEach(([key, value]) => {
    if (!getLocalStorage(key)) {
      setLocalStorage(key, value);
    }
  });
}; 
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';

// Mock data
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
];

const EmployeeTable = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const filtered = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', background: '#283fd6', color: '#fff', p: 1 }}>
        <img src="/logo192.png" alt="Logo" style={{ height: 40, marginRight: 16 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>URBAN Corporation Inc.</Typography>
      </Box>
      {/* Search & Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, background: '#f5f5f5' }}>
        <Button variant="contained" sx={{ background: '#283fd6', mr: 2 }} startIcon={<Search />}>Lọc</Button>
        <TextField
          placeholder="Tìm kiếm..."
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: { background: '#fff', borderRadius: 1 },
          }}
          sx={{ width: 300 }}
        />
      </Box>
      {/* Table */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>1</Box>
          <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>LE HUYNH DIEP</Box>
          <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>Trưởng phòng</Box>
          <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>Trung tâm hành chính Miyagi</Box>
          <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>Đang làm việc</Box>
          <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}></Box>
          <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}></Box>
        </Box>
        {filtered.map((emp, idx) => (
          <Box key={emp.id} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mt: 1 }}>
            <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>{emp.id}</Box>
            <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>{emp.name}</Box>
            <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>{emp.position}</Box>
            <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>{emp.office}</Box>
            <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}>{emp.status}</Box>
            <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}></Box>
            <Box sx={{ background: '#283fd6', color: '#fff', p: 1, textAlign: 'center', borderRadius: 1 }}></Box>
          </Box>
        ))}
      </Box>
      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <IconButton onClick={() => setPage(p => Math.max(1, p - 1))}><ArrowBackIos fontSize="small" /></IconButton>
        {[1, 2, 3].map(num => (
          <Button key={num} variant={num === page ? 'contained' : 'outlined'} sx={{ mx: 0.5, minWidth: 36, background: num === page ? '#283fd6' : '#fff', color: num === page ? '#fff' : '#283fd6', borderColor: '#283fd6' }}>{num}</Button>
        ))}
        <Button variant="outlined" sx={{ mx: 0.5, minWidth: 36, borderColor: '#283fd6', color: '#283fd6' }}>{'...'}</Button>
        <IconButton onClick={() => setPage(p => p + 1)}><ArrowForwardIos fontSize="small" /></IconButton>
      </Box>
    </Box>
  );
};

export default EmployeeTable; 
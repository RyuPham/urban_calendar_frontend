import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const weekdays = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function getWeekDates(currentDateInput) {
  let date;
  if (typeof currentDateInput === 'string') {
    const [year, month, day] = currentDateInput.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else if (currentDateInput instanceof Date) {
    date = new Date(currentDateInput.getFullYear(), currentDateInput.getMonth(), currentDateInput.getDate());
  } else {
    throw new Error('Invalid date input');
  }
  const dayOfWeek = date.getDay(); // CN = 0
  // Lấy đúng CN local
  const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i);
    return d;
  });
}

function formatDateDM(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

function getEventColor(type) {
  if (type === 'Nghỉ') return '#008000';
  if (type === 'Công tác') return '#000080';
  if (type === 'Làm việc') return '#1976d2';
  return '#43a047';
}

function getUserEventsForDay(events, userId, date) {
  // Trả về mảng các event của userId trong ngày date
  return events.filter(ev => {
    if (String(ev.userId) !== String(userId)) return false;
    const start = new Date(ev.start);
    const end = new Date(ev.end);
    return (
      start.toDateString() === date.toDateString() ||
      (start < date && end >= date)
    );
  });
}

// Hàm lấy màu loại ca giống Calendar.jsx
const jobTypeColors = {
  'Nghỉ': '#008000',
  'Công tác': '#000080',
  'Đang làm việc': '#cddc39',
  'Ra ngoài gặp kh': '#4fc3f7',
  'Làm việc từ xa': '#ffd600',
  'Nghỉ phép có lương': '#ff7043',
};
function getJobTypeColor(name) {
  if (jobTypeColors[name]) return jobTypeColors[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 60%, 60%)`;
}

const AdminScheduleTable = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const [events] = useState(() => {
    const data = localStorage.getItem('calendarEvents');
    return data ? JSON.parse(data) : [];
  });
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const data = localStorage.getItem('employees');
    if (data) {
      setEmployees(JSON.parse(data));
    } else {
      setEmployees([]);
    }
  }, []);
  const filteredEmployees = employees.filter(emp =>
    emp.name && emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', p: { xs: 0, md: 2 }, background: '#f7fafd', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', pt: 3, pb: 1, px: { xs: 1, md: 2 } }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2', textAlign: 'center', letterSpacing: 0.5 }}>
          Lịch làm việc nhân viên (theo tuần)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => setCurrentDate(d => { const nd = new Date(d); nd.setDate(d.getDate() - 7); return nd; })} sx={{ border: '1px solid #1976d2', color: '#1976d2' }}>
              {'<'}
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#1976d2', minWidth: 120, textAlign: 'center' }}>
              {formatDateDM(weekDates[0])} - {formatDateDM(weekDates[6])}
            </Typography>
            <IconButton size="small" onClick={() => setCurrentDate(d => { const nd = new Date(d); nd.setDate(d.getDate() + 7); return nd; })} sx={{ border: '1px solid #1976d2', color: '#1976d2' }}>
              {'>'}
            </IconButton>
          </Box>
          <TextField
            size="small"
            placeholder="Tìm kiếm nhân viên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 220, background: '#fff', borderRadius: 2, boxShadow: 'none', border: '1px solid #1976d2' }}
            InputProps={{ endAdornment: <SearchIcon sx={{ color: '#1976d2' }} /> }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(25, 118, 210, 0.08)', maxWidth: 1100, mx: 'auto', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', borderRadius: 2 }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', width: 40, fontSize: 16, borderTopLeftRadius: 12, textAlign: 'center' }}>#</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', minWidth: 140, fontSize: 16, textAlign: 'left' }}>Tên nhân viên</TableCell>
              {weekDates.map((date, idx) => (
                <TableCell key={idx} align="center" sx={{ color: '#fff', fontWeight: 'bold', minWidth: 90, fontSize: 16, textAlign: 'center', whiteSpace: 'nowrap', p: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: idx === 0 ? '#ff3333' : '#fff', paddingTop: 6 }}>{weekdays[idx]}</div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: '#fff', paddingBottom: 6 }}>{formatDateDM(date)}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4, color: '#888', fontSize: 18 }}>
                  Không tìm thấy nhân viên nào.
                </TableCell>
              </TableRow>
            )}
            {filteredEmployees.map((emp, rowIdx) => (
              <TableRow key={emp.id} sx={{ background: rowIdx % 2 === 0 ? '#f7fafd' : '#e3f2fd', transition: 'background 0.2s' }}>
                <TableCell sx={{ fontWeight: 500, color: '#1976d2', fontSize: 15 }}>{rowIdx + 1}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#222', fontSize: 15, letterSpacing: 0.2 }}>{emp.name}</TableCell>
                {weekDates.map((date, colIdx) => {
                  const userEvents = getUserEventsForDay(events, emp.id, date);
                  return (
                    <TableCell key={colIdx} align="center" sx={{ background: '#0a2342', p: 0, minHeight: 48, border: '1px solid #e3e3e3', position: 'relative', transition: 'background 0.2s', '&:hover': { background: '#163d6b' } }}>
                      {userEvents.map((ev, i) => {
                        const start = new Date(ev.start);
                        const end = new Date(ev.end);
                        const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
                        return (
                          <Tooltip key={i} title={<>
                            <div><b>Loại ca:</b> {ev.jobType}</div>
                            {ev.description && <div><b>Mô tả:</b> {ev.description}</div>}
                          </>} arrow placement="top">
                            <Box sx={{
                              background: getJobTypeColor(ev.jobType),
                              color: '#fff',
                              borderRadius: 1.5,
                              m: 0.5,
                              p: '4px 10px',
                              fontWeight: 600,
                              fontSize: 15,
                              boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                              '&:hover': { filter: 'brightness(1.15)' }
                            }}>
                              {timeStr}
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminScheduleTable; 
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './AdminScheduleTable.module.css';

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
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [positionFilter, setPositionFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [positions, setPositions] = useState([]);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    // Lấy danh sách chức vụ từ employees
    setPositions(Array.from(new Set(employees.map(e => e.position).filter(Boolean))));
    // Lấy địa điểm từ companies
    const companiesData = localStorage.getItem('companies');
    if (companiesData) {
      try {
        const companies = JSON.parse(companiesData);
        setOffices(companies.map(c => c.name));
      } catch {}
    }
  }, [employees]);

  useEffect(() => {
    const data = localStorage.getItem('employees');
    let allEvents = [];
    if (data) {
      const emps = JSON.parse(data);
      setEmployees(emps);
      // Lấy lịch của từng user
      emps.forEach(emp => {
        const evData = localStorage.getItem(`calendarEvents_${emp.id}`);
        if (evData) {
          try {
            const userEvents = JSON.parse(evData);
            if (Array.isArray(userEvents)) {
              allEvents = allEvents.concat(userEvents);
            }
          } catch { }
        }
      });
    } else {
      setEmployees([]);
    }
    setEvents(allEvents);
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name && emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Lịch làm việc nhân viên (theo tuần)</div>
        <div className={styles.headerBar}>
          <div className={styles.headerBarLeft}>
            <IconButton size="small" onClick={() => setCurrentDate(d => { const nd = new Date(d); nd.setDate(d.getDate() - 7); return nd; })} style={{ border: '1px solid #1976d2', color: '#1976d2' }}>{'<'}</IconButton>
            <span className={styles.dateText}>{formatDateDM(weekDates[0])} - {formatDateDM(weekDates[6])}</span>
            <IconButton size="small" onClick={() => setCurrentDate(d => { const nd = new Date(d); nd.setDate(d.getDate() + 7); return nd; })} style={{ border: '1px solid #1976d2', color: '#1976d2' }}>{'>'}</IconButton>
          </div>
          <div className={styles.filterBarRight}>
            <select
              value={positionFilter}
              onChange={e => setPositionFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">-- Lọc chức vụ --</option>
              {positions.map((pos, idx) => (
                <option key={idx} value={pos}>{pos}</option>
              ))}
            </select>
            <select
              value={officeFilter}
              onChange={e => setOfficeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">-- Lọc địa điểm --</option>
              {offices.map((of, idx) => (
                <option key={idx} value={of}>{of}</option>
              ))}
            </select>
            <TextField
              size="small"
              placeholder="Tìm kiếm nhân viên..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
              InputProps={{ endAdornment: <SearchIcon sx={{ color: '#1976d2' }} /> }}
            />
          </div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow className={styles.tableHeaderRow}>
              <TableCell className={`${styles.tableHeaderCell} ${styles.tableHeaderCellBorderRadius}`}>#</TableCell>
              <TableCell className={`${styles.tableHeaderCell} ${styles.tableHeaderCellLeft}`}>Tên nhân viên</TableCell>
              {weekDates.map((date, idx) => (
                <TableCell key={idx} className={`${styles.tableHeaderCell} ${styles.tableHeaderCellMinWidth}`}>
                  <div className={idx === 0 ? `${styles.tableHeaderCellContent} ${styles.tableHeaderCellContentSunday}` : styles.tableHeaderCellContent}>{weekdays[idx]}</div>
                  <div className={styles.tableHeaderCellDate}>{formatDateDM(date)}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" className={styles.noEmployeeCell}>
                  Không tìm thấy nhân viên nào.
                </TableCell>
              </TableRow>
            )}
            {filteredEmployees.map((emp, rowIdx) => (
              <TableRow key={emp.id} className={rowIdx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                <TableCell className={styles.tableCellIndex}>{rowIdx + 1}</TableCell>
                <TableCell className={styles.tableCellName}>{emp.name}</TableCell>
                {weekDates.map((date, colIdx) => {
                  const userEvents = getUserEventsForDay(events, emp.id, date);
                  return (
                    <TableCell key={colIdx} className={styles.tableCell} align="center">
                      {userEvents.map((ev, i) => {
                        const start = new Date(ev.start);
                        const end = new Date(ev.end);
                        const timeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
                        return (
                          <Tooltip
                            key={i}
                            title={<>
                              <div><b></b> {ev.jobType}</div>
                              {ev.description && <div><b>Mô tả:</b> {ev.description}</div>}
                              {ev.location && <div><b>Địa điểm:</b> {ev.location}</div>}
                            </>}
                            arrow
                            placement="top"
                            PopperProps={{
                              modifiers: [
                                {
                                  name: 'customStyle',
                                  enabled: true,
                                  phase: 'afterWrite',
                                  fn: ({ state }) => {
                                    if (state.elements && state.elements.popper) {
                                      state.elements.popper.classList.add(styles.customTooltip);
                                    }
                                  },
                                },
                              ],
                            }}
                          >
                            <div className={styles.eventBox} style={{ background: getJobTypeColor(ev.jobType) }}>
                              {timeStr}
                            </div>
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
      </div>
    </div>
  );
};

export default AdminScheduleTable; 
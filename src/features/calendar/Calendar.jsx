import React, { useState, useEffect, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Menu as MuiMenu } from '@mui/material';
import AlertPopup from '../../components/common/AlertPopup';
import Draggable from 'react-draggable';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const weekdays = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const hours = ["7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h"];

// Hàm tạo ma trận lịch tháng
function getCalendarMatrix(month, year) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);

  let matrix = [];
  let week = [];
  let dayOfWeek = firstDay.getDay();
  // Ngày cuối tháng trước
  for (let i = 0; i < dayOfWeek; i++) {
    week.push({ day: prevLastDay.getDate() - dayOfWeek + i + 1, current: false });
  }
  // Ngày trong tháng
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push({ day: d, current: true });
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  // Ngày đầu tháng sau
  let nextDay = 1;
  while (week.length < 7 && week.length > 0) {
    week.push({ day: nextDay++, current: false });
  }
  if (week.length) matrix.push(week);
  return matrix;
}

// Hàm lấy ngày trong tuần hiện tại, tuần bắt đầu từ Chủ nhật
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
    // Format yyyy-mm-dd local
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
}

// Định nghĩa màu cho từng loại công việc
const jobTypeColors = {
  'Nghỉ': '#008000',
  'Công tác': '#000080',
  'Đang làm việc': '#cddc39',
  'Ra ngoài gặp kh': '#4fc3f7',
  'Làm việc từ xa': '#ffd600',
  'Nghỉ phép có lương': '#ff7043',
};
// Sinh màu ngẫu nhiên nếu chưa có
function getJobTypeColor(name) {
  if (jobTypeColors[name]) return jobTypeColors[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 60%, 60%)`;
}

export default function Calendar() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [isDragging, setIsDragging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalPos, setModalPos] = useState({ x: window.innerWidth / 2 - 180, y: window.innerHeight / 2 - 180 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editStartHour, setEditStartHour] = useState('');
  const [editEndHour, setEditEndHour] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
<<<<<<< HEAD
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuEvent, setMenuEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
=======
>>>>>>> 7148391c86752617ccb3c22e82d2f5a182559d7b
  const [tableReady, setTableReady] = useState(false);

  // Lấy user hiện tại
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const calendarKey = `calendarEvents_${currentUser?.id}`;

  const [events, setEvents] = useState(() => {
    const data = localStorage.getItem(calendarKey);
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    // Khi đổi user, load lại events
    const data = localStorage.getItem(calendarKey);
    setEvents(data ? JSON.parse(data) : []);
    // eslint-disable-next-line
  }, [currentUser?.id]);

  useEffect(() => {
    const data = localStorage.getItem('jobTypes');
    if (data) setJobTypes(JSON.parse(data));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setEditStartHour(selectedEvent.start.slice(11, 16));
      setEditEndHour(selectedEvent.end.slice(11, 16));
    }
  }, [selectedEvent]);

  // Hàm chuyển tháng
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Hàm kiểm tra user đã đăng ký event trong ngày chưa
  const hasEventInDay = (dateStr) => {
    // So sánh yyyy-mm-dd local
    return events.some(ev => {
      const start = new Date(ev.start);
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      const localDate = `${yyyy}-${mm}-${dd}`;
      return localDate === dateStr;
    });
  };

  const handleMouseDown = (e, hourIndex, dayIndex) => {
    const dateStr = weekDates[dayIndex];
    const hour = hours[hourIndex].replace('h', '');
    const event = getEventForCell(dateStr, hour);
    // Nếu đã có event trong ngày này và không phải click vào event thì không cho đăng ký thêm
    if (!event && hasEventInDay(dateStr)) {
      setAlertMessage('Bạn chỉ được đăng ký 1 công việc trong ngày. Muốn chỉnh sửa, hãy xóa lịch cũ trước!');
      setOpenAlert(true);
      return;
    }
    if (event) {
      setSelectedEvent(event);
      setShowForm(true);
    } else {
      setIsDragging(true);
      const cell = { hourIndex, dayIndex };
      setStartCell(cell);
      setEndCell(cell);
      setSelectedCells([cell]);
    }
  };

  const handleMouseMove = (e, hourIndex, dayIndex) => {
    if (isDragging && startCell) {
      // Chỉ cho phép kéo trên cùng 1 cột (1 ngày)
      if (dayIndex !== startCell.dayIndex) return;
      const currentCell = { hourIndex, dayIndex };
      setEndCell(currentCell);
      const startHour = Math.min(startCell.hourIndex, currentCell.hourIndex);
      const endHour = Math.max(startCell.hourIndex, currentCell.hourIndex);
      const d = startCell.dayIndex;
      const cells = [];
      for (let h = startHour; h <= endHour; h++) {
        cells.push({ hourIndex: h, dayIndex: d });
      }
      setSelectedCells(cells);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && startCell && endCell) {
      setIsDragging(false);
      setShowForm(true);
    }
  };

  const handleDelete = (event) => {
    const updatedEvents = events.filter(ev => ev.id !== event.id);
    setEvents(updatedEvents);
    localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
    setShowForm(false);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let start, end;
    const description = formData.get('description');
    const jobType = formData.get('jobType');

    if (selectedEvent) {
      // Chỉnh sửa: chỉ thay đổi giờ nếu input khác giờ gốc
      const oldStart = new Date(selectedEvent.start);
      const oldEnd = new Date(selectedEvent.end);
      const startHour = formData.get('startHour');
      const endHour = formData.get('endHour');
      if (startHour && startHour !== editStartHour) {
        const [h, m] = startHour.split(':');
        oldStart.setHours(Number(h), Number(m), 0, 0);
      }
      if (endHour && endHour !== editEndHour) {
        const [h, m] = endHour.split(':');
        oldEnd.setHours(Number(h), Number(m), 0, 0);
      }
      start = oldStart.toISOString().slice(0, 16);
      end = oldEnd.toISOString().slice(0, 16);
      const updatedEvent = {
        ...selectedEvent,
        start,
        end,
        description,
        jobType
      };
      const updatedEvents = events.map(ev =>
        ev.id === selectedEvent.id ? updatedEvent : ev
      );
      setEvents(updatedEvents);
      localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
    } else {
      // Thêm lịch mới
      start = formData.get('start');
      end = formData.get('end');
      const newEvent = {
        id: Date.now(),
        userId: String(currentUser?.id),
        jobType,
        start,
        end,
        description,
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
    }
    setShowForm(false);
    setSelectedEvent(null);
    setStartCell(null);
    setEndCell(null);
    setSelectedCells([]);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditMode(false);
    setSelectedEvent(null);
    setStartCell(null);
    setEndCell(null);
    setSelectedCells([]);
  };

  const isCellSelected = (hourIndex, dayIndex) => {
    if (!showForm && !isDragging) return false; // KHÔNG highlight nếu không show form và không kéo
    if (!startCell || !endCell) return false;
    if (startCell.dayIndex !== dayIndex) return false;
    const minHour = Math.min(startCell.hourIndex, endCell.hourIndex);
    const maxHour = Math.max(startCell.hourIndex, endCell.hourIndex);
    return hourIndex >= minHour && hourIndex <= maxHour;
  };

  const getSelectedTimeRange = () => {
    if (!startCell || !endCell) return { start: '', end: '' };
    const startHour = Math.min(startCell.hourIndex, endCell.hourIndex);
    const endHour = Math.max(startCell.hourIndex, endCell.hourIndex);
    const startDay = Math.min(startCell.dayIndex, endCell.dayIndex);
    const endDay = Math.max(startCell.dayIndex, endCell.dayIndex);
    const startDate = new Date(weekDates[startDay]);
    const endDate = new Date(weekDates[endDay]);
    startDate.setHours(parseInt(hours[startHour]) + 7);
    endDate.setHours(parseInt(hours[endHour]) + 7);// Cộng thêm 1h nếu sài UTC :(
    // Nếu là ô cuối cùng (21h), cộng thêm 1 giờ cho endDate
    if (endHour === hours.length - 1) {
      endDate.setHours(endDate.getHours() + 1);
    }
    return {
      start: startDate.toISOString().slice(0, 16),
      end: endDate.toISOString().slice(0, 16)
    };
  };

  // Khi render calendar, chỉ lấy event phù hợp
  const filteredEvents = events.filter(ev => String(ev.userId) === String(currentUser?.id));

  // Đặt lại hàm getEventForCell đúng vị trí
  const getEventForCell = (date, hour) => {
    return filteredEvents.find(ev => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      const cellDate = new Date(date);
      cellDate.setHours(parseInt(hour), 0, 0, 0);
      // So sánh chính xác cả ô giờ kết thúc
      return cellDate >= start && cellDate <= end;
    });
  };

  // Hàm bắt đầu kéo
  const handleDragStart = (e) => {
    setDragging(true);
    const rect = e.target.closest('.draggable-modal').getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  // Hàm kéo
  const handleDrag = (e) => {
    if (!dragging) return;
    setModalPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };
  // Hàm dừng kéo
  const handleDragEnd = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragging]);

  const calendarMatrix = getCalendarMatrix(month, year);
  const weekDates = getWeekDates(selectedDate);

  const tableRef = useRef(null);
  const dayRefs = useRef([]);
  const [cellW, setCellW] = useState(100);

  useEffect(() => {
    if (tableRef.current) {
      const cols = tableRef.current.querySelectorAll('thead th');
      if (cols.length > 1) {
        setCellW(cols[1].offsetWidth);
        setTableReady(true);
      }
    }
  }, [month, year, hours, weekdays]);

  const table = tableRef.current;
  let cellH = 40; // Giá trị mặc định
  if (table) {
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length > 0) cellH = rows[0].offsetHeight;
  }

  // Thêm các hàm xử lý menu thẻ xanh
  const handleMenuOpen = (event, e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setMenuEvent(event);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEvent(null);
  };
  const handleViewEvent = () => {
    setSelectedEvent(menuEvent);
    setShowForm(true);
    setEditMode(false);
    handleMenuClose();
  };
  const handleDeleteEvent = () => {
    handleDelete(menuEvent);
    handleMenuClose();
  };

  // Tạo mảng giờ cho select
  const hourOptions = Array.from({ length: 22 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  useEffect(() => {
    // Khi table và dayRefs đã render xong
    if (dayRefs.current.every(ref => ref && ref.offsetLeft !== undefined)) {
      setTableReady(true);
    }
  }, [weekDates]);

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 52px)',
      background: '#fff',
      display: 'flex',
      boxSizing: 'border-box'
    }}>
      {/* Cột trái: Lịch tháng */}
      <div style={{
        width: 300,
        minWidth: 220,
        background: '#f4f4f4',
        borderRight: '1px solid #e0e0e0',
        boxSizing: 'border-box',
      }}>
        <div style={{ background: "#fff", padding: 10, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: "bold", fontSize: 18 }}>
              Tháng {month + 1} năm {year}
            </span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                {weekdays.map((d, i) => (
                  <th
                    key={i}
                    style={{
                      color: i === 0 ? "#ff3333" : "#333",
                      fontWeight: "bold",
                      padding: 4,
                      textAlign: "center"
                    }}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendarMatrix.map((week, i) => (
                <tr key={i}>
                  {week.map((cell, j) => {
                    const isCurrentMonth = cell.current;
                    const isToday =
                      isCurrentMonth &&
                      cell.day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();
                    const isSelected =
                      isCurrentMonth &&
                      cell.day === selectedDate.getDate() &&
                      month === selectedDate.getMonth() &&
                      year === selectedDate.getFullYear();

                    return (
                      <td
                        key={j}
                        onClick={() => {
                          if (isCurrentMonth) setSelectedDate(new Date(year, month, cell.day));
                        }}
                        style={{
                          padding: 0,
                          color: !isCurrentMonth ? "#bbb" : j === 0 ? "#ff3333" : isToday ? "#fff" : "#222",
                          border: "1px solid #ccc",
                          background: isToday
                            ? "#ffb300"
                            : isSelected
                              ? "#90caf9"
                              : "#fff",
                          width: "14.28%",
                          height: 40,
                          textAlign: "center",
                          verticalAlign: "middle"
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            lineHeight: "32px",
                            margin: "0 auto",
                            borderRadius: isToday ? "50%" : "0",
                            background: isToday ? "#ffb300" : "transparent",
                            color: isToday ? "#fff" : undefined,
                            fontWeight: isToday ? "bold" : undefined
                          }}
                        >
                          {cell.day}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
            <button
              onClick={prevMonth}
              style={{ minWidth: 100, height: 36, border: "1px solid #888", background: "#f4f4f4", color: "#222", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
            >
              Tháng trước
            </button>
            <button
              onClick={nextMonth}
              style={{ minWidth: 100, height: 36, border: "1px solid #888", background: "#f4f4f4", color: "#222", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
            >
              Tháng sau
            </button>
          </div>
        </div>
      </div>
      {/* Cột phải: Lịch tuần */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: 'auto',
        minWidth: 'auto',
        margin: '0 auto',
        padding: '16px 0'
      }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: "bold", fontSize: 20 }}>Tháng {month + 1} </span>
        </div>
        {/* Lịch tuần */}
        <div style={{ position: 'relative', width: '100%', height: (hours.length + 1) * cellH }}>
          <table
            ref={tableRef}
            className="calendar-week-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              height: 900,
              position: 'relative',
              zIndex: 1
            }}
            onMouseLeave={() => setIsDragging(false)}
          >
            <thead>
              <tr>
<<<<<<< HEAD
                <th style={{ width: `${100 / (weekdays.length + 1)}%`, minWidth: 80, maxWidth: 120, height: 48, background: "#f4f4f4", textAlign: 'center', fontWeight: 700, fontSize: 16, border: '1px solid #ccc', boxSizing: 'border-box' }}></th>
=======
                <th style={{ width: cellW, background: "#f4f4f4" }}></th>
>>>>>>> 7148391c86752617ccb3c22e82d2f5a182559d7b
                {weekdays.map((thu, i) => {
                  const dateObj = new Date(weekDates[i]);
                  return (
                    <th
                      key={i}
                      ref={el => dayRefs.current[i] = el}
                      style={{
                        width: `${100 / (weekdays.length + 1)}%`,
                        minWidth: 80,
                        maxWidth: 120,
                        height: 54,
                        background: "#f4f4f4",
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 16,
                        border: '1px solid #ccc',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{thu}</div>
                      <div style={{ fontSize: 13, color: "#888" }}>
                        {dateObj.getDate().toString().padStart(2, "0")}/{(dateObj.getMonth() + 1).toString().padStart(2, "0")}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody style={{ height: "100%" }}>
              {hours.map((hour, hourIndex) => (
                <tr key={hourIndex}>
<<<<<<< HEAD
                  <td style={{ width: `${100 / (weekdays.length + 1)}%`, minWidth: 80, maxWidth: 120, height: 40, background: "#f4f4f4", fontWeight: "bold", textAlign: 'center', fontSize: 15, padding: 0, border: '1px solid #ccc', boxSizing: 'border-box' }}>{hour}</td>
=======
                  <td style={{ border: "1px solid #ccc", background: "#f4f4f4", fontWeight: "bold", height: 40, padding: 0, width: cellW }}>{hour}</td>
>>>>>>> 7148391c86752617ccb3c22e82d2f5a182559d7b
                  {weekdays.map((thu, dayIndex) => (
                    <td
                      key={dayIndex}
                      style={{
                        width: `${100 / (weekdays.length + 1)}%`,
                        minWidth: 80,
                        maxWidth: 120,
                        height: 40,
                        padding: 0,
                        border: "1px solid #ccc",
                        background: isCellSelected(hourIndex, dayIndex) ? "#e3f2fd" : hasEventInDay(weekDates[dayIndex]) ? "#f5f5f5" : "#fff",
                        cursor: "pointer",
                        userSelect: "none",
                        position: "relative",
                        transition: "background-color 0.2s",
                        boxSizing: 'border-box'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, hourIndex, dayIndex)}
                      onMouseMove={(e) => handleMouseMove(e, hourIndex, dayIndex)}
                      onMouseUp={handleMouseUp}
                    >
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Overlay event blocks */}
<<<<<<< HEAD
          {tableReady && filteredEvents.map((event, idx) => {
=======
          {tableReady && cellW > 80 && filteredEvents.map((event, idx) => {
>>>>>>> 7148391c86752617ccb3c22e82d2f5a182559d7b
            // Tính toán vị trí block
            const start = new Date(event.start);
            const end = new Date(event.end);
            // Debug log
            console.log('event.start:', event.start, 'start.getHours():', start.getHours(), 'startHourIdx:', hours.findIndex(h => parseInt(h) === start.getHours()), 'hours:', hours);
            // Tìm cột (ngày) bắt đầu/kết thúc
            const startDayIdx = weekDates.findIndex(d => d === start.toISOString().slice(0, 10));
            const endDayIdx = weekDates.findIndex(d => d === end.toISOString().slice(0, 10));
            if (startDayIdx === -1 || endDayIdx === -1) return null;
            // Tìm hàng (giờ) bắt đầu/kết thúc
            const startHourIdx = hours.findIndex(h => parseInt(h) === start.getHours());
            let endHourIdx = hours.findIndex(h => parseInt(h) === end.getHours());
            if (endHourIdx === -1) endHourIdx = hours.length - 1;
            // Lấy kích thước cell
            const table = tableRef.current;
            let cellW = 100, cellH = 40;
            if (table) {
              const cols = table.querySelectorAll('thead th');
              if (cols.length > 1) cellW = cols[1].offsetWidth;
              const rows = table.querySelectorAll('tbody tr');
              if (rows.length > 0) cellH = rows[0].offsetHeight;
            }
            // Tính toán style (cột 0 là giờ, nên phải +1)
            const left = cellW * (startDayIdx + 1);
            const width = cellW;
            const top = startHourIdx * cellH;
            const height = (endHourIdx - startHourIdx + 1) * cellH;

            // Hàm xử lý khi thả block
            const handleStop = (e, data) => {
<<<<<<< HEAD
              // Tính toán lại vị trí mới
              const newDayIdx = Math.max(0, Math.min(weekdays.length - 1, Math.round(data.x / cellW) - 1));
              const newHourIdx = Math.max(0, Math.min(hours.length - 1, Math.round(data.y / cellH) - 1));
              if (newDayIdx < 0 || newDayIdx > 6 || newHourIdx < 0 || newHourIdx > hours.length - 1) return;
              // Tạo thời gian mới
              const newDate = new Date(weekDates[newDayIdx]);
              newDate.setHours(parseInt(hours[newHourIdx]), 0, 0, 0);
              const duration = end - start;
              const newStart = newDate;
              const newEnd = new Date(newStart.getTime() + duration);
              // Kiểm tra ngày đã có event khác chưa
              const newDateStr = weekDates[newDayIdx];
              const hasOtherEvent = events.some(ev => {
                if (ev.id === event.id) return false;
                const evStart = new Date(ev.start);
                const yyyy = evStart.getFullYear();
                const mm = String(evStart.getMonth() + 1).padStart(2, '0');
                const dd = String(evStart.getDate()).padStart(2, '0');
                const localDate = `${yyyy}-${mm}-${dd}`;
                return localDate === newDateStr;
              });
              if (hasOtherEvent) {
                setAlertMessage('Ngày này đã có lịch đăng ký!');
                setOpenAlert(true);
                return;
              }
=======
              // Tính toán lại vị trí mới (chỉ đổi ngày, giữ nguyên giờ)
              const newDayIdx = Math.round(data.x / cellW) - 1; // -1 vì cột 0 là giờ
              if (newDayIdx < 0 || newDayIdx > weekdays.length - 1) return;
              // Giữ nguyên giờ bắt đầu/kết thúc
              const oldStart = new Date(event.start);
              const oldEnd = new Date(event.end);
              const newStart = new Date(weekDates[newDayIdx]);
              newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);
              const newEnd = new Date(weekDates[newDayIdx]);
              newEnd.setHours(oldEnd.getHours(), oldEnd.getMinutes(), 0, 0);
>>>>>>> 7148391c86752617ccb3c22e82d2f5a182559d7b
              // Cập nhật event
              const updatedEvent = { ...event, start: newStart.toISOString(), end: newEnd.toISOString() };
              const updatedEvents = filteredEvents.map(ev => ev.id === event.id ? updatedEvent : ev);
              setEvents(updatedEvents);
              localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
            };

            const numDays = weekdays.length;

            return (
              <Draggable
                key={event.id}
                axis="x"
                grid={[cellW, cellH]}
                bounds={{
                  left: dayRefs.current[0]?.offsetLeft || 0,
                  top: cellH,
                  right: (dayRefs.current[weekdays.length - 1]?.offsetLeft || 0) + (dayRefs.current[weekdays.length - 1]?.offsetWidth || 0) - width,
                  bottom: (hours.length) * cellH - height + cellH
                }}
<<<<<<< HEAD
                position={{ x: left, y: top }}
                onStop={handleStop}
=======
                position={null}
                onStop={handleStop}
                bounds={{ left: cellW, right: cellW * numDays }}
>>>>>>> 7148391c86752617ccb3c22e82d2f5a182559d7b
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width,
                    height,
                    background: getJobTypeColor(event.jobType) || '#6b8e23',
                    color: '#fff',
                    borderRadius: 8,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    opacity: 0.98,
                    padding: '8px 12px',
                    border: 'none',
                    overflow: 'hidden',
                    minHeight: 36
                  }}
                  title={`${event.jobType}\n${event.start.replace('T', ' ')} - ${event.end.replace('T', ' ')}\n${event.description || ''}`}
                >
                  {/* Dấu 3 chấm menu */}
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 2, right: 2, color: 'white', zIndex: 11, background: 'rgba(0,0,0,0.08)' }}
                    onClick={e => handleMenuOpen(event, e)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{event.jobType}</div>
                  <div style={{ fontWeight: 400, fontSize: 14, marginBottom: 2 }}>
                    {`${new Date(event.start).getHours().toString().padStart(2, '0')}:${new Date(event.start).getMinutes().toString().padStart(2, '0')}`}
                    {' - '}
                    {`${new Date(event.end).getHours().toString().padStart(2, '0')}:${new Date(event.end).getMinutes().toString().padStart(2, '0')}`}
                  </div>
                  {event.description && <div style={{ fontWeight: 400, fontSize: 13 }}>{event.description}</div>}
                </div>
              </Draggable>
            );
          })}
        </div>

        {/* Form đăng ký/chỉnh sửa */}
        {showForm && (
          <div
            className="draggable-modal"
            style={{
              position: 'fixed',
              top: modalPos.y,
              left: modalPos.x,
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '300px',
              cursor: dragging ? 'move' : 'default',
              userSelect: 'none',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', cursor: 'move' }}
              onMouseDown={handleDragStart}
            >
              <h3 style={{ margin: 0 }}>{selectedEvent ? (editMode ? 'Sửa lịch' : 'Chi tiết lịch') : 'Đăng ký lịch'}</h3>
              <button
                onClick={handleFormClose}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '0 5px'
                }}
              >
                ×
              </button>
            </div>
            {selectedEvent ? (
              editMode ? (
                // Form sửa lịch
                <form onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  // Lấy giờ mới
                  const startTime = formData.get('start'); // dạng HH:00
                  const endTime = formData.get('end');
                  // Lấy ngày cũ
                  const oldStart = new Date(selectedEvent.start);
                  const oldEnd = new Date(selectedEvent.end);
                  // Gán giờ mới vào ngày cũ
                  const [sh] = startTime.split(':');
                  const [eh] = endTime.split(':');
                  oldStart.setHours(Number(sh), 0, 0, 0);
                  oldEnd.setHours(Number(eh), 0, 0, 0);
                  // Lưu lại event
                  const updatedEvent = {
                    ...selectedEvent,
                    start: oldStart.toISOString(),
                    end: oldEnd.toISOString(),
                    description: formData.get('description'),
                    jobType: formData.get('jobType')
                  };
                  const updatedEvents = events.map(ev => ev.id === selectedEvent.id ? updatedEvent : ev);
                  setEvents(updatedEvents);
                  localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
                  setEditMode(false);
                  setShowForm(false);
                  setSelectedEvent(null);
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Thời gian bắt đầu</label>
                    <select
                      name="start"
                      defaultValue={new Date(selectedEvent.start).getHours().toString().padStart(2, '0') + ':00'}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: 16 }}
                      required
                    >
                      {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Thời gian kết thúc</label>
                    <select
                      name="end"
                      defaultValue={new Date(selectedEvent.end).getHours().toString().padStart(2, '0') + ':00'}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: 16 }}
                      required
                    >
                      {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Mô tả</label>
                    <textarea
                      name="description"
                      defaultValue={selectedEvent.description || ''}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
                    />
                  </div>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="jobtype-label">Loại công việc</InputLabel>
                    <Select
                      labelId="jobtype-label"
                      name="jobType"
                      value={selectedEvent.jobType}
                      label="Loại công việc"
                      onChange={e => setSelectedEvent({ ...selectedEvent, jobType: e.target.value })}
                    >
                      {jobTypes.map((type) => (
                        <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      style={{ flex: 1, background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              ) : (
                // Form xem chi tiết lịch
                <>
                  <form>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Thời gian bắt đầu</label>
                      <input
                        type="text"
                        value={new Date(selectedEvent.start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        readOnly
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5' }}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Thời gian kết thúc</label>
                      <input
                        type="text"
                        value={new Date(selectedEvent.end).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        readOnly
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5' }}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Mô tả</label>
                      <textarea
                        value={selectedEvent.description || ''}
                        readOnly
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px', background: '#f5f5f5' }}
                      />
                    </div>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="jobtype-label">Loại công việc</InputLabel>
                      <Select
                        labelId="jobtype-label"
                        value={selectedEvent.jobType}
                        label="Loại công việc"
                        readOnly
                        disabled
                      >
                        <MenuItem value={selectedEvent.jobType}>{selectedEvent.jobType}</MenuItem>
                      </Select>
                    </FormControl>
                  </form>
                  <div style={{ display: 'flex', gap: '10px', marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      style={{ flex: 1, background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Sửa
                    </button>
                  </div>
                </>
              )
            ) : (
              // Form cho event mới (đăng ký lịch)
              <form onSubmit={handleUpdateEvent}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Thời gian bắt đầu</label>
                  <input
                    name="start"
                    type="datetime-local"
                    defaultValue={getSelectedTimeRange().start}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Thời gian kết thúc</label>
                  <input
                    name="end"
                    type="datetime-local"
                    defaultValue={getSelectedTimeRange().end}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Mô tả</label>
                  <textarea
                    name="description"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
                  />
                </div>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="jobtype-label">Loại công việc</InputLabel>
                  <Select
                    labelId="jobtype-label"
                    name="jobType"
                    value={selectedJobType}
                    label="Loại công việc"
                    onChange={e => setSelectedJobType(e.target.value)}
                    required
                  >
                    {jobTypes.map((type) => (
                      <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{ flex: 1, background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
      <AlertPopup open={openAlert} message={alertMessage} type="error" onClose={() => setOpenAlert(false)} />
      {/* Menu 3 chấm */}
      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewEvent}>Chi tiết lịch</MenuItem>
        <MenuItem onClick={handleDeleteEvent}>Xóa lịch</MenuItem>
      </MuiMenu>
    </div>
  );
}

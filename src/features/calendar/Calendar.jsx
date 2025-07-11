import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Menu as MuiMenu } from '@mui/material';
import AlertPopup from '../../components/common/AlertPopup';
import Draggable from 'react-draggable';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import companies from '../../pages/admin/CompanyManagement';
import jobTypes from '../../pages/admin/JobTypeManagement';

const weekdays = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);

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

// Định nghĩa màu cho từng loại công việc (cứng)
const jobTypeColors = {
  'Công tác': '#000080',
  'Ra ngoài gặp khách hàng': '#3a7d82',
  'Làm việc từ xa / tại nhà': '#823f3a',
  'Nghỉ phép có lương': '#525252',
};

// Hàm lấy yyyy-mm-dd local
const getLocalDateString = (date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

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
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editStartHour, setEditStartHour] = useState('');
  const [editEndHour, setEditEndHour] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuEvent, setMenuEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tableReady, setTableReady] = useState(false);
  const offices = companies.map(c => c.name);

  // [API POINT] Lấy user hiện tại (có thể lấy từ API)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const calendarKey = `calendarEvents_${currentUser?.id}`;

  // [API POINT] Lấy danh sách events từ API
  const [events, setEvents] = useState(() => {
    const data = localStorage.getItem(calendarKey);
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    // [API POINT] Khi đổi user, có thể gọi API lấy events mới
    const data = localStorage.getItem(calendarKey);
    setEvents(data ? JSON.parse(data) : []);
    // eslint-disable-next-line
  }, [currentUser?.id]);

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

  // [UPDATED] Hàm kiểm tra user đã đăng ký event trong ngày chưa
  const hasEventInDay = (dateStr) => {
    // Chỉ trả về true nếu đã có event có ngày bắt đầu đúng bằng dateStr
    return events.some(ev => {
      const start = new Date(ev.start);
      const eventDateStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
      return eventDateStr === dateStr;
    });
  };

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const handleMouseDown = (e, hourIndex, dayIndex) => {
    const dateStr = weekDates[dayIndex];
    const hour = hours[hourIndex].replace('h', '');
    const event = getEventForCell(dateStr, hour);
    // Chặn đăng ký lịch cho ngày đã qua
    const cellDate = new Date(dateStr);
    cellDate.setHours(0, 0, 0, 0);
    if (cellDate < todayDate) {
      setAlertMessage('không thể đăng ký trong ngày đã qua!');
      setOpenAlert(true);
      return;
    }
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

  const handleMouseUp = (e) => {
    if (isDragging && startCell && endCell) {
      setIsDragging(false);
      setShowForm(true);
    }
  };

  const handleDelete = (event) => {
    // [API POINT] Gọi API xóa event
    const updatedEvents = events.filter(ev => ev.id !== event.id);
    setEvents(updatedEvents);
    localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
    setShowForm(false);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const description = formData.get('description');
    const jobType = formData.get('jobType');

    if (selectedEvent) {
      // [API POINT] Gọi API cập nhật event
      const oldStart = new Date(selectedEvent.start);
      const oldEnd = new Date(selectedEvent.end);
      const startHour = formData.get('start');
      const endHour = formData.get('end');

      const [startH, startM] = startHour.split(':');
      oldStart.setHours(Number(startH), Number(startM), 0, 0);

      const [endH, endM] = endHour.split(':');
      oldEnd.setHours(Number(endH), Number(endM), 0, 0);
      
      const updatedEvent = {
        ...selectedEvent,
        start: oldStart.toISOString(),
        end: oldEnd.toISOString(),
        description,
        jobType,
        location: formData.get('location') || '',
      };
      const updatedEvents = events.map(ev =>
        ev.id === selectedEvent.id ? updatedEvent : ev
      );
      setEvents(updatedEvents);
      localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
    } else {
      // [API POINT] Gọi API tạo event mới
      // Kiểm tra an toàn
      if (!startCell || !weekDates || typeof startCell.dayIndex !== 'number' || !weekDates[startCell.dayIndex]) {
        setAlertMessage('Không xác định được ngày đăng ký. Vui lòng chọn lại trên lịch!');
        setOpenAlert(true);
        return;
      }
      let dayIdx = startCell && endCell ? Math.min(startCell.dayIndex, endCell.dayIndex) : 0;
      let date = new Date(weekDates[dayIdx]);
      // [UPDATED] Đảm bảo ngày local, không bị lệch UTC
      const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      // [UPDATED] Lấy giờ thực tế từ dropdown
      let startHourValue = parseInt(formData.get('start').split(':')[0], 10);
      let endHourValue = parseInt(formData.get('end').split(':')[0], 10);
      startDate.setHours(startHourValue, 0, 0, 0);
      endDate.setHours(endHourValue, 0, 0, 0);
      const newEvent = {
        id: Date.now(),
        userId: String(currentUser?.id),
        jobType,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        description,
        location: formData.get('location') || '',
        title: jobType,
      };

      // [UPDATED] Kiểm tra xem đã có event nào trong ngày chưa
      if (hasEventInDay(getLocalDateString(startDate))) {
        setAlertMessage('Chỉ được đăng ký 1 công việc trong ngày!');
        setOpenAlert(true);
        return;
      }
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
    }
    setShowForm(false);
    setSelectedCells([]);
    setStartCell(null);
    setEndCell(null);
    setSelectedEvent(null);
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
    const endDate = new Date(weekDates[startDay]); // Luôn lấy ngày bắt đầu
    startDate.setHours(parseInt(hours[startHour]) + 7, 0, 0, 0);
    // Nếu kéo đến ô cuối cùng (21h), endDate là 22:00 cùng ngày
    if (endHour === hours.length - 1) {
      endDate.setHours(parseInt(hours[endHour]) + 7, 0, 0, 0); // 21+1=22
    } else {
      endDate.setHours(parseInt(hours[endHour]) + 7 , 0, 0, 0); // Giờ tiếp theo
    }
    return {
      start: startDate.toISOString().slice(0, 16),
      end: endDate.toISOString().slice(0, 16)
    };
  };

  // Khi render calendar, chỉ lấy event phù hợp
  const filteredEvents = events.filter(ev => {
    if (String(ev.userId) !== String(currentUser?.id)) return false;
    const start = new Date(ev.start);
    return start.getMonth() === month && start.getFullYear() === year;
  });

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

  const calendarMatrix = getCalendarMatrix(month, year);
  const weekDates = getWeekDates(selectedDate);

  const tableRef = useRef(null);
  const dayRefs = useRef([]);

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

  // Mảng hourOptions từ 00:00 đến 21:00
  const hourOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // Tính toán danh sách giờ kết thúc hợp lệ
  let endHourOptions = hourOptions;
  if (startCell && endCell) {
    const startHour = Math.min(startCell.hourIndex, endCell.hourIndex);
    const endHour = Math.max(startCell.hourIndex, endCell.hourIndex);
    endHourOptions = hourOptions.slice(startHour + 1, endHour + 2); // Cho phép chọn nhiều giờ liên tiếp
  }

  // Khi submit form, mapping index từ dropdown sang hours phải đúng
  const getHourIndexFromDropdown = (val) => hourOptions.findIndex(h => h === val);

  useLayoutEffect(() => {
    if (dayRefs.current.every(ref => ref && ref.offsetLeft !== undefined)) {
      setTableReady(true);
    } else {
      setTableReady(false);
    }
  }, [weekDates, events]);

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 52px)', // 52px là chiều cao của header
      background: '#fff',
      display: 'flex',
      boxSizing: 'border-box',
      position: 'fixed',
      top: '52px',
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }}>
      {/* Cột trái: Lịch tháng */}
      <div style={{
        width: 300,
        minWidth: 220,
        height: '100%',
        background: '#f4f4f4',
        borderRight: '1px solid #e0e0e0',
        boxSizing: 'border-box',
        overflowY: 'auto'
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
          {/* Legend màu sắc các loại công việc */}
          <div style={{ marginTop: 24, padding: 12, background: '#f9f9f9', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Chú thích màu công việc:</div>
            {Object.entries(jobTypeColors).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: 6, background: color, marginRight: 10, border: '1px solid #bbb' }}></span>
                <span style={{ fontSize: 14 }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Cột phải: Lịch tuần */}
      <div style={{
        flex: 1,
        height: '100%',
        overflow: 'auto',
        background: '#fff',
        borderRadius: 0,
        boxShadow: 'none',
        maxWidth: 'none',
        minWidth: 0,
        margin: 0,
        padding: '16px 24px'
      }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10, justifyContent: 'space-between' }}>
          <span style={{ fontWeight: "bold", fontSize: 20 }}></span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setSelectedDate(prev => {
                const d = new Date(prev);
                d.setDate(d.getDate() - 7);
                return d;
              })}
              style={{ minWidth: 100, height: 36, border: "1px solid #888", background: "#f4f4f4", color: "#222", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
            >
              Tuần trước
            </button>
            <button
              onClick={() => setSelectedDate(prev => {
                const d = new Date(prev);
                d.setDate(d.getDate() + 7);
                return d;
              })}
              style={{ minWidth: 100, height: 36, border: "1px solid #888", background: "#f4f4f4", color: "#222", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
            >
              Tuần sau
            </button>
          </div>
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
                <th style={{ width: `${100 / (weekdays.length + 1)}%`, minWidth: 80, maxWidth: 120, height: 48, background: "#f4f4f4", textAlign: 'center', fontWeight: 700, fontSize: 16, border: '1px solid #ccc', boxSizing: 'border-box', color: '#fff', background: '#1874CD' }}></th>
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
                        background: "#1874CD",
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 16,
                        border: '1px solid #ccc',
                        boxSizing: 'border-box',
                        color: '#fff'
                      }}
                    >
                      <div style={{ fontWeight: "bold", color: '#fff' }}>{thu}</div>
                      <div style={{ fontSize: 13, color: "#fff" }}>
                        {dateObj.getDate().toString().padStart(2, "0")}/{(dateObj.getMonth() + 1).toString().padStart(2, "0")}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody id="calendar-grid-body">
              {hours.map((hour, hourIndex) => (
                <tr key={hour}>
                  <td style={{ width: `${100 / (weekdays.length + 1)}%`, minWidth: 80, maxWidth: 120, height: 40, background: "#1874CD", fontWeight: "bold", textAlign: 'center', fontSize: 15, padding: 0, border: '1px solid #ccc', boxSizing: 'border-box', color: '#fff' }}>{hour}</td>
                  {weekdays.map((thu, dayIndex) => (
                    <td
                      key={dayIndex}
                      id={`cell-${dayIndex}-${hourIndex}`}
                      style={{
                        width: `${100 / (weekdays.length + 1)}%`,
                        minWidth: 80,
                        maxWidth: 120,
                        height: 54,
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
          {tableReady && filteredEvents.filter(event => {
            // Kiểm tra tính hợp lệ của start/end
            const start = new Date(event.start);
            const end = new Date(event.end);
            return !isNaN(start.getTime()) && !isNaN(end.getTime());
          }).map((event, idx) => {
            // Tính toán vị trí block
            const start = new Date(event.start);
            const end = new Date(event.end);
            // Tìm cột (ngày) bắt đầu/kết thúc
            const startDayIdx = weekDates.findIndex(d => {
              const dObj = typeof d === 'string' ? new Date(d) : d;
              return dObj.getFullYear() === start.getFullYear() && dObj.getMonth() === start.getMonth() && dObj.getDate() === start.getDate();
            });
            const endDayIdx = weekDates.findIndex(d => {
              const dObj = typeof d === 'string' ? new Date(d) : d;
              return dObj.getFullYear() === end.getFullYear() && dObj.getMonth() === end.getMonth() && dObj.getDate() === end.getDate();
            });
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
            const left = dayRefs.current[startDayIdx]?.offsetLeft || 0;
            const right = (dayRefs.current[endDayIdx]?.offsetLeft || 0) + (dayRefs.current[endDayIdx]?.offsetWidth || 0);
            const width = right - left;
            const top = (startHourIdx + 1) * cellH;
            const height = (endHourIdx - startHourIdx + 1) * cellH;

            // Hàm xử lý khi thả block
            const handleStop = (e, data) => {
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
              setIsDragging(false);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (new Date(newDateStr) < today) {
                setAlertMessage('Không thể di chuyển sự kiện vào quá khứ.');
                setOpenAlert(true);
                // Đặt lại vị trí của event về vị trí cũ trên UI
                // (Thao tác này phức tạp, cách đơn giản hơn là không cập nhật state
                // và để component tự render lại ở vị trí cũ)
                return; // Không làm gì cả
              }

              // Cập nhật lại event trong state và localStorage
              const updatedEvent = { ...event, start: newStart.toISOString(), end: newEnd.toISOString() };
              const updatedEvents = filteredEvents.map(ev => ev.id === event.id ? updatedEvent : ev);
              setEvents(updatedEvents);
              localStorage.setItem(calendarKey, JSON.stringify(updatedEvents));
            };

            return (
              <Draggable
                key={event.id}
                axis="both"
                grid={[cellW, cellH]}
                bounds={{
                  left: dayRefs.current[0]?.offsetLeft || 0,
                  top: cellH,
                  right: (dayRefs.current[weekdays.length - 1]?.offsetLeft || 0) + (dayRefs.current[weekdays.length - 1]?.offsetWidth || 0) - width,
                  bottom: (hours.length) * cellH - height + cellH
                }}
                position={{ x: left, y: top }}
                onStop={handleStop}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width,
                    height,
                    background: jobTypeColors[event.jobType] || '#6b8e23',
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
                  {event.location && (
                    <div style={{ fontWeight: 400, fontSize: 13, fontStyle: 'italic' }}>{event.location}</div>
                  )}
                </div>
              </Draggable>
            );
          })}
        </div>

        {/* Form đăng ký/chỉnh sửa */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div
              className="modal-content"
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                width: '90%',
                maxWidth: '450px',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}
              >
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedEvent ? (editMode ? 'Sửa lịch' : 'Chi tiết lịch') : 'Đăng ký lịch'}</h3>
                <button
                  onClick={handleFormClose}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '0',
                    lineHeight: '1',
                    color: '#888'
                  }}
                >
                  ×
                </button>
              </div>
              {selectedEvent ? (
                editMode ? (
                  // Form sửa lịch
                  <form onSubmit={handleUpdateEvent}>
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
                        {endHourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Địa điểm</label>
                      <FormControl fullWidth>
                        <InputLabel id="office-edit-label">Chọn địa điểm</InputLabel>
                        <Select
                          labelId="office-edit-label"
                          name="location"
                          defaultValue={selectedEvent.location || ''}
                          label="Chọn địa điểm"
                          required
                        >
                          <MenuItem value="">-- Chọn địa điểm --</MenuItem>
                          {offices.map((of, idx) => (
                            <MenuItem key={idx} value={of}>{of}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                          value={new Date(selectedEvent.start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          readOnly
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5' }}
                        />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Thời gian kết thúc</label>
                        <input
                          type="text"
                          value={new Date(selectedEvent.end).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          readOnly
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5' }}
                        />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Địa điểm</label>
                        <input
                          type="text"
                          value={selectedEvent.location || ''}
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
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Loại công việc</label>
                        <input
                          type="text"
                          value={selectedEvent.jobType}
                          readOnly
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5' }}
                        />
                      </div>
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
                    <select
                      name="start"
                      defaultValue={getSelectedTimeRange().start ? new Date(getSelectedTimeRange().start).getHours().toString().padStart(2, '0') + ':00' : '07:00'}
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
                      defaultValue={getSelectedTimeRange().end ? new Date(getSelectedTimeRange().end).getHours().toString().padStart(2, '0') + ':00' : '08:00'}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: 16 }}
                      required
                    >
                      {endHourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Địa điểm</label>
                    <FormControl fullWidth>
                      <InputLabel id="office-create-label">Chọn địa điểm</InputLabel>
                      <Select
                        labelId="office-create-label"
                        name="location"
                        defaultValue=""
                        label="Chọn địa điểm"
                        required
                      >
                        <MenuItem value="">-- Chọn địa điểm --</MenuItem>
                        {offices.map((of, idx) => (
                          <MenuItem key={idx} value={of}>{of}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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

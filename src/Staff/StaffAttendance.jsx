<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import {
  ChevronLeft, ChevronRight, Download,
  Clock, Calendar, Coffee, Briefcase,
  Menu, CheckCircle, Loader2, AlertCircle,
  LogIn, LogOut
} from 'lucide-react';
import StaffSidebar from './StaffSidebar';
import api from '../services/api';
=======
import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Download, 
  Clock, Calendar, Coffee, Briefcase, 
  Menu, CheckCircle
} from 'lucide-react';
import StaffSidebar from './StaffSidebar';
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f

const StaffAttendance = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
<<<<<<< HEAD
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [loading, setLoading] = useState({
    today: false,
    summary: false,
    calendar: false,
    history: false,
    punch: false
  });

  // Data State
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceCalendar, setAttendanceCalendar] = useState({});
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [summaryStats, setSummaryStats] = useState([
    { title: 'Days Worked', value: '0', subtitle: 'This month', icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Leaves Taken', value: '0', subtitle: 'This month', icon: Coffee, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Late Punch-ins', value: '0', subtitle: 'This month', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Overtime Hours', value: '0', subtitle: 'This month', icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-50' }
  ]);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [user, setUser] = useState({ name: 'Loading...', initials: 'U' });

  // Error State
  const [error, setError] = useState(null);

  // Format date for API
  const formatMonthKey = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      const initials = userData.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'U';

      setUser({
        name: userData.name || 'User',
        initials
      });
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    try {
      setLoading(prev => ({ ...prev, today: true }));
      setError(null);

      const response = await api.get('/attendance/today');
      const data = response.data;

      // Format the data for display
      const formattedData = {
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        currentTime: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        punchInTime: data.punchInTime ?
          new Date(data.punchInTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }) : '--:-- --',
        punchOutTime: data.punchOutTime ?
          new Date(data.punchOutTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }) : '--:-- --',
        hoursWorked: data.hoursWorked || 0,
        targetHours: data.targetHours || 8,
        status: data.status || 'Not Checked In',
        raw: data
      };

      setTodayAttendance(formattedData);
    } catch (err) {
      console.error('Error fetching today attendance:', err);
      setError('Failed to load today\'s attendance');
    } finally {
      setLoading(prev => ({ ...prev, today: false }));
    }
  };

  // Fetch attendance summary
  const fetchSummary = async () => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/attendance/summary/${monthKey}`);
      const data = response.data;
      console.log('Summary data:', data);

      // Update summary stats
      setSummaryStats([
        {
          title: 'Days Worked',
          value: data.presentDays || 0,
          subtitle: 'This month',
          icon: Calendar,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        {
          title: 'Leaves Taken',
          value: data.leaveDays || 0,
          subtitle: 'This month',
          icon: Coffee,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        },
        {
          title: 'Late Punch-ins',
          value: data.lateDays || 0,
          subtitle: 'This month',
          icon: Clock,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          title: 'Overtime Hours',
          value: data.overtimeHours ? data.overtimeHours.toFixed(1) : '0.0',
          subtitle: 'This month',
          icon: Briefcase,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        }
      ]);
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  // Fetch attendance calendar
  const fetchCalendar = async () => {
    try {
      setLoading(prev => ({ ...prev, calendar: true }));
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/attendance/calendar/${monthKey}`);
      const data = response.data;

      // Convert array to object for easier lookup
      const calendarMap = {};
      data.forEach(record => {
        const day = new Date(record.date).getDate();
        calendarMap[day] = record.status || null;
      });

      setAttendanceCalendar(calendarMap);
      generateCalendarGrid(currentDate);
    } catch (err) {
      console.error('Error fetching calendar:', err);
      generateCalendarGrid(currentDate); // Generate grid even if API fails
    } finally {
      setLoading(prev => ({ ...prev, calendar: false }));
    }
  };

  // Fetch attendance history
  const fetchHistory = async () => {
    try {
      setLoading(prev => ({ ...prev, history: true }));
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/attendance/history/${monthKey}`, {
        params: {
          page: currentPage,
          limit: entriesPerPage
        }
      });

      const data = response.data;
      const historyData = data.data || data.history || [];

      // Format history data
      const formattedHistory = historyData.map(record => ({
        id: record._id || record.id,
        date: new Date(record.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        day: new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
        punchIn: record.punchInTime ?
          new Date(record.punchInTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }) : '--:-- --',
        punchOut: record.punchOutTime ?
          new Date(record.punchOutTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }) : '--:-- --',
        totalHours: record.totalHours ?
          `${Math.floor(record.totalHours)}h ${Math.round((record.totalHours % 1) * 60)}m` : '0h 0m',
        status: record.status || 'Absent',
        rawHours: record.totalHours || 0
      }));

      setAttendanceHistory(formattedHistory);
      setTotalRecords(data.total || data.pagination?.total || formattedHistory.length);
    } catch (err) {
      console.error('Error fetching history:', err);
      setAttendanceHistory([]);
      setTotalRecords(0);
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  // Generate calendar grid
  const generateCalendarGrid = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const weeks = [];
    let week = new Array(firstDayOfWeek).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    setCalendarDays(weeks);
  };

  // Handle punch in/out
  const handlePunchAction = async () => {
    try {
      setLoading(prev => ({ ...prev, punch: true }));

      if (todayAttendance?.raw?.punchInTime && !todayAttendance?.raw?.punchOutTime) {
        // Punch out
        await api.post('/attendance/punch-out');
      } else {
        // Punch in
        await api.post('/attendance/punch-in');
      }

      // Refresh all data
      await fetchTodayAttendance();
      await fetchSummary();
      await fetchCalendar();
      await fetchHistory();

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to process punch action';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(prev => ({ ...prev, punch: false }));
    }
  };

  // Handle month navigation
  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setCurrentPage(1); // Reset to first page when month changes
  };

  // Handle export
  const handleExport = async (format) => {
    try {
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/attendance/export/${monthKey}/${format}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${monthKey}_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert(`${format.toUpperCase()} export completed!`);
    } catch (err) {
      alert(`Failed to export ${format}: ${err.response?.data?.message || err.message}`);
    }
  };
=======
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Today's attendance data (Static View)
  const todayAttendance = {
    date: 'Monday, January 15, 2025',
    currentTime: '02:45 PM',
    punchInTime: '08:00 AM',
    punchOutTime: '--:-- --',
    hoursWorked: 6.75,
    targetHours: 10,
    status: 'Present'
  };

  // Calendar attendance data
  const attendanceCalendar = {
    1: 'present', 2: 'present', 3: 'present', 4: 'leave', 5: 'absent',
    6: 'present', 7: 'present', 8: 'present', 9: 'present', 10: 'present',
    11: 'leave', 12: 'halfday', 13: 'present', 14: 'present', 15: 'present',
    16: null, 17: null, 18: null, 19: null, 20: null,
    21: null, 22: null, 23: null, 24: null, 25: null,
    26: null, 27: null, 28: null, 29: null, 30: null, 31: null
  };

  // Summary stats
  const summaryStats = [
    { title: 'Days Worked', value: '12', subtitle: 'This month', icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Leaves Taken', value: '2', subtitle: 'This month', icon: Coffee, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Late Punch-ins', value: '1', subtitle: 'This month', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Overtime Hours', value: '8.5', subtitle: 'This month', icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-50' }
  ];

  // Attendance history
  const attendanceHistory = [
    { id: 1, date: 'Jan 15, 2025', day: 'Monday', punchIn: '08:00 AM', punchOut: '--:-- --', totalHours: '6h 45m', status: 'Present' },
    { id: 2, date: 'Jan 14, 2025', day: 'Sunday', punchIn: '08:15 AM', punchOut: '06:30 PM', totalHours: '10h 15m', status: 'Present' },
    { id: 3, date: 'Jan 13, 2025', day: 'Saturday', punchIn: '08:05 AM', punchOut: '05:45 PM', totalHours: '9h 40m', status: 'Present' },
    { id: 4, date: 'Jan 12, 2025', day: 'Friday', punchIn: '09:30 AM', punchOut: '02:00 PM', totalHours: '4h 30m', status: 'Half Day' },
    { id: 5, date: 'Jan 11, 2025', day: 'Thursday', punchIn: '--:-- --', punchOut: '--:-- --', totalHours: '0h 0m', status: 'On Leave' },
    { id: 6, date: 'Jan 10, 2025', day: 'Wednesday', punchIn: '08:00 AM', punchOut: '06:15 PM', totalHours: '10h 15m', status: 'Present' },
    { id: 7, date: 'Jan 09, 2025', day: 'Tuesday', punchIn: '08:10 AM', punchOut: '05:50 PM', totalHours: '9h 40m', status: 'Present' },
    { id: 8, date: 'Jan 08, 2025', day: 'Monday', punchIn: '08:00 AM', punchOut: '06:00 PM', totalHours: '10h 0m', status: 'Present' },
    { id: 9, date: 'Jan 07, 2025', day: 'Sunday', punchIn: '08:05 AM', punchOut: '06:10 PM', totalHours: '10h 5m', status: 'Present' },
    { id: 10, date: 'Jan 06, 2025', day: 'Saturday', punchIn: '08:00 AM', punchOut: '05:45 PM', totalHours: '9h 45m', status: 'Present' }
  ];

  // Pagination
  const totalPages = Math.ceil(attendanceHistory.length / entriesPerPage);
  const displayedHistory = attendanceHistory.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Calendar grid generation
  const daysInMonth = 31;
  const firstDayOfWeek = 3; 
  const weeks = [];
  let week = new Array(firstDayOfWeek).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f

  // Utility functions
  const getAttendanceDot = (status) => {
    const styles = {
      'present': 'bg-green-500',
<<<<<<< HEAD
      'Present': 'bg-green-500',
      'absent': 'bg-red-500',
      'Absent': 'bg-red-500',
      'leave': 'bg-yellow-500',
      'On Leave': 'bg-yellow-500',
      'halfday': 'bg-orange-500',
      'Half Day': 'bg-orange-500',
      'late': 'bg-purple-500'
=======
      'absent': 'bg-red-500',
      'leave': 'bg-yellow-500',
      'halfday': 'bg-orange-500'
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
    };
    return styles[status] || 'bg-gray-300';
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Present': 'bg-green-100 text-green-700',
      'Absent': 'bg-red-100 text-red-700',
      'On Leave': 'bg-yellow-100 text-yellow-700',
<<<<<<< HEAD
      'Half Day': 'bg-orange-100 text-orange-700',
      'Late': 'bg-purple-100 text-purple-700',
      'Not Checked In': 'bg-gray-100 text-gray-700'
=======
      'Half Day': 'bg-orange-100 text-orange-700'
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

<<<<<<< HEAD
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!todayAttendance) return 0;
    return Math.min(100, (todayAttendance.hoursWorked / todayAttendance.targetHours) * 100);
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalRecords / entriesPerPage);
  const startItem = totalRecords > 0 ? ((currentPage - 1) * entriesPerPage) + 1 : 0;
  const endItem = Math.min(currentPage * entriesPerPage, totalRecords);

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
    fetchTodayAttendance();
  }, []);

  // Fetch data when month changes
  useEffect(() => {
    fetchSummary();
    fetchCalendar();
    fetchHistory();
  }, [currentDate]);

  // Fetch history when pagination changes
  useEffect(() => {
    fetchHistory();
  }, [currentPage, entriesPerPage]);

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
=======
  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
      <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
<<<<<<< HEAD
              <button
=======
              <button 
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                className="lg:hidden text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Attendance</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
<<<<<<< HEAD
                <span className="text-sm font-medium text-white hidden sm:block">{user.name}</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  {user.initials}
=======
                <span className="text-sm font-medium text-white hidden sm:block">Dr. Sarah Johnson</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  SJ
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
<<<<<<< HEAD
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* === RESPONSIVE GRID WRAPPER === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Attendance */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance</h3>

              {loading.today ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#246e72]" />
                </div>
              ) : todayAttendance ? (
                <div>
                  {/* Punch In Details Section */}
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">{todayAttendance.date}</p>
                    <p className="text-sm text-gray-500 mb-4">Current Time: {todayAttendance.currentTime}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(todayAttendance.status)}`}>
                          {todayAttendance.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Punch In:</span>
                        <span className="text-sm font-semibold text-gray-800">{todayAttendance.punchInTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Punch Out:</span>
                        <span className="text-sm font-semibold text-gray-800">{todayAttendance.punchOutTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hours Worked Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Hours Worked Today</p>
                    <p className="text-3xl font-bold text-[#246e72] mb-2">
                      {todayAttendance.hoursWorked.toFixed(1)}h / {todayAttendance.targetHours}h
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div
                        className="bg-[#246e72] h-4 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress()}%` }}
                      />
                    </div>

                    <div className="bg-[#D2EAF4] rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-green-600 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {calculateProgress() >= 100 ? 'Target Achieved!' : 'On Track!'}
                          </p>
                          <p className="text-xs text-gray-600">
                            You've completed {Math.round(calculateProgress())}% of your target hours
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Punch In/Out Button */}
                    <button
                      onClick={handlePunchAction}
                      disabled={loading.punch}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${todayAttendance?.raw?.punchInTime && !todayAttendance?.raw?.punchOutTime
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-[#246e72] hover:bg-[#1a5256] text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading.punch ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {todayAttendance?.raw?.punchInTime && !todayAttendance?.raw?.punchOutTime ? (
                            <>
                              <LogOut size={20} />
                              <span>Punch Out</span>
                            </>
                          ) : (
                            <>
                              <LogIn size={20} />
                              <span>Punch In</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Unable to load today's attendance
                </div>
              )}
=======

          {/* === RESPONSIVE GRID WRAPPER === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Today's Attendance */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance</h3>
              
              <div>
                {/* Punch In Details Section */}
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">{todayAttendance.date}</p>
                  <p className="text-sm text-gray-500 mb-4">Current Time: {todayAttendance.currentTime}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {todayAttendance.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Punch In:</span>
                      <span className="text-sm font-semibold text-gray-800">{todayAttendance.punchInTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Punch Out:</span>
                      <span className="text-sm font-semibold text-gray-800">{todayAttendance.punchOutTime}</span>
                    </div>
                  </div>
                </div>

                {/* Hours Worked Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Hours Worked Today</p>
                  <p className="text-3xl font-bold text-[#246e72] mb-2">{todayAttendance.hoursWorked}h / {todayAttendance.targetHours}h</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-[#246e72] h-4 rounded-full transition-all duration-300"
                      style={{ width: `${(todayAttendance.hoursWorked / todayAttendance.targetHours) * 100}%` }}
                    />
                  </div>

                  <div className="bg-[#D2EAF4] rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="text-green-600 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">On Track!</p>
                        <p className="text-xs text-gray-600">You've completed {Math.round((todayAttendance.hoursWorked / todayAttendance.targetHours) * 100)}% of your target hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
            </div>

            {/* Attendance Calendar */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Attendance Calendar</h3>
<<<<<<< HEAD
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMonthChange('prev')}
                    className="p-2 border border-gray-300 rounded-lg text-[#246e72] hover:bg-teal-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => handleMonthChange('next')}
                    className="p-2 border border-gray-300 rounded-lg text-[#246e72] hover:bg-teal-50 transition-colors"
                  >
=======
                {/* Updated Navigation Buttons to Match Theme */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 rounded-lg text-[#246e72] hover:bg-teal-50 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">{selectedMonth}</span>
                  <button className="p-2 border border-gray-300 rounded-lg text-[#246e72] hover:bg-teal-50 transition-colors">
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

<<<<<<< HEAD
              {loading.calendar ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#246e72]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">{day}</div>
                      ))}
                    </div>

                    {calendarDays.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
                        {week.map((day, dayIndex) => {
                          const today = new Date();
                          const isToday = day === today.getDate() &&
                            currentDate.getMonth() === today.getMonth() &&
                            currentDate.getFullYear() === today.getFullYear();

                          return (
                            <div
                              key={dayIndex}
                              className={`relative aspect-square border rounded-lg flex flex-col items-center justify-center ${day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'
                                } ${isToday ? 'ring-2 ring-[#246e72]' : ''}`}
                            >
                              {day && (
                                <>
                                  <span className={`text-sm font-medium ${isToday ? 'text-[#246e72]' : 'text-gray-700'}`}>
                                    {day}
                                  </span>
                                  {attendanceCalendar[day] && (
                                    <div
                                      className={`w-2 h-2 rounded-full mt-1 ${getAttendanceDot(attendanceCalendar[day])}`}
                                      title={attendanceCalendar[day]}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    <div className="flex items-center justify-center space-x-4 mt-4 text-sm flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-gray-600">Present</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-gray-600">Absent</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-gray-600">On Leave</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-gray-600">Half Day</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
=======
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">{day}</div>
                    ))}
                  </div>

                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
                      {week.map((day, dayIndex) => (
                        <div 
                          key={dayIndex} 
                          className={`relative aspect-square border rounded-lg flex flex-col items-center justify-center ${
                            day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'
                          } ${day === 15 ? 'ring-2 ring-[#246e72]' : ''}`}
                        >
                          {day && (
                            <>
                              <span className="text-sm font-medium text-gray-700">{day}</span>
                              {attendanceCalendar[day] && (
                                <div className={`w-2 h-2 rounded-full mt-1 ${getAttendanceDot(attendanceCalendar[day])}`} />
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="flex items-center justify-center space-x-4 mt-4 text-sm flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-gray-600">Present</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-gray-600">Absent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-gray-600">On Leave</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-gray-600">Half Day</span>
                    </div>
                  </div>
                </div>
              </div>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
            </div>
          </div>
          {/* === END RESPONSIVE GRID WRAPPER === */}

<<<<<<< HEAD
=======

>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
<<<<<<< HEAD
                      {loading.summary ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                          <span className="text-sm text-gray-500">Loading...</span>
                        </div>
                      ) : (
                        <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                      )}
=======
                      <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={stat.color} size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                </div>
              );
            })}
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">Attendance History</h3>
<<<<<<< HEAD

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMonthChange('prev')}
                    className="p-2 border border-gray-300 rounded-lg text-[#246e72] hover:bg-teal-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => handleMonthChange('next')}
                    className="p-2 border border-gray-300 rounded-lg text-[#246e72] hover:bg-teal-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
=======
              
              {/* --- UPDATED FILTER CONTROLS TO MATCH ADMIN THEME --- */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium focus:ring-2 focus:ring-[#246e72] outline-none w-full sm:w-auto"
                >
                  <option>January 2025</option>
                  <option>December 2024</option>
                  <option>November 2024</option>
                </select>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f

                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium focus:ring-2 focus:ring-[#246e72] outline-none w-full sm:w-auto"
<<<<<<< HEAD
                  disabled={loading.history}
                >
                  <option value={10}>Show 10</option>
                  <option value={25}>Show 25</option>
=======
                >
                  <option value={10}>Show 10</option>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>

                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 w-full justify-center sm:w-auto text-sm"
<<<<<<< HEAD
                    disabled={loading.history}
=======
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                  >
                    <Download size={18} />
                    <span>Export</span>
                  </button>
<<<<<<< HEAD

                  {showExportDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={() => {
                          handleExport('csv');
                          setShowExportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => {
                          handleExport('pdf');
                          setShowExportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
=======
                  
                  {showExportDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Export as Excel
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                        Export as PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Day</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Punch In</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Punch Out</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total Hours</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                  {loading.history ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Loader2 className="h-8 w-8 animate-spin text-[#246e72]" />
                          <p className="text-sm text-gray-600">Loading attendance history...</p>
                        </div>
                      </td>
                    </tr>
                  ) : attendanceHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Calendar className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">No attendance records found</p>
                          <p className="text-sm text-gray-400">Select a different month to view records</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    attendanceHistory.map(record => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-700">{record.date}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{record.day}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{record.punchIn}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{record.punchOut}</td>
                        <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{record.totalHours}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
=======
                  {displayedHistory.map(record => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-700">{record.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{record.day}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{record.punchIn}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{record.punchOut}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{record.totalHours}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">
<<<<<<< HEAD
                {loading.history ? (
                  'Loading...'
                ) : (
                  `Showing ${startItem} to ${endItem} of ${totalRecords} records`
                )}
              </p>

              {totalPages > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading.history}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading.history}
                        className={`w-10 h-10 rounded-lg transition-colors text-sm font-medium ${currentPage === pageNum
                            ? 'bg-[#246e72] text-white'
                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading.history}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
=======
                Showing {displayedHistory.length} of {attendanceHistory.length} records
              </p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-lg transition-colors text-sm font-medium ${
                      currentPage === index + 1
                        ? 'bg-[#246e72] text-white'
                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffAttendance;
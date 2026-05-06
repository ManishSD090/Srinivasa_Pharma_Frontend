import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Download,
  X, AlertCircle, Eye, FileText,
  Edit2, Trash2, CheckCircle, Clock, Loader2,
  LogIn, LogOut
} from 'lucide-react';
import api from '../services/api';

const PayrollAttendancePage = () => {
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('current');

  // Loading states
  const [loading, setLoading] = useState({
    staff: false,
    today: false,
    calendar: false,
    summary: false,
    payroll: false,
    history: false,
    punch: false,
    export: false
  });

  // Data states
  const [staffMembers, setStaffMembers] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceCalendar, setAttendanceCalendar] = useState({});
  const [monthlySummary, setMonthlySummary] = useState({
    totalWorkingDays: 0,
    presentDays: 0,
    leaveDays: 0,
    absentDays: 0,
    lateDays: 0,
    attendanceRate: 0
  });
  const [payrollData, setPayrollData] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [calendarDays, setCalendarDays] = useState([]);
  const [attendanceModalData, setAttendanceModalData] = useState(null);
  const [adminComment, setAdminComment] = useState('');

  // Controlled inputs for manual adjustments
  const [manualBonus, setManualBonus] = useState('0.00');
  const [manualDeduction, setManualDeduction] = useState('0.00');
  const [payrollNotes, setPayrollNotes] = useState('');

  // Format month key for API
  const formatMonthKey = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  // Helper function to convert values to numbers
  const toNumber = (v) => Number.parseFloat(v) || 0;

  // Fetch all staff members
  const fetchStaffMembers = async () => {
    try {
      setLoading(prev => ({ ...prev, staff: true }));

      const response = await api.get('/staff');
      const allStaff = response.data || [];

      setStaffMembers([
        { _id: 'all', name: 'All Staff' },
        ...allStaff
      ]);

      if (allStaff.length > 0 && selectedStaff === 'all') {
        setSelectedStaff(allStaff[0]._id);
      }

    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(prev => ({ ...prev, staff: false }));
    }
  };

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    if (selectedStaff === 'all') return;

    try {
      setLoading(prev => ({ ...prev, today: true }));
      const response = await api.get('/attendance/today', {
        params: {
          staffId: selectedStaff
        }
      });

      const data = response.data;

      const sessions = data.sessions || [];
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      const isCurrentlyPunchedIn = !!(lastSession && !lastSession.punchOut);

      const formattedData = {
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        currentTime: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sessions: sessions,
        punchInTime: sessions[0]?.punchIn ?
          new Date(sessions[0].punchIn).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }) : '--:-- --',
        punchOutTime: (lastSession && lastSession.punchOut) ?
          new Date(lastSession.punchOut).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }) : '--:-- --',
        hoursWorked: data.hoursWorked || 0,
        targetHours: data.targetHours || 10,
        status: data.status || 'Not Checked In',
        isPunchedIn: isCurrentlyPunchedIn,
        raw: data
      };

      setTodayAttendance(formattedData);
    } catch (err) {
      console.error('Error fetching today attendance:', err);
      setTodayAttendance(null);
    } finally {
      setLoading(prev => ({ ...prev, today: false }));
    }
  };

  // Generate calendar grid
  const generateCalendarGrid = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
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

  // Fetch attendance calendar
  const fetchCalendar = async () => {
    if (selectedStaff === 'all') return;

    try {
      setLoading(prev => ({ ...prev, calendar: true }));
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/admin/attendance/calendar/${selectedStaff}/${monthKey}`);
      const data = response.data;

      const calendarMap = {};
      data.forEach(record => {
        const day = new Date(record.date).getDate();
        calendarMap[day] = record.status?.toLowerCase() || null;
      });


      setAttendanceCalendar(calendarMap);
      generateCalendarGrid(currentDate);
    } catch (err) {
      console.error('Error fetching calendar:', err);
      generateCalendarGrid(currentDate);
    } finally {
      setLoading(prev => ({ ...prev, calendar: false }));
    }
  };

  // Fetch monthly summary
  const fetchMonthlySummary = async () => {
    if (selectedStaff === 'all') {
      generateCalendarGrid(currentDate);
      setAttendanceCalendar({});
      return;
    }

    try {
      setLoading(prev => ({ ...prev, summary: true }));
      const monthKey = formatMonthKey(currentDate);

      const response = await api.get(`/attendance/summary/${selectedStaff}/${monthKey}`);
      const data = response.data;

      setMonthlySummary({
        totalWorkingDays: data.totalWorkingDays || 0,
        presentDays: data.presentDays || 0,
        leaveDays: data.leaveDays || 0,
        absentDays: data.absentDays || 0,
        lateDays: data.lateDays || 0,
        overtimeHours: data.overtimeHours || 0,
        totalHours: data.totalHours || 0,
        attendanceRate: data.attendanceRate || 0
      });
    } catch (err) {
      console.error('Error fetching staff summary:', err);

      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      setMonthlySummary({
        totalWorkingDays: daysInMonth,
        presentDays: 0,
        leaveDays: 0,
        absentDays: 0,
        lateDays: 0,
        attendanceRate: 0
      });
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  // Fetch payroll data
  const fetchPayrollData = async () => {
    if (selectedStaff === 'all') return;

    try {
      setLoading(prev => ({ ...prev, payroll: true }));
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/payroll/${selectedStaff}/${monthKey}`);
      const data = response.data;

      setPayrollData(data);
      setManualBonus(data.manualBonus?.toString() || '0.00');
      setManualDeduction(data.manualDeduction?.toString() || '0.00');
      setPayrollNotes(data.notes || '');
    } catch (err) {
      console.error('Error fetching payroll:', err);
      setPayrollData(null);
    } finally {
      setLoading(prev => ({ ...prev, payroll: false }));
    }
  };

  // Fetch payroll history
  const fetchPayrollHistory = async () => {
    if (selectedStaff === 'all') return;

    try {
      setLoading(prev => ({ ...prev, history: true }));
      const response = await api.get(`/payroll/history/${selectedStaff}`);
      setPayrollHistory(response.data || []);
    } catch (err) {
      console.error('Error fetching payroll history:', err);
      setPayrollHistory([]);
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };


  // Handle punch in/out
  const handlePunchAction = async () => {
    try {
      setLoading(prev => ({ ...prev, punch: true }));

      let response;
      if (todayAttendance?.isPunchedIn) {
        response = await api.post('/attendance/punch-out', {
          staffId: selectedStaff
        });
      } else {
        response = await api.post('/attendance/punch-in', {
          staffId: selectedStaff
        });
      }

      const punchData = response.data;
      
      // Update local state immediately with response data
      setTodayAttendance(prev => ({
        ...prev,
        isPunchedIn: punchData.isPunchedIn,
        sessions: punchData.sessions || prev?.sessions || [],
        hoursWorked: punchData.totalHours || prev?.hoursWorked || 0,
        punchInTime: punchData.sessions?.[0]?.punchIn ? 
          new Date(punchData.sessions[0].punchIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 
          prev?.punchInTime,
        punchOutTime: punchData.isPunchedIn ? '--:-- --' : 
          (punchData.sessions?.[punchData.sessions.length - 1]?.punchOut ? 
            new Date(punchData.sessions[punchData.sessions.length - 1].punchOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 
            '--:-- --'),
        status: punchData.isPunchedIn ? 'present' : (prev?.status || 'present')
      }));

      // Still fetch other summaries to stay in sync
      await Promise.all([
        fetchCalendar(),
        fetchMonthlySummary()
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to process punch action';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(prev => ({ ...prev, punch: false }));
    }
  };

  // Handle month change
  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Generate payroll
  const handleGeneratePayroll = async () => {
    if (selectedStaff === 'all') {
      alert('Please select a specific staff member');
      return;
    }

    try {
      const monthKey = formatMonthKey(currentDate);
      await api.post(`/payroll/generate/${selectedStaff}/${monthKey}`);
      alert('Payroll generated successfully!');
      await fetchPayrollData();
      await fetchPayrollHistory();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate payroll');
    }
  };

  const handleSaveAdjustments = async () => {
    if (!payrollData?._id) return;

    try {
      setLoading(prev => ({ ...prev, payroll: true }));

      const bonus = Number(manualBonus) || 0;
      const deduction = Number(manualDeduction) || 0;

      const response = await api.put(`/payroll/${payrollData._id}`, {
        bonus,
        deduction,
        notes: payrollNotes
      });

      alert('Adjustments saved successfully!');
      setPayrollData(response.data);
      await fetchPayrollHistory();
    } catch (err) {
      console.error("Save adjustments error:", err);
      alert(err.response?.data?.message || 'Failed to save adjustments');
    } finally {
      setLoading(prev => ({ ...prev, payroll: false }));
    }
  };

  // Handle date click in calendar
  const handleDateClick = async (day) => {
    if (!attendanceCalendar[day] || selectedStaff === 'all') return;

    try {
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/admin/attendance/calendar/${selectedStaff}/${monthKey}`);
      const records = response.data;

      const record = records.find(r => new Date(r.date).getDate() === day);
      if (record) {
        setAttendanceModalData(record);
        setAdminComment(record.adminComment || '');
        setSelectedDate(day);
        setShowAttendanceModal(true);
      }
    } catch (err) {
      console.error('Error fetching attendance details:', err);
    }
  };

  // Save admin comment
  const handleSaveComment = async () => {
    if (!attendanceModalData) return;

    try {
      await api.put(`/admin/attendance/${attendanceModalData._id}/comment`, {
        comment: adminComment
      });
      alert('Comment saved successfully!');
      setShowAttendanceModal(false);
      await fetchCalendar();
    } catch (err) {
      alert('Failed to save comment');
    }
  };

  // Export attendance
  const handleExportAttendance = async (format) => {
    if (selectedStaff === 'all') {
      alert('Please select a specific staff member');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, export: true }));
      const monthKey = formatMonthKey(currentDate);
      const response = await api.get(`/attendance/export/${monthKey}/${format}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${monthKey}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setShowExportDropdown(false);
    } catch (err) {
      alert('Failed to export attendance');
    } finally {
      setLoading(prev => ({ ...prev, export: false }));
    }
  };

  // Export payroll
  const handleExportPayroll = async () => {
    if (!payrollData) {
      alert('No payroll data available');
      return;
    }

    try {
      const response = await api.get(`/payroll/export/${payrollData._id}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payroll_${formatMonthKey(currentDate)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setShowExportDropdown(false);
    } catch (err) {
      alert('Failed to export payroll');
    }
  };

  // Utility functions
  const getAttendanceColor = (status = '') => {
    const normalized = status.toLowerCase();

    const colors = {
      'present': 'bg-green-500',
      'absent': 'bg-red-500',
      'leave': 'bg-yellow-500',
      'on leave': 'bg-yellow-500',
      'half day': 'bg-orange-500',
      'halfday': 'bg-orange-500',
      'late': 'bg-purple-500'
    };

    return colors[normalized] || 'bg-gray-300';
  };

  const calculateProgress = () => {
    if (!todayAttendance) return 0;
    return Math.min(100, (todayAttendance.hoursWorked / todayAttendance.targetHours) * 100);
  };

  // Compute derived values and render salary breakdown
  const derivedValues = useMemo(() => {
    const base = toNumber(payrollData?.baseSalary);
    const prorated = payrollData?.presentDays && payrollData?.totalWorkingDays
      ? (base * payrollData.presentDays) / payrollData.totalWorkingDays
      : base;
    const bonus = toNumber(manualBonus);
    const deduction = toNumber(manualDeduction);
    const net = prorated + bonus - deduction;

    return { base, prorated, bonus, deduction, net };
  }, [payrollData, manualBonus, manualDeduction]);

  // Effects
  useEffect(() => {
    fetchStaffMembers();
  }, []);

  useEffect(() => {
    if (selectedStaff && selectedStaff !== 'all') {
      fetchTodayAttendance();
      fetchCalendar();
      fetchMonthlySummary();
      fetchPayrollData();
      fetchPayrollHistory();
    }
  }, [selectedStaff, currentDate]);

  return (
    <main className="p-4 lg:p-8 space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Staff</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
              disabled={loading.staff}
            >
              {staffMembers.map(staff => (
                <option key={staff._id} value={staff._id}>{staff.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMonthChange('prev')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center text-sm font-medium">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => handleMonthChange('next')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={() => setActiveFilter('current')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === 'current' ? 'bg-[#246e72] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Current Month
            </button>
            <button
              onClick={() => setActiveFilter('last')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === 'last' ? 'bg-[#246e72] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Last Month
            </button>
          </div>

          <div className="flex items-end relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="w-full bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2"
              disabled={loading.export}
            >
              {loading.export ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              <span>Export</span>
            </button>
            {showExportDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => handleExportAttendance('csv')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                  Export Attendance (Excel)
                </button>
                <button
                  onClick={() => handleExportPayroll()}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                  Export Payroll (PDF)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance</h3>

        {loading.today ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#246e72]" />
          </div>
        ) : todayAttendance ? (
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-1">{todayAttendance.date}</p>
            <p className="text-sm text-gray-500 mb-4">Current Time: {todayAttendance.currentTime}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${todayAttendance.isPunchedIn
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
                  }`}>
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

            <button
              onClick={handlePunchAction}
              disabled={loading.punch}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors mb-6 ${todayAttendance?.isPunchedIn
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#246e72] hover:bg-[#1a5256] text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading.punch ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {todayAttendance?.isPunchedIn ? (
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

            {todayAttendance?.sessions?.length > 0 && (
              <div className="mt-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Sessions</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {todayAttendance.sessions.map((session, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded border border-gray-100">
                      <span className="text-gray-600">Session {idx + 1}</span>
                      <span className="font-medium text-gray-800">
                        {new Date(session.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {session.punchOut ? ` - ${new Date(session.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ' (Active)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
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
              <div className="bg-[#D2EAF4] rounded-lg p-4">
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
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {selectedStaff === 'all' ? 'Please select a staff member' : 'No attendance data available'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Attendance
          </h2>

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
                          onClick={() => day && handleDateClick(day)}
                          className={`relative aspect-square border rounded-lg flex flex-col items-center justify-center ${day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'
                            } ${isToday ? 'ring-2 ring-[#246e72]' : ''}`}
                        >
                          {day && (
                            <>
                              <span className={`text-sm font-medium ${isToday ? 'text-[#246e72]' : 'text-gray-700'
                                }`}>
                                {day}
                              </span>
                              {attendanceCalendar[day] && (
                                <div
                                  className={`w-2 h-2 rounded-full mt-1 ${getAttendanceColor(attendanceCalendar[day])
                                    }`}
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

                <div className="flex items-center justify-center space-x-4 mt-4 text-sm flex-wrap">
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
        </div>

        {/* Monthly Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Summary</h3>
            {loading.summary ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#246e72]" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Working Days</span>
                  <span className="text-lg font-bold text-gray-800">
                    {monthlySummary.totalWorkingDays}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Present Days</span>
                  <span className="text-lg font-bold text-green-600">
                    {monthlySummary.presentDays}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved Leaves</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {monthlySummary.leaveDays}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Absent Days</span>
                  <span className="text-lg font-bold text-red-600">
                    {monthlySummary.absentDays}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Late Arrivals</span>
                  <span className="text-lg font-bold text-orange-600">
                    {monthlySummary.lateDays}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                    <span className="text-lg font-bold text-[#246e72]">
                      {monthlySummary.attendanceRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#246e72] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${monthlySummary.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alerts and Notifications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Alerts and Notifications</h3>
            <div className="space-y-3">
              {selectedStaff !== 'all' && monthlySummary.absentDays > 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="text-red-600 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Missing Attendance</p>
                      <p className="text-xs text-gray-600">
                        {monthlySummary.absentDays} absent day(s) this month
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedStaff !== 'all' && monthlySummary.lateDays > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Late Arrivals</p>
                      <p className="text-xs text-gray-600">
                        {monthlySummary.lateDays} late arrival(s) this month
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedStaff !== 'all' && !payrollData && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="text-blue-600 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Payroll Not Generated</p>
                      <p className="text-xs text-gray-600">
                        Generate payroll for {formatMonthKey(currentDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Calculation */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Payroll Calculation - {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          {selectedStaff !== 'all' && !payrollData && (
            <button
              onClick={handleGeneratePayroll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center space-x-2"
            >
              <FileText size={16} />
              <span>Generate Payroll</span>
            </button>
          )}
        </div>

        {loading.payroll ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#246e72]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Breakdown</h3>
              <div className="space-y-3">
                {payrollData ? (
                  <>
                    {/* Base Salary */}
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Base Salary</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-green-600">
                          +₹{payrollData.baseSalary?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>

                    {derivedValues.bonus > 0 && (
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Bonus</span>
                        <span className="text-sm font-semibold text-green-600">
                          +₹{derivedValues.bonus.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {derivedValues.deduction > 0 && (
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Deduction</span>
                        <span className="text-sm font-semibold text-red-600">
                          -₹{derivedValues.deduction.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {selectedStaff === 'all' ? 'Select a staff member' : 'No payroll data available'}
                  </div>
                )}

                {selectedStaff !== 'all' && payrollData && (
                  <div className="pt-4 border-t-2 border-gray-300 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Net Payable Amount</span>
                      <span className="text-2xl font-bold text-[#246e72]">
                        ₹{derivedValues.net.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Payroll Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleExportPayroll()}
                  disabled={!payrollData}
                  className="w-full bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText size={20} />
                  <span>Generate Salary Slip</span>
                </button>

                {selectedStaff !== 'all' && payrollData && (
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Manual Adjustments</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Additional Bonus</label>
                        <input
                          type="number"
                          step="0.01"
                          value={manualBonus}
                          onChange={(e) => setManualBonus(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Additional Deduction</label>
                        <input
                          type="number"
                          step="0.01"
                          value={manualDeduction}
                          onChange={(e) => setManualDeduction(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Notes</label>
                        <textarea
                          value={payrollNotes}
                          onChange={(e) => setPayrollNotes(e.target.value)}
                          placeholder="Add notes for adjustments..."
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none resize-none"
                        />
                      </div>
                      <button
                        onClick={handleSaveAdjustments}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Save Adjustments
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Details Modal */}
      {showAttendanceModal && attendanceModalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Attendance Details - {selectedDate} {currentDate.toLocaleDateString('en-US', { month: 'long' })}
              </h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#D2EAF4] rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {attendanceModalData.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Punch In:</span>
                    <span className="font-medium text-gray-800">
                      {attendanceModalData.punchInTime
                        ? new Date(attendanceModalData.punchInTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : '--:-- --'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Punch Out:</span>
                    <span className="font-medium text-gray-800">
                      {attendanceModalData.punchOutTime
                        ? new Date(attendanceModalData.punchOutTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : '--:-- --'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-medium text-gray-800">
                      {attendanceModalData.totalHours
                        ? `${Math.floor(attendanceModalData.totalHours)}h ${Math.round(
                          (attendanceModalData.totalHours % 1) * 60
                        )}m`
                        : '0h 0m'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Comment</label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Add your comment..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none resize-none"
                />
              </div>

              <button
                onClick={handleSaveComment}
                className="w-full bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PayrollAttendancePage;
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Download,
  X, AlertCircle, Eye, FileText,
  Edit2, Trash2, Menu, CheckCircle, Clock
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import api from '../services/api';
import {
  fetchPayrollDetails,
  fetchPayrollHistory,
  addPayrollItem,
  updatePayrollItem,
  deletePayrollItem,
  generatePayroll,
  fetchAdminCalendar,
  addAttendanceComment
} from '../services/payroll.api';

const PayrollAttendancePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('December 2024');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('current');

  const [staffMembers, setStaffMembers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [payrollItems, setPayrollItems] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState({
    staff: false,
    attendance: false,
    payroll: false,
    history: false
  });

  const [editingItem, setEditingItem] = useState(null);
  const [manualBonus, setManualBonus] = useState('0.00');
  const [manualDeduction, setManualDeduction] = useState('0.00');
  const [payrollNotes, setPayrollNotes] = useState('');
  const [adminComment, setAdminComment] = useState('');

  // Format month for API
  const formatMonthKey = (monthString) => {
    const [month, year] = monthString.split(' ');
    return `${month}-${year}`;
  };

  // Fetch all staff members
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(prev => ({ ...prev, staff: true }));
      try {
        const res = await api.get('/staff');
        setStaffMembers(res.data);
        if (res.data.length > 0) {
          setSelectedStaff(res.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(prev => ({ ...prev, staff: false }));
      }
    };
    fetchStaff();
  }, []);

  // Fetch attendance calendar
  useEffect(() => {
    if (!selectedStaff) return;

    const fetchCalendar = async () => {
      setLoading(prev => ({ ...prev, attendance: true }));
      try {
        const monthKey = formatMonthKey(selectedMonth);
        const res = await fetchAdminCalendar(selectedStaff, monthKey);

        const map = {};
        res.data.forEach(r => {
          const day = new Date(r.date).getDate();
          map[day] = r;
        });

        setAttendanceData(map);

        // Calculate monthly summary
        const presentDays = res.data.filter(r => r.status === 'present').length;
        const absentDays = res.data.filter(r => r.status === 'absent').length;
        const leaveDays = res.data.filter(r => r.status === 'leave').length;
        const totalHours = res.data.reduce((sum, r) => sum + (r.totalHours || 0), 0);
        const attendanceRate = Math.round((presentDays / res.data.length) * 100);

        setMonthlySummary({
          totalWorkingDays: res.data.length,
          presentDays,
          leaveDays,
          absentDays,
          lateDays: res.data.filter(r => r.isLate).length,
          attendanceRate,
          totalHours
        });
      } catch (error) {
        console.error('Error fetching attendance calendar:', error);
      } finally {
        setLoading(prev => ({ ...prev, attendance: false }));
      }
    };

    fetchCalendar();
  }, [selectedStaff, selectedMonth]);

  // Fetch payroll details
  useEffect(() => {
    if (!selectedStaff) return;

    const fetchPayroll = async () => {
      setLoading(prev => ({ ...prev, payroll: true }));
      try {
        const monthKey = formatMonthKey(selectedMonth);
        const res = await fetchPayrollDetails(selectedStaff, monthKey);

        setPayroll(res.data);
        setPayrollItems([
          {
            id: 'baseSalary',
            label: 'Base Salary',
            amount: res.data.baseSalary,
            type: 'addition',
            editable: false
          },
          ...res.data.additions.map((a, index) => ({
            ...a,
            id: `addition-${index}`,
            editable: true
          })),
          ...res.data.deductions.map((d, index) => ({
            ...d,
            id: `deduction-${index}`,
            amount: -Math.abs(d.amount),
            editable: true
          }))
        ]);

        setManualBonus(res.data.manualBonus?.toString() || '0.00');
        setManualDeduction(res.data.manualDeduction?.toString() || '0.00');
      } catch (error) {
        console.error('Error fetching payroll:', error);
        setPayroll(null);
        setPayrollItems([]);
      } finally {
        setLoading(prev => ({ ...prev, payroll: false }));
      }
    };

    fetchPayroll();
  }, [selectedStaff, selectedMonth]);

  // Fetch payroll history
  useEffect(() => {
    if (!selectedStaff) return;

    const fetchHistory = async () => {
      setLoading(prev => ({ ...prev, history: true }));
      try {
        const res = await fetchPayrollHistory(selectedStaff);
        setPayrollHistory(res.data);
      } catch (error) {
        console.error('Error fetching payroll history:', error);
        setPayrollHistory([]);
      } finally {
        setLoading(prev => ({ ...prev, history: false }));
      }
    };

    fetchHistory();
  }, [selectedStaff]);

  const calculateNetPayable = () => {
    if (!payroll) return 0;
    const total = payrollItems.reduce((sum, item) => sum + item.amount, 0);
    return total + parseFloat(manualBonus || 0) - parseFloat(manualDeduction || 0);
  };

  const getAttendanceColor = (status) => {
    if (status === 'present') return 'bg-green-500';
    if (status === 'absent') return 'bg-red-500';
    if (status === 'leave') return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const handleDateClick = (date) => {
    const record = attendanceData[date];
    if (record) {
      setSelectedDate(record);
      setAdminComment(record.adminComment || '');
      setShowAttendanceModal(true);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveItem = async (id, newLabel, newAmount) => {
    if (!payroll) return;

    try {
      // Find the actual item in payroll
      const isAddition = id.startsWith('addition-');
      const isDeduction = id.startsWith('deduction-');
      const index = isAddition
        ? parseInt(id.split('-')[1])
        : isDeduction
          ? parseInt(id.split('-')[1])
          : -1;

      if (isAddition && index >= 0) {
        await updatePayrollItem(payroll._id, payroll.additions[index]._id, {
          label: newLabel,
          amount: Math.abs(parseFloat(newAmount))
        });
      } else if (isDeduction && index >= 0) {
        await updatePayrollItem(payroll._id, payroll.deductions[index]._id, {
          label: newLabel,
          amount: Math.abs(parseFloat(newAmount))
        });
      }

      // Refresh payroll data
      const monthKey = formatMonthKey(selectedMonth);
      const res = await fetchPayrollDetails(selectedStaff, monthKey);
      setPayroll(res.data);
    } catch (error) {
      console.error('Error updating payroll item:', error);
      alert('Failed to update payroll item');
    }

    setEditingItem(null);
  };

  const handleDeleteItem = async (id) => {
    if (!payroll) return;

    try {
      const isAddition = id.startsWith('addition-');
      const isDeduction = id.startsWith('deduction-');
      const index = isAddition
        ? parseInt(id.split('-')[1])
        : isDeduction
          ? parseInt(id.split('-')[1])
          : -1;

      if (isAddition && index >= 0) {
        await deletePayrollItem(payroll._id, payroll.additions[index]._id);
      } else if (isDeduction && index >= 0) {
        await deletePayrollItem(payroll._id, payroll.deductions[index]._id);
      }

      // Refresh payroll data
      const monthKey = formatMonthKey(selectedMonth);
      const res = await fetchPayrollDetails(selectedStaff, monthKey);
      setPayroll(res.data);
    } catch (error) {
      console.error('Error deleting payroll item:', error);
      alert('Failed to delete payroll item');
    }
  };

  const addNewPayrollItem = async (type) => {
    if (!payroll) {
      alert('Please generate payroll first');
      return;
    }

    try {
      await addPayrollItem(payroll._id, {
        label: type === 'addition' ? 'New Addition' : 'New Deduction',
        amount: 0,
        type: type
      });

      // Refresh payroll data
      const monthKey = formatMonthKey(selectedMonth);
      const res = await fetchPayrollDetails(selectedStaff, monthKey);
      setPayroll(res.data);
    } catch (error) {
      console.error('Error adding payroll item:', error);
      alert('Failed to add payroll item');
    }
  };

  const handleGeneratePayroll = async () => {
    if (!selectedStaff) {
      alert('Please select a staff member');
      return;
    }

    try {
      const monthKey = formatMonthKey(selectedMonth);
      await generatePayroll(selectedStaff, monthKey);
      alert('Payroll generated successfully!');

      // Refresh payroll data
      const res = await fetchPayrollDetails(selectedStaff, monthKey);
      setPayroll(res.data);
    } catch (error) {
      console.error('Error generating payroll:', error);
      alert(error.response?.data?.message || 'Failed to generate payroll');
    }
  };

  const handleSaveComment = async () => {
    if (!selectedDate) return;

    try {
      await addAttendanceComment(selectedDate._id, adminComment);
      alert('Comment saved successfully');
      setShowAttendanceModal(false);

      // Refresh attendance data
      const monthKey = formatMonthKey(selectedMonth);
      const res = await fetchAdminCalendar(selectedStaff, monthKey);
      const map = {};
      res.data.forEach(r => {
        const day = new Date(r.date).getDate();
        map[day] = r;
      });
      setAttendanceData(map);
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to save comment');
    }
  };

  const handleExport = async (type) => {
    try {
      const monthKey = formatMonthKey(selectedMonth);
      const response = await api.get(`/attendance/export/${monthKey}/${type}`, {
        responseType: 'blob',
        params: { staffId: selectedStaff }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${monthKey}_${new Date().toISOString().split('T')[0]}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert(`${type.toUpperCase()} export completed!`);
    } catch (err) {
      alert(`Failed to export ${type}: ${err.response?.data?.message || err.message}`);
    }
  };

  // Generate calendar
  const daysInMonth = 31;
  const firstDayOfWeek = 0;
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

  return (
    <div className="flex h-screen bg-[#D2EAF4]">

      {/* Replaced Manual Sidebar with Component */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Payroll & Attendance</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome back,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Dr. Admin</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  DA
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
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
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      // Previous month logic
                      const [month, year] = selectedMonth.split(' ');
                      const date = new Date(`${month} 1, ${year}`);
                      date.setMonth(date.getMonth() - 1);
                      setSelectedMonth(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  >
                    <option>December 2024</option>
                    <option>November 2024</option>
                    <option>October 2024</option>
                  </select>
                  <button
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      // Next month logic
                      const [month, year] = selectedMonth.split(' ');
                      const date = new Date(`${month} 1, ${year}`);
                      date.setMonth(date.getMonth() + 1);
                      setSelectedMonth(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
                    }}
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
                >
                  <Download size={18} />
                  <span>Export</span>
                </button>
                {showExportDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      Export Attendance (Excel)
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      Export Payroll (PDF)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TODAY'S ATTENDANCE CARD - ADMIN VIEW ONLY */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Overview</h3>
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Current Time: {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              <div className="bg-[#D2EAF4] rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Admin View</p>
                    <p className="text-xs text-gray-600">This panel shows attendance and payroll overview for selected staff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedMonth} Attendance</h2>

              {loading.attendance ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
                </div>
              ) : (
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
                            onClick={() => day && handleDateClick(day)}
                            className={`relative aspect-square border rounded-lg flex flex-col items-center justify-center ${day && attendanceData[day] ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'} ${day === new Date().getDate() && selectedMonth.includes(new Date().getFullYear().toString()) ? 'ring-2 ring-[#246e72]' : ''}`}
                          >
                            {day && (
                              <>
                                <span className="text-sm font-medium text-gray-700">{day}</span>
                                {attendanceData[day] && (
                                  <div
                                    className={`w-2 h-2 rounded-full mt-1 ${getAttendanceColor(attendanceData[day].status)}`}
                                    title={attendanceData[day].status}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        ))}
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
                        <span className="text-gray-600">Approved Leave</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Summary</h3>
                {loading.attendance ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]"></div>
                  </div>
                ) : monthlySummary ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Working Days</span>
                      <span className="text-lg font-bold text-gray-800">{monthlySummary.totalWorkingDays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Present Days</span>
                      <span className="text-lg font-bold text-green-600">{monthlySummary.presentDays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Approved Leaves</span>
                      <span className="text-lg font-bold text-yellow-600">{monthlySummary.leaveDays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absent Days</span>
                      <span className="text-lg font-bold text-red-600">{monthlySummary.absentDays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Late Arrivals</span>
                      <span className="text-lg font-bold text-orange-600">{monthlySummary.lateDays}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                        <span className="text-lg font-bold text-[#246e72]">{monthlySummary.attendanceRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] h-2 rounded-full"
                          style={{ width: `${monthlySummary.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No summary data available
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Alerts and Notifications</h3>
                <div className="space-y-3">
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="text-red-600 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Missing Punch Records</p>
                        <p className="text-xs text-gray-600">Check for missing punch out records</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Hours Requirement</p>
                        <p className="text-xs text-gray-600">Monitor monthly hours completion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payroll Calculation - {selectedMonth}</h2>
            {loading.payroll ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#246e72]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Breakdown</h3>
                  <div className="space-y-3">
                    {payrollItems.map(item => (
                      <div key={item.id}>
                        {editingItem?.id === item.id ? (
                          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            <input
                              type="text"
                              defaultValue={item.label}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                              id={`label-${item.id}`}
                            />
                            <input
                              type="number"
                              step="0.01"
                              defaultValue={Math.abs(item.amount)}
                              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                              id={`amount-${item.id}`}
                            />
                            <button
                              onClick={() => {
                                const newLabel = document.getElementById(`label-${item.id}`).value;
                                const newAmount = document.getElementById(`amount-${item.id}`).value;
                                handleSaveItem(item.id, newLabel, item.type === 'deduction' ? -Math.abs(newAmount) : Math.abs(newAmount));
                              }}
                              className="px-3 py-1 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 text-xs font-medium"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.amount >= 0 ? '+' : ''}{item.amount.toFixed(2)}
                              </span>
                              {item.editable && (
                                <>
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => addNewPayrollItem('addition')}
                        className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        + Add Addition
                      </button>
                      <button
                        onClick={() => addNewPayrollItem('deduction')}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        + Add Deduction
                      </button>
                    </div>

                    <div className="pt-4 border-t-2 border-gray-300 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Net Payable Amount</span>
                        <span className="text-2xl font-bold text-[#246e72]">
                          ₹{calculateNetPayable().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Payroll Actions</h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleGeneratePayroll}
                      className="w-full bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <FileText size={20} />
                      <span>Generate Salary Slip</span>
                    </button>

                    <button
                      onClick={() => {
                        // Download payslip logic
                        alert('Download functionality will be implemented');
                      }}
                      className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Download size={20} />
                      <span>Download Payslip (PDF)</span>
                    </button>

                    <button
                      onClick={() => {
                        // View history logic
                        alert('View salary history');
                      }}
                      className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Eye size={20} />
                      <span>View Salary History</span>
                    </button>

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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Past Payroll Records</h2>
              <button
                className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
                onClick={() => alert('Export all functionality will be implemented')}
              >
                Export All
              </button>
            </div>

            {loading.history ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Month</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Generated Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Net Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollHistory.map(record => (
                      <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-700">{record.month}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {new Date(record.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-800">₹{record.netAmount?.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.netAmount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {record.netAmount > 0 ? 'Generated' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => alert('View details')}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="p-2 text-[#246e72] hover:bg-teal-50 rounded-lg transition-colors"
                              onClick={() => alert('Download')}
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {payrollHistory.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No payroll records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showAttendanceModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Attendance Details - {new Date(selectedDate.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#D2EAF4] rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-800 capitalize">{selectedDate.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Punch In:</span>
                    <span className="font-medium text-gray-800">
                      {selectedDate.punchInTime
                        ? new Date(selectedDate.punchInTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : '--:-- --'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Punch Out:</span>
                    <span className="font-medium text-gray-800">
                      {selectedDate.punchOutTime
                        ? new Date(selectedDate.punchOutTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : '--:-- --'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-medium text-gray-800">
                      {selectedDate.totalHours
                        ? `${Math.floor(selectedDate.totalHours)}h ${Math.round((selectedDate.totalHours % 1) * 60)}m`
                        : '0h 0m'
                      }
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
    </div>
  );
};

export default PayrollAttendancePage;
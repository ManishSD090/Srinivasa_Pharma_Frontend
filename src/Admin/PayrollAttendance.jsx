import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Download, 
  X, AlertCircle, Eye, FileText, 
<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
  Edit2, Trash2, Menu, CheckCircle, Clock 
=======
  Edit2, Trash2, Menu 
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PayrollAttendancePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('December 2024');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('current');
<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
  
  // --- NEW: State for Punch In/Out Button ---
  const [isPunchedIn, setIsPunchedIn] = useState(true); 
  
=======
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
  const navigate = useNavigate();

  const [payrollItems, setPayrollItems] = useState([
    { id: 1, label: 'Base Salary', amount: 3500.00, type: 'addition', editable: false },
    { id: 2, label: 'Overtime', amount: 0, type: 'addition', editable: true },
    { id: 3, label: 'Advances Taken', amount: 0, type: 'deduction', editable: true },
  ]);

  const [editingItem, setEditingItem] = useState(null);
  const [manualBonus, setManualBonus] = useState('0.00');
  const [manualDeduction, setManualDeduction] = useState('0.00');
  const [payrollNotes, setPayrollNotes] = useState('');

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard'},
    { name: 'Order Management', path: '/admin/orders' },
    { name: 'Inventory Checklist', path: '/admin/inventory' },
    { name: 'Staff Management', path: '/admin/staff' },
    { name: 'Task Management', path: '/admin/tasks' },
    { name: 'Payroll & Attendance', path: '/admin/payroll' },
    { name: 'Logout', path: '/' }
  ];

  const staffMembers = [
<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
=======
    { id: 'all', name: 'All Staff Members' },
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
    { id: '1', name: 'Dr. Sarah Johnson' },
    { id: '2', name: 'Pharmacist Mike Chen' },
    { id: '3', name: 'Tech Assistant Lisa Park' }
  ];

  const attendanceData = {
    1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present', 6: 'present', 7: 'present',
    8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present', 13: 'present', 14: 'absent',
    15: 'present', 16: 'present', 17: 'present', 18: 'present', 19: 'leave', 20: 'present', 21: 'present',
    22: 'absent', 23: 'present', 24: 'present', 25: 'present', 26: 'present', 27: 'present', 28: 'absent'
  };

  const payrollHistory = [
    { id: 1, month: 'November 2024', generatedDate: 'Dec 1, 2024', netAmount: 3245.00, status: 'Paid' },
    { id: 2, month: 'October 2024', generatedDate: 'Nov 1, 2024', netAmount: 3450.00, status: 'Paid' },
    { id: 3, month: 'September 2024', generatedDate: 'Oct 1, 2024', netAmount: 3180.00, status: 'Unpaid' }
  ];

  const calculateNetPayable = () => {
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
    if (attendanceData[date]) {
      setSelectedDate(date);
      setShowAttendanceModal(true);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveItem = (id, newLabel, newAmount) => {
    setPayrollItems(payrollItems.map(item => 
      item.id === id ? { ...item, label: newLabel, amount: parseFloat(newAmount) } : item
    ));
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    setPayrollItems(payrollItems.filter(item => item.id !== id));
  };

<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
  // --- NEW: Handler for Punch In/Out ---
  const handlePunchInOut = () => {
    setIsPunchedIn(!isPunchedIn);
  };

=======
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
  const addNewPayrollItem = (type) => {
    const newItem = {
      id: Date.now(),
      label: type === 'addition' ? 'New Addition' : 'New Deduction',
      amount: 0,
      type: type,
      editable: true
    };
    setPayrollItems([...payrollItems, newItem]);
<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
    setEditingItem(newItem);
  };

  const daysInMonth = 31;
  const firstDayOfWeek = 0;
=======
    setEditingItem(newItem); // Automatically edit the new item
  };

  const daysInMonth = 31;
  const firstDayOfWeek = 0; // Assuming Sunday is the first day (0)
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
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
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-none z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#246e72] font-bold text-xl">
                M
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Srinivasa Pharma</h1>
                <p className="text-xs text-white">Admin Panel</p>
              </div>
            </div>
            <button
              className="lg:hidden text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
                ${item.path === '/admin/payroll'
=======
                ${item.path === '/admin/payroll' // Hardcoded for this example
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
                  ? 'bg-teal-50 text-[#246e72] font-medium'
                  : 'text-white hover:bg-gray-50 hover:text-[#246e72] font-medium'
                }
              `}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

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
                <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
                  {staffMembers.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><ChevronLeft size={20} /></button>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
                    <option>December 2024</option>
                    <option>November 2024</option>
                    <option>October 2024</option>
                  </select>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="flex items-end space-x-2">
                <button onClick={() => setActiveFilter('current')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === 'current' ? 'bg-[#246e72] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Current Month</button>
                <button onClick={() => setActiveFilter('last')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === 'last' ? 'bg-[#246e72] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Last Month</button>
              </div>

              <div className="flex items-end relative">
                <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="w-full bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2">
                  <Download size={18} />
                  <span>Export</span>
                </button>
                {showExportDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export Attendance (Excel)</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export Payroll (PDF)</button>
                  </div>
                )}
              </div>
            </div>
          </div>

<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
                        {/* --- UPDATED TODAY'S ATTENDANCE CARD WITH BUTTON --- */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance</h3>
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-1">Monday, January 15, 2025</p>
                  <p className="text-sm text-gray-500 mb-4">Current Time: 02:45 PM</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPunchedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {isPunchedIn ? 'Punched In' : 'Punched Out'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Punch In:</span>
                      <span className="text-sm font-semibold text-gray-800">08:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Punch Out:</span>
                      <span className="text-sm font-semibold text-gray-800">{isPunchedIn ? '--:-- --' : '06:00 PM'}</span>
                    </div>
                  </div>

                  {/* --- NEW BUTTON HERE --- */}
                  <button
                    onClick={handlePunchInOut}
                    className="w-full bg-[#246e72] text-white py-3 rounded-lg hover:bg-[#1a5256] transition-colors font-medium mb-6"
                  >
                    {isPunchedIn ? 'Punch Out' : 'Punch In'}
                  </button>
                  {/* ----------------------- */}

                  <div className="mt-2 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Hours Worked Today</p>
                    <p className="text-3xl font-bold text-[#246e72] mb-2">6.75h / 10h</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div className="bg-[#246e72] h-4 rounded-full transition-all duration-300" style={{ width: '68%' }} />
                    </div>
                    <div className="bg-[#D2EAF4] rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-green-600 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">On Track!</p>
                          <p className="text-xs text-gray-600">You've completed 68% of your target hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* --- END UPDATED CARD --- */}

=======
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">December 2024 Attendance</h2>
              
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
                        <div key={dayIndex} onClick={() => day && handleDateClick(day)} className={`relative aspect-square border rounded-lg flex flex-col items-center justify-center ${day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'} ${day === 19 ? 'ring-2 ring-[#246e72]' : ''}`}>
                          {day && (
                            <>
                              <span className="text-sm font-medium text-gray-700">{day}</span>
                              {attendanceData[day] && <div className={`w-2 h-2 rounded-full mt-1 ${getAttendanceColor(attendanceData[day])}`} />}
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
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Total Working Days</span><span className="text-lg font-bold text-gray-800">22</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Present Days</span><span className="text-lg font-bold text-green-600">18</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Approved Leaves</span><span className="text-lg font-bold text-yellow-600">2</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Absent Days</span><span className="text-lg font-bold text-red-600">1</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Late Arrivals</span><span className="text-lg font-bold text-orange-600">3</span></div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                      <span className="text-lg font-bold text-[#246e72]">91%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] h-2 rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Alerts and Notifications</h3>
                <div className="space-y-3">
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="text-red-600 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Missing Punch Records</p>
                        <p className="text-xs text-gray-600">Dec 10, 15 - No punch out recorded</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Hours Requirement</p>
                        <p className="text-xs text-gray-600">160 hrs required, 148 hrs completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payroll Calculation - December 2024</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Salary Breakdown</h3>
                <div className="space-y-3">
                  {payrollItems.map(item => (
                    <div key={item.id}>
                      {editingItem?.id === item.id ? (
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <input type="text" defaultValue={item.label} className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" id={`label-${item.id}`} />
                          <input type="number" step="0.01" defaultValue={Math.abs(item.amount)} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" id={`amount-${item.id}`} />
                          <button onClick={() => {
                            const newLabel = document.getElementById(`label-${item.id}`).value;
                            const newAmount = document.getElementById(`amount-${item.id}`).value;
                            handleSaveItem(item.id, newLabel, item.type === 'deduction' ? -Math.abs(newAmount) : Math.abs(newAmount));
                          }} className="px-3 py-1 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 text-xs font-medium">Save</button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-semibold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>{item.amount >= 0 ? '+' : ''}{item.amount.toFixed(2)}</span>
                            {item.editable && (
                              <>
                                <button onClick={() => handleEditItem(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={14} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex space-x-2 mt-4">
                    <button onClick={() => addNewPayrollItem('addition')} className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">+ Add Addition</button>
                    <button onClick={() => addNewPayrollItem('deduction')} className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">+ Add Deduction</button>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-300 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Net Payable Amount</span>
                      <span className="text-2xl font-bold text-[#246e72]">₹{calculateNetPayable().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Payroll Actions</h3>
                <div className="space-y-4">
                  <button className="w-full bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2">
                    <FileText size={20} />
                    <span>Generate Salary Slip</span>
                  </button>
                  
                  <button className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center space-x-2">
                    <Download size={20} />
                    <span>Download Payslip (PDF)</span>
                  </button>

                  <button className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2">
                    <Eye size={20} />
                    <span>View Salary History</span>
                  </button>

                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Manual Adjustments</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Additional Bonus</label>
                        <input type="number" step="0.01" value={manualBonus} onChange={(e) => setManualBonus(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Additional Deduction</label>
                        <input type="number" step="0.01" value={manualDeduction} onChange={(e) => setManualDeduction(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Notes</label>
                        <textarea value={payrollNotes} onChange={(e) => setPayrollNotes(e.target.value)} placeholder="Add notes for adjustments..." rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Past Payroll Records</h2>
              <button className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 text-sm font-medium">Export All</button>
            </div>

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
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-700">{record.month}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{record.generatedDate}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-800">₹{record.netAmount.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button>
                          <button className="p-2 text-[#246e72] hover:bg-teal-50 rounded-lg transition-colors"><Download size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Attendance Details - Dec {selectedDate}</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#D2EAF4] rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Status:</span><span className="font-medium text-gray-800 capitalize">{attendanceData[selectedDate]}</span></div>
<<<<<<< HEAD:src/Admin/PayrollAttendance.jsx
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Punch In:</span><span className="font-medium text-gray-800">09:05 AM</span></div>
=======
	                <div className="flex justify-between text-sm"><span className="text-gray-600">Punch In:</span><span className="font-medium text-gray-800">09:05 AM</span></div>
>>>>>>> 723e05b51ca56d2a79566e217833e91ab777f44c:frontend/src/Admin/PayrollAttendance.jsx
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Punch Out:</span><span className="font-medium text-gray-800">06:15 PM</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Total Hours:</span><span className="font-medium text-gray-800">9 hours 10 mins</span></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Comment</label>
                <textarea placeholder="Add your comment..." rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none resize-none" />
              </div>

              <button onClick={() => setShowAttendanceModal(false)} className="w-full bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium">Save Comment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollAttendancePage;
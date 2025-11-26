import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Download, X, 
  Clock, Calendar, Coffee, Briefcase, 
  Menu, CheckCircle, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffAttendance = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const navigate = useNavigate();

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/staff/dashboard' },
    { name: 'Orders', path: '/staff/orders' },
    { name: 'Inventory', path: '/staff/inventory' },
    { name: 'Tasks', path: '/staff/tasks' },
    { name: 'Attendance', path: '/staff/attendance' },
    { name: 'Leaves', path: '/staff/leaves' },
    { name: 'Logout', path: '/' }
  ];

  // Today's attendance data
  const todayAttendance = {
    date: 'Monday, January 15, 2025',
    currentTime: '02:45 PM',
    punchInTime: '08:00 AM',
    punchOutTime: isPunchedIn ? '--:-- --' : '06:00 PM',
    hoursWorked: 6.75,
    targetHours: 10,
    status: 'Punched In'
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

  // Handlers
  const handlePunchInOut = () => {
    setIsPunchedIn(!isPunchedIn);
    console.log(isPunchedIn ? 'Punching Out' : 'Punching In');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Calendar grid generation
  const daysInMonth = 31;
  const firstDayOfWeek = 3; // Wednesday for Jan 1, 2025
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

  // Utility functions
  const getAttendanceDot = (status) => {
    const styles = {
      'present': 'bg-green-500',
      'absent': 'bg-red-500',
      'leave': 'bg-yellow-500',
      'halfday': 'bg-orange-500'
    };
    return styles[status] || 'bg-gray-300';
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Present': 'bg-green-100 text-green-700',
      'Absent': 'bg-red-100 text-red-700',
      'On Leave': 'bg-yellow-100 text-yellow-700',
      'Half Day': 'bg-orange-100 text-orange-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-none z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#246e72] font-bold text-xl">
                S
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Srinivasa Pharma</h1>
                <p className="text-xs text-white">Staff Portal</p>
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
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${window.location.pathname === item.path
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
              <h2 className="text-2xl font-bold text-white">Attendance</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Dr. Sarah Johnson</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  SJ
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">

          {/* === RESPONSIVE GRID WRAPPER (Change 1) === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Today's Attendance */}
           {/* Today's Attendance */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance</h3>
              
              {/* This wrapper is no longer a grid */}
              <div>
                {/* Punch In Details Section */}
                <div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">{todayAttendance.date}</p>
                  <p className="text-sm text-gray-500 mb-4">Current Time: {todayAttendance.currentTime}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPunchedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {isPunchedIn ? 'Punched In' : 'Punched Out'}
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
                    onClick={handlePunchInOut}
                    className="w-full bg-[#246e72] text-white py-3 rounded-lg hover:bg-[#1a5256] transition-colors font-medium"
                  >
                    {isPunchedIn ? 'Punch Out' : 'Punch In'}
                  </button>
                </div>

                {/* Hours Worked Section (Now full-width below) */}
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
            </div>

            {/* Attendance Calendar */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Attendance Calendar</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">{selectedMonth}</span>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

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
            </div>
          </div>
          {/* === END RESPONSIVE GRID WRAPPER === */}


          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
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
            {/* === RESPONSIVE HEADER (Change 2) === */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">Attendance History</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm w-full sm:w-auto"
                >
                  <option>January 2025</option>
                  <option>December 2024</option>
                  <option>November 2024</option>
                </select>

                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm w-full sm:w-auto"
                >
                  <option value={10}>Show 10</option>
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>

                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 w-full justify-center sm:w-auto"
                  >
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  
                  {showExportDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Export as Excel
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Export as PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* === END RESPONSIVE HEADER === */}


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
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffAttendance;
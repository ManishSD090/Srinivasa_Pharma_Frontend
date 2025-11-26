import React, { useState } from 'react';
import { 
  ClipboardCheck, Clock, Bell, CheckCircle, 
  Menu, X, User, Calendar, 
  Edit, Eye // Added Edit and Eye for task actions
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StaffDashboard = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Dashboard Stats
  const statsCards = [
    { 
      title: 'Tasks Assigned Today', 
      value: '8', 
      icon: ClipboardCheck,
      color: 'text-[#246e72]'
    },
    { 
      title: 'Tasks Completed', 
      value: '5', 
      icon: CheckCircle,
      color: 'text-[#246e72]'
    },
    { 
      title: 'Hours Worked Today', 
      value: '6.5', 
      icon: Clock,
      color: 'text-[#246e72]'
    },
    { 
      title: 'Pending Reminders', 
      value: '3', 
      icon: Bell,
      color: 'text-[#246e72]'
    }
  ];

  // Tasks Data
  const tasks = [
    { id: 1, title: 'Inventory Stock Check', priority: 'High', dueDate: 'Today, 5:00 PM', status: 'In Progress' },
    { id: 2, title: 'Process Customer Orders', priority: 'Medium', dueDate: 'Today, 6:30 PM', status: 'Completed' },
    { id: 3, title: 'Update Medicine Database', priority: 'Low', dueDate: 'Tomorrow, 2:00 PM', status: 'Pending' },
    { id: 4, title: 'Prepare Monthly Report', priority: 'Medium', dueDate: 'Dec 28, 2024', status: 'In Progress' }
  ];

  // Attendance Data
  const attendance = {
    punchInTime: '09:00 AM',
    punchOutTime: 'Not Yet',
    hoursWorked: 6.5,
    totalHours: 10
  };

  // Reminders
  const reminders = [
    { type: 'urgent', title: 'Urgent Task Due', description: 'Inventory Stock Check due in 2 hours', time: 'Overdue by 2 days', bgColor: 'bg-yellow-50', borderColor: 'border-l-yellow-500', icon: '⚠️' },
    { type: 'alert', title: 'Hours Alert', description: '3.5 hours remaining to complete shift', time: 'Due in 3 days', bgColor: 'bg-red-50', borderColor: 'border-l-red-500', icon: '🔴' },
    { type: 'info', title: 'Meeting Reminder', description: 'Team sync at 4:00 PM today', time: 'Tomorrow 10:00 AM', bgColor: 'bg-teal-50', borderColor: 'border-l-teal-500', icon: '📋' }
  ];

  // Notifications
  const notifications = [
    { id: 1, message: 'New task assigned by Admin', time: '2 hours ago' },
    { id: 2, message: 'Leave request approved', time: '5 hours ago' },
    { id: 3, message: 'Shift schedule updated', time: 'Yesterday' },
    { id: 4, message: 'Monthly performance review available', time: '2 days ago' }
  ];

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

  // Handlers
  const handlePunchInOut = () => {
    setIsPunchedIn(!isPunchedIn);
    console.log(isPunchedIn ? 'Punching Out' : 'Punching In');
  };

  const handleViewTask = (task) => {
    console.log('Viewing task:', task);
  };

  const handleUpdateTask = (task) => {
    console.log('Updating task:', task);
  };

  // Use navigate hook for navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Utility functions
  const getPriorityStyle = (priority) => {
    const styles = { 'High': 'bg-red-100 text-red-700', 'Medium': 'bg-yellow-100 text-yellow-700', 'Low': 'bg-blue-100 text-blue-700' };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusStyle = (status) => {
    const styles = { 'Pending': 'bg-gray-100 text-gray-700', 'In Progress': 'bg-yellow-100 text-yellow-700', 'Completed': 'bg-green-100 text-green-700' };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div id='dashboard' className="flex h-screen bg-[#D2EAF4]">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-none z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button 
                className="lg:hidden text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Staff Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  SJ
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statsCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg bg-teal-50 ${card.color}`}>
                    <card.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* My Tasks Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ClipboardCheck size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">My Tasks</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TASK TITLE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRIORITY</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DUE DATE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{task.dueDate}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      {/* === TASK ACTIONS BUTTONS === */}
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewTask(task)}
                            title="View Details"
                            className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateTask(task)}
                            title="Update Status"
                            className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                      {/* ========================== */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Snapshot */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <User size={18} className="text-[#246e72]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Attendance Snapshot</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Punch In</p>
                    <p className="text-lg font-bold text-gray-800">{attendance.punchInTime}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Punch Out</p>
                    <p className="text-lg font-bold text-gray-800">{attendance.punchOutTime}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock className="text-gray-600" size={20} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Hours Progress</span>
                    <span className="font-semibold text-gray-800">{attendance.hoursWorked} / {attendance.totalHours} hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-[#246e72] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(attendance.hoursWorked / attendance.totalHours) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handlePunchInOut}
                  className="w-full bg-[#246e72] text-white py-3 rounded-lg hover:bg-[#1a5256] transition-colors font-medium"
                >
                  {isPunchedIn ? 'Punch Out Now' : 'Punch In Now'}
                </button>
              </div>
            </div>

            {/* Reminders & Alerts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Bell size={18} className="text-[#246e72]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Reminders & Alerts</h3>
              </div>
              
              <div className="space-y-4">
                {reminders.map((reminder, index) => (
                  <div 
                    key={index} 
                    className={`${reminder.bgColor} border-l-4 ${reminder.borderColor} rounded-lg p-4`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{reminder.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{reminder.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Bell size={18} className="text-[#246e72]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                </div>
                <div className="w-6 h-6 bg-[#246e72] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {notifications.length}
                </div>
              </div>

              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="bg-[#D2EAF4] rounded-lg p-3">
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-[#246e72] hover:text-[#1a5256] text-sm font-medium text-center">
                View All Notifications
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2">
                <ClipboardCheck size={18} />
                <span>View All Tasks</span>
              </button>
              <button className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2">
                <Calendar size={18} />
                <span>Apply for Leave</span>
              </button>
              <button className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2">
                <Clock size={18} />
                <span>Attendance History</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;
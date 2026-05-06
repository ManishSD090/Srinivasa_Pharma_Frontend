import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, Clock, Bell, CheckCircle,
  Calendar,
  Edit, Eye, X, Save, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../authContext';

const StaffDashboard = () => {
  // UI State
  const navigate = useNavigate();

  // --- Modal States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // --- View Modal States ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  // --- Backend Data States ---
  const [dashboardData, setDashboardData] = useState({
    todayStats: {
      tasksAssignedToday: 0,
      tasksCompletedToday: 0,
      hoursWorkedToday: 0,
      hasPunchedIn: false,
      hasPunchedOut: false,
      currentStatus: 'absent'
    },
    overallStats: {
      totalAssignedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0
    },
    recentTasks: []
  });

  const { user: currentUser } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState({
    punchInTime: '--:-- --',
    punchOutTime: '--:-- --',
    hoursWorked: 0,
    totalHours: currentUser?.dailyWorkHrs || 8
  });

  const [notifications, setNotifications] = useState([]);
  const [staffData, setStaffData] = useState({
    name: 'Loading...',
    initials: 'LD'
  });

  const [loading, setLoading] = useState({
    dashboard: false,
    tasks: false,
    attendance: false,
    notifications: false
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading({
        dashboard: true,
        tasks: true,
        attendance: true,
        notifications: true
      });

      // Fetch dashboard stats from the new endpoint
      const dashboardRes = await api.get('/dashboard/stats');
      console.log('Dashboard Data:', dashboardRes.data);

      if (dashboardRes.data.success) {
        const dashboardData = dashboardRes.data.data;
        setDashboardData({
          todayStats: dashboardData.todayStats || {
            tasksAssignedToday: 0,
            tasksCompletedToday: 0,
            hoursWorkedToday: 0,
            hasPunchedIn: false,
            hasPunchedOut: false,
            currentStatus: 'absent'
          },
          overallStats: dashboardData.overallStats || {
            totalAssignedTasks: 0,
            pendingTasks: 0,
            inProgressTasks: 0
          },
          recentTasks: dashboardData.recentTasks || []
        });
      }

      // Fetch tasks
      const tasksRes = await api.get('/tasks');
      console.log('Tasks Data:', tasksRes.data);

      let tasksData = [];
      if (tasksRes.data && Array.isArray(tasksRes.data)) {
        tasksData = tasksRes.data;
      } else if (tasksRes.data && tasksRes.data.data) {
        tasksData = tasksRes.data.data;
      } else if (tasksRes.data && tasksRes.data.tasks) {
        tasksData = tasksRes.data.tasks;
      }

      setTasks(tasksData);
      console.log('Processed tasks:', tasksData.length);

      // Fetch today's attendance
      const attendanceRes = await api.get('/attendance/today');
      console.log('Attendance Data:', attendanceRes.data);

      let attendanceData = {};
      if (attendanceRes.data.success) {
        attendanceData = attendanceRes.data.data || {};
      } else {
        attendanceData = attendanceRes.data || {};
      }

      // Format time for display
      const formatTime = (timeString) => {
        if (!timeString) return '--:-- --';
        const time = new Date(timeString);
        return time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      };

      setAttendance({
        punchInTime: formatTime(attendanceData.sessions?.[0]?.punchIn),
        punchOutTime: formatTime(attendanceData.sessions?.[attendanceData.sessions.length - 1]?.punchOut),
        hoursWorked: attendanceData.hoursWorked || dashboardData.todayStats.hoursWorkedToday || 0,
        totalHours: currentUser?.dailyWorkHrs || 8
      });

      // Fetch notifications (if endpoint exists)
      try {
        const notificationsRes = await api.get('/notifications/staff');
        const notificationsData = notificationsRes.data?.data || notificationsRes.data || [];
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      } catch (error) {
        console.log('Notifications endpoint not available, using empty array');
        setNotifications([]);
      }

      // Fetch staff profile
      try {
        const profileRes = await api.get('/staff/profile');
        const profileData = profileRes.data?.data || profileRes.data || {};
        const staffName = profileData.name || profileData.username || 'Staff Member';
        const initials = staffName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        setStaffData({
          name: staffName,
          initials: initials
        });
      } catch (error) {
        console.log('Profile endpoint not available, using default');
        // Try to get name from localStorage if available
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.name) {
          const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          setStaffData({
            name: userData.name,
            initials: initials
          });
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading({
        dashboard: false,
        tasks: false,
        attendance: false,
        notifications: false
      });
    }
  };

  // Handle punch in/out
  const handlePunchAction = async () => {
    try {
      const attendanceRes = await api.get('/attendance/today');
      const isPunchedIn = attendanceRes.data.isPunchedIn;

      const endpoint = isPunchedIn ? '/attendance/punch-out' : '/attendance/punch-in';
      const response = await api.post(endpoint);

      if (response.data) {
        alert(`Successfully ${!isPunchedIn ? 'punched in' : 'punched out'}!`);
        // Refresh dashboard and attendance data
        await Promise.all([
          fetchDashboardData(),
          api.get('/attendance/today').then(res => {
            const data = res.data || {};
            setAttendance(prev => ({
              ...prev,
              punchInTime: formatTime(data.sessions?.[0]?.punchIn),
              punchOutTime: formatTime(data.sessions?.[data.sessions.length - 1]?.punchOut),
              hoursWorked: data.hoursWorked || 0
            }));
          })
        ]);
      }
    } catch (error) {
      console.error(`Error during punch:`, error);
      alert(`Failed to process punch. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  // Handlers for tasks
  const handleViewTask = (task) => {
    setViewTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (task) => {
    setCurrentTask({ ...task });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveTask = async () => {
    try {
      const response = await api.put(`/tasks/${currentTask._id}`, currentTask);

      if (response.data.success) {
        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(task => (task._id === currentTask._id ? response.data.task : task))
        );

        setIsEditModalOpen(false);
        setCurrentTask(null);
        alert('Task updated successfully!');

        // Refresh dashboard stats
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      // Use the status change request endpoint if available, otherwise direct update
      const endpoint = `/tasks/${taskId}/request-status`;
      const response = await api.post(endpoint, {
        status: newStatus,
        reason: `Status changed to ${newStatus} via dashboard`
      });

      if (response.data.success) {
        // Update local state temporarily
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );

        alert('Status change request submitted! Waiting for admin approval.');

        // Refresh dashboard stats
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      // Try direct update if request-status endpoint fails
      try {
        const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
        if (response.data.success) {
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task._id === taskId ? { ...task, status: newStatus } : task
            )
          );
          await fetchDashboardData();
        }
      } catch (directError) {
        alert('Failed to update task status. Please try again.');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      // Remove from local state
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Utility functions
  const getPriorityStyle = (priority) => {
    const styles = {
      'High': 'bg-red-100 text-red-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'Low': 'bg-blue-100 text-blue-700'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Not Started': 'bg-gray-100 text-gray-700',
      'Pending': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-green-100 text-green-700',
      'Overdue': 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Stats Cards Data - Updated to use dashboardData
  const statsCards = [
    {
      title: 'Tasks Assigned Today',
      value: dashboardData.todayStats.tasksAssignedToday.toString(),
      icon: ClipboardCheck,
      color: 'text-[#246e72]',
      loading: loading.dashboard
    },
    {
      title: 'Tasks Completed Today',
      value: dashboardData.todayStats.tasksCompletedToday.toString(),
      icon: CheckCircle,
      color: 'text-[#246e72]',
      loading: loading.dashboard
    },
    {
      title: 'Hours Worked Today',
      value: dashboardData.todayStats.hoursWorkedToday.toFixed(1),
      icon: Clock,
      color: 'text-[#246e72]',
      loading: loading.dashboard
    }
  ];

  // Use dashboardData.recentTasks if available, otherwise use tasks
  const displayTasks = dashboardData.recentTasks.length > 0 ? dashboardData.recentTasks : tasks;

  return (
    <>
      <div id='dashboard' className="p-4 lg:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {card.loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      card.value
                    )}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg bg-teal-50 ${card.color}`}>
                  <card.icon size={24} />
                </div>
              </div>
              {/* Additional stats for overall view */}
              {index === 0 && (
                <p className="text-xs text-gray-500">
                  Total assigned: {dashboardData.overallStats.totalAssignedTasks}
                </p>
              )}
              {index === 1 && (
                <p className="text-xs text-gray-500">
                  In progress: {dashboardData.overallStats.inProgressTasks}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="lg:grid-cols-2 gap-6">
          {/* Attendance Snapshot */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Clock size={18} className="text-[#246e72]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Attendance Snapshot</h3>
              </div>
            </div>

            {loading.attendance ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Punch In</p>
                    <p className="text-lg font-bold text-gray-800">{attendance.punchInTime}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dashboardData.todayStats.hasPunchedIn ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    {dashboardData.todayStats.hasPunchedIn ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Clock className="text-gray-600" size={20} />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Punch Out</p>
                    <p className="text-lg font-bold text-gray-800">{attendance.punchOutTime}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dashboardData.todayStats.hasPunchedOut ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                    {dashboardData.todayStats.hasPunchedOut ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Clock className="text-gray-600" size={20} />
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Hours Progress</span>
                    <span className="font-semibold text-gray-800">
                      {dashboardData.todayStats.hoursWorkedToday.toFixed(1)} / {attendance.totalHours} hrs
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#246e72] h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (dashboardData.todayStats.hoursWorkedToday / attendance.totalHours) * 100,
                          100
                        )}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current status: <span className="font-medium capitalize">{dashboardData.todayStats.currentStatus}</span>
                  </p>
                  {/* <button
                    onClick={handlePunchAction}
                    disabled={loading.attendance}
                    className={`w-full mt-4 py-2 rounded-lg font-medium text-sm transition-colors ${attendance.punchInTime !== '--:-- --' && attendance.punchOutTime === '--:-- --'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#246e72] hover:bg-[#1a5256] text-white'
                      } disabled:opacity-50`}
                  >
                    {attendance.punchInTime !== '--:-- --' && attendance.punchOutTime === '--:-- --' ? 'Punch Out' : 'Punch In'}
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/staff/tasks')}
              className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <ClipboardCheck size={18} />
              <span>View All Tasks</span>
            </button>
            <button
              onClick={() => navigate('/staff/leaves')}
              className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Calendar size={18} />
              <span>Apply for Leave</span>
            </button>
            <button
              onClick={() => navigate('/staff/attendance')}
              className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Clock size={18} />
              <span>Attendance History</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Task Preview Modal */}
      {isViewModalOpen && viewTask && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Task Preview</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Title</h4>
                <p className="text-gray-800 font-bold text-xl">{viewTask.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {viewTask.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Priority</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(viewTask.priority)}`}>
                    {viewTask.priority}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Status</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(viewTask.status)}`}>
                    {viewTask.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Due Date</h4>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar size={16} />
                  <span>
                    {viewTask.dueDate ? new Date(viewTask.dueDate).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No due date'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Edit Task</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={currentTask.title || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentTask.description || ''}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={currentTask.priority || 'Medium'}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={currentTask.status || 'Not Started'}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().slice(0, 16) : ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffDashboard;
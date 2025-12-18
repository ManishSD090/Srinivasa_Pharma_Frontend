import React, { useState } from 'react';
import { 
  ClipboardCheck, Clock, Bell, CheckCircle, 
  Menu, User, Calendar, 
  Edit, Eye, X, Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar'; 

const StaffDashboard = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // --- Modal States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // --- NEW: View Modal States ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  // Dashboard Stats
  const statsCards = [
    { title: 'Tasks Assigned Today', value: '8', icon: ClipboardCheck, color: 'text-[#246e72]' },
    { title: 'Tasks Completed', value: '5', icon: CheckCircle, color: 'text-[#246e72]' },
    { title: 'Hours Worked Today', value: '6.5', icon: Clock, color: 'text-[#246e72]' }
  ];

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Inventory Stock Check', description: 'Verify and update stock levels for all medications in storage.', priority: 'High', dueDate: 'Today, 5:00 PM', status: 'In Progress' },
    { id: 2, title: 'Process Customer Orders', description: 'Review pending online orders and pack items for delivery.', priority: 'Medium', dueDate: 'Today, 6:30 PM', status: 'Completed' },
    { id: 3, title: 'Update Medicine Database', description: 'Add new batches of antibiotics received this morning.', priority: 'Low', dueDate: 'Tomorrow, 2:00 PM', status: 'Pending' },
    { id: 4, title: 'Prepare Monthly Report', description: 'Compile sales data for the month of December.', priority: 'Medium', dueDate: 'Dec 28, 2024', status: 'In Progress' }
  ]);

  // Attendance Data (Read Only)
  const attendance = {
    punchInTime: '09:00 AM',
    punchOutTime: '--:-- --',
    hoursWorked: 6.5,
    totalHours: 10
  };

  // Reminders & Notifications
  const reminders = [
    { type: 'urgent', title: 'Urgent Task Due', description: 'Inventory Stock Check due in 2 hours', time: 'Overdue by 2 days', bgColor: 'bg-yellow-50', borderColor: 'border-l-yellow-500', icon: '⚠️' },
    { type: 'alert', title: 'Hours Alert', description: '3.5 hours remaining to complete shift', time: 'Due in 3 days', bgColor: 'bg-red-50', borderColor: 'border-l-red-500', icon: '🔴' },
    { type: 'info', title: 'Meeting Reminder', description: 'Team sync at 4:00 PM today', time: 'Tomorrow 10:00 AM', bgColor: 'bg-teal-50', borderColor: 'border-l-teal-500', icon: '📋' }
  ];

  const notifications = [
    { id: 1, message: 'New task assigned by Admin', time: '2 hours ago' },
    { id: 2, message: 'Leave request approved', time: '5 hours ago' },
    { id: 3, message: 'Shift schedule updated', time: 'Yesterday' },
    { id: 4, message: 'Monthly performance review available', time: '2 days ago' }
  ];

  // --- Handlers ---

  // UPDATED: Opens the View Modal instead of alert
  const handleViewTask = (task) => {
    setViewTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (task) => {
    setCurrentTask({ ...task }); // Deep copy
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveTask = () => {
    setTasks(prevTasks => 
      prevTasks.map(task => (task.id === currentTask.id ? currentTask : task))
    );
    setIsEditModalOpen(false);
    setCurrentTask(null);
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
      
      <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-white">Staff Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">SJ</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleViewTask(task)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleEditClick(task)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Snapshot */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><User size={18} className="text-[#246e72]" /></div>
                <h3 className="text-lg font-bold text-gray-800">Attendance Snapshot</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div><p className="text-sm text-gray-600">Punch In</p><p className="text-lg font-bold text-gray-800">{attendance.punchInTime}</p></div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="text-green-600" size={20} /></div>
                </div>
                <div className="flex justify-between items-center">
                  <div><p className="text-sm text-gray-600">Punch Out</p><p className="text-lg font-bold text-gray-800">{attendance.punchOutTime}</p></div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><Clock className="text-gray-600" size={20} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Hours Progress</span><span className="font-semibold text-gray-800">{attendance.hoursWorked} / {attendance.totalHours} hrs</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-[#246e72] h-3 rounded-full transition-all duration-300" style={{ width: `${(attendance.hoursWorked / attendance.totalHours) * 100}%` }} /></div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><Bell size={18} className="text-[#246e72]" /></div>
                  <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                </div>
                <div className="w-6 h-6 bg-[#246e72] rounded-full flex items-center justify-center text-white text-xs font-bold">{notifications.length}</div>
              </div>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="bg-[#D2EAF4] rounded-lg p-3">
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-[#246e72] hover:text-[#1a5256] text-sm font-medium text-center">View All Notifications</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => navigate('/staff/tasks')} className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"><ClipboardCheck size={18} /><span>View All Tasks</span></button>
              <button onClick={() => navigate('/staff/leaves')} className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"><Calendar size={18} /><span>Apply for Leave</span></button>
              <button onClick={() => navigate('/staff/attendance')} className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"><Clock size={18} /><span>Attendance History</span></button>
            </div>
          </div>
        </main>
      </div>

      {/* --- NEW: View Task Preview Modal --- */}
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
                  <span>{viewTask.dueDate}</span>
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

      {/* --- Edit Task Modal --- */}
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
                  value={currentTask.title} 
                  onChange={handleEditChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    name="priority" 
                    value={currentTask.priority} 
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
                    value={currentTask.status} 
                    onChange={handleEditChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="text" 
                  name="dueDate" 
                  value={currentTask.dueDate} 
                  onChange={handleEditChange} 
                  placeholder="e.g. Today, 5:00 PM"
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
    </div>
  );
};

export default StaffDashboard;
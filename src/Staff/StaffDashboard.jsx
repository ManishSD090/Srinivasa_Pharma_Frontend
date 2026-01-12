// // import React, { useState } from 'react';
// // import {
// //   ClipboardCheck, Clock, Bell, CheckCircle,
// //   Menu, User, Calendar,
// //   Edit, Eye, X, Save
// // } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';
// // import StaffSidebar from './StaffSidebar';

// // const StaffDashboard = () => {
// //   // UI State
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const navigate = useNavigate();

// //   // --- Modal States ---
// //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// //   const [currentTask, setCurrentTask] = useState(null);

// //   // --- NEW: View Modal States ---
// //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
// //   const [viewTask, setViewTask] = useState(null);

// //   // Dashboard Stats
// //   const statsCards = [
// //     { title: 'Tasks Assigned Today', value: '8', icon: ClipboardCheck, color: 'text-[#246e72]' },
// //     { title: 'Tasks Completed', value: '5', icon: CheckCircle, color: 'text-[#246e72]' },
// //     { title: 'Hours Worked Today', value: '6.5', icon: Clock, color: 'text-[#246e72]' }
// //   ];

// //   // Tasks State
// //   const [tasks, setTasks] = useState([
// //     { id: 1, title: 'Inventory Stock Check', description: 'Verify and update stock levels for all medications in storage.', priority: 'High', dueDate: 'Today, 5:00 PM', status: 'In Progress' },
// //     { id: 2, title: 'Process Customer Orders', description: 'Review pending online orders and pack items for delivery.', priority: 'Medium', dueDate: 'Today, 6:30 PM', status: 'Completed' },
// //     { id: 3, title: 'Update Medicine Database', description: 'Add new batches of antibiotics received this morning.', priority: 'Low', dueDate: 'Tomorrow, 2:00 PM', status: 'Pending' },
// //     { id: 4, title: 'Prepare Monthly Report', description: 'Compile sales data for the month of December.', priority: 'Medium', dueDate: 'Dec 28, 2024', status: 'In Progress' }
// //   ]);

// //   // Attendance Data (Read Only)
// //   const attendance = {
// //     punchInTime: '09:00 AM',
// //     punchOutTime: '--:-- --',
// //     hoursWorked: 6.5,
// //     totalHours: 10
// //   };

// //   // Reminders & Notifications
// //   const reminders = [
// //     { type: 'urgent', title: 'Urgent Task Due', description: 'Inventory Stock Check due in 2 hours', time: 'Overdue by 2 days', bgColor: 'bg-yellow-50', borderColor: 'border-l-yellow-500', icon: '⚠️' },
// //     { type: 'alert', title: 'Hours Alert', description: '3.5 hours remaining to complete shift', time: 'Due in 3 days', bgColor: 'bg-red-50', borderColor: 'border-l-red-500', icon: '🔴' },
// //     { type: 'info', title: 'Meeting Reminder', description: 'Team sync at 4:00 PM today', time: 'Tomorrow 10:00 AM', bgColor: 'bg-teal-50', borderColor: 'border-l-teal-500', icon: '📋' }
// //   ];

// //   const notifications = [
// //     { id: 1, message: 'New task assigned by Admin', time: '2 hours ago' },
// //     { id: 2, message: 'Leave request approved', time: '5 hours ago' },
// //     { id: 3, message: 'Shift schedule updated', time: 'Yesterday' },
// //     { id: 4, message: 'Monthly performance review available', time: '2 days ago' }
// //   ];

// //   // --- Handlers ---

// //   // UPDATED: Opens the View Modal instead of alert
// //   const handleViewTask = (task) => {
// //     setViewTask(task);
// //     setIsViewModalOpen(true);
// //   };

// //   const handleEditClick = (task) => {
// //     setCurrentTask({ ...task }); // Deep copy
// //     setIsEditModalOpen(true);
// //   };

// //   const handleEditChange = (e) => {
// //     const { name, value } = e.target;
// //     setCurrentTask(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSaveTask = () => {
// //     setTasks(prevTasks =>
// //       prevTasks.map(task => (task.id === currentTask.id ? currentTask : task))
// //     );
// //     setIsEditModalOpen(false);
// //     setCurrentTask(null);
// //   };

// //   // Utility functions
// //   const getPriorityStyle = (priority) => {
// //     const styles = { 'High': 'bg-red-100 text-red-700', 'Medium': 'bg-yellow-100 text-yellow-700', 'Low': 'bg-blue-100 text-blue-700' };
// //     return styles[priority] || 'bg-gray-100 text-gray-700';
// //   };

// //   const getStatusStyle = (status) => {
// //     const styles = { 'Pending': 'bg-gray-100 text-gray-700', 'In Progress': 'bg-yellow-100 text-yellow-700', 'Completed': 'bg-green-100 text-green-700' };
// //     return styles[status] || 'bg-gray-100 text-gray-700';
// //   };

// //   return (
// //     <div id='dashboard' className="flex h-screen bg-[#D2EAF4]">

// //       <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

// //       {/* Main Content */}
// //       <div className="flex-1 overflow-auto">
// //         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
// //           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
// //             <div className="flex items-center space-x-4">
// //               <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
// //               <h2 className="text-2xl font-bold text-white">Staff Dashboard</h2>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <span className="text-sm text-white hidden sm:block">Welcome,</span>
// //               <div className="flex items-center space-x-2">
// //                 <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
// //                 <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">SJ</div>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         <main className="p-4 lg:p-8 space-y-6">
// //           {/* Stats Cards */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
// //             {statsCards.map((card, index) => (
// //               <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
// //                 <div className="flex items-start justify-between mb-4">
// //                   <div>
// //                     <p className="text-sm text-gray-600 mb-1">{card.title}</p>
// //                     <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
// //                   </div>
// //                   <div className={`p-3 rounded-lg bg-teal-50 ${card.color}`}>
// //                     <card.icon size={24} />
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           {/* My Tasks Section */}
// //           <div className="bg-white rounded-xl shadow-md p-6">
// //             <div className="flex items-center space-x-2 mb-6">
// //               <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
// //                 <ClipboardCheck size={18} className="text-[#246e72]" />
// //               </div>
// //               <h3 className="text-xl font-bold text-gray-800">My Tasks</h3>
// //             </div>

// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead>
// //                   <tr className="border-b border-gray-200">
// //                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TASK TITLE</th>
// //                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRIORITY</th>
// //                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DUE DATE</th>
// //                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
// //                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {tasks.map(task => (
// //                     <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
// //                       <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
// //                       <td className="py-4 px-4">
// //                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
// //                           {task.priority}
// //                         </span>
// //                       </td>
// //                       <td className="py-4 px-4 text-sm text-gray-700">{task.dueDate}</td>
// //                       <td className="py-4 px-4">
// //                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
// //                           {task.status}
// //                         </span>
// //                       </td>
// //                       <td className="py-4 px-4">
// //                         <div className="flex space-x-2">
// //                           <button onClick={() => handleViewTask(task)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center">
// //                             <Eye size={16} />
// //                           </button>
// //                           <button onClick={() => handleEditClick(task)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center">
// //                             <Edit size={16} />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

// //           {/* Bottom Section */}
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //             {/* Attendance Snapshot */}
// //             <div className="bg-white rounded-xl shadow-md p-6">
// //               <div className="flex items-center space-x-2 mb-6">
// //                 <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><User size={18} className="text-[#246e72]" /></div>
// //                 <h3 className="text-lg font-bold text-gray-800">Attendance Snapshot</h3>
// //               </div>
// //               <div className="space-y-4">
// //                 <div className="flex justify-between items-center">
// //                   <div><p className="text-sm text-gray-600">Punch In</p><p className="text-lg font-bold text-gray-800">{attendance.punchInTime}</p></div>
// //                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="text-green-600" size={20} /></div>
// //                 </div>
// //                 <div className="flex justify-between items-center">
// //                   <div><p className="text-sm text-gray-600">Punch Out</p><p className="text-lg font-bold text-gray-800">{attendance.punchOutTime}</p></div>
// //                   <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><Clock className="text-gray-600" size={20} /></div>
// //                 </div>
// //                 <div>
// //                   <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Hours Progress</span><span className="font-semibold text-gray-800">{attendance.hoursWorked} / {attendance.totalHours} hrs</span></div>
// //                   <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-[#246e72] h-3 rounded-full transition-all duration-300" style={{ width: `${(attendance.hoursWorked / attendance.totalHours) * 100}%` }} /></div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Notifications */}
// //             <div className="bg-white rounded-xl shadow-md p-6">
// //               <div className="flex items-center justify-between mb-6">
// //                 <div className="flex items-center space-x-2">
// //                   <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><Bell size={18} className="text-[#246e72]" /></div>
// //                   <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
// //                 </div>
// //                 <div className="w-6 h-6 bg-[#246e72] rounded-full flex items-center justify-center text-white text-xs font-bold">{notifications.length}</div>
// //               </div>
// //               <div className="space-y-3">
// //                 {notifications.map(notification => (
// //                   <div key={notification.id} className="bg-[#D2EAF4] rounded-lg p-3">
// //                     <p className="text-sm text-gray-800">{notification.message}</p>
// //                     <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //               <button className="w-full mt-4 text-[#246e72] hover:text-[#1a5256] text-sm font-medium text-center">View All Notifications</button>
// //             </div>
// //           </div>

// //           {/* Quick Actions */}
// //           <div className="bg-white rounded-xl shadow-md p-6">
// //             <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //               <button onClick={() => navigate('/staff/tasks')} className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"><ClipboardCheck size={18} /><span>View All Tasks</span></button>
// //               <button onClick={() => navigate('/staff/leaves')} className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"><Calendar size={18} /><span>Apply for Leave</span></button>
// //               <button onClick={() => navigate('/staff/attendance')} className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"><Clock size={18} /><span>Attendance History</span></button>
// //             </div>
// //           </div>
// //         </main>
// //       </div>

// //       {/* --- NEW: View Task Preview Modal --- */}
// //       {isViewModalOpen && viewTask && (
// //         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
// //             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
// //               <h3 className="text-lg font-bold text-white">Task Preview</h3>
// //               <button onClick={() => setIsViewModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full">
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             <div className="p-6 space-y-4">
// //               <div>
// //                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Title</h4>
// //                 <p className="text-gray-800 font-bold text-xl">{viewTask.title}</p>
// //               </div>

// //               <div>
// //                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Description</h4>
// //                 <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
// //                   {viewTask.description || "No description provided."}
// //                 </p>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Priority</h4>
// //                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(viewTask.priority)}`}>
// //                     {viewTask.priority}
// //                   </span>
// //                 </div>
// //                 <div>
// //                   <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Status</h4>
// //                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(viewTask.status)}`}>
// //                     {viewTask.status}
// //                   </span>
// //                 </div>
// //               </div>

// //               <div>
// //                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Due Date</h4>
// //                 <div className="flex items-center space-x-2 text-gray-700">
// //                   <Calendar size={16} />
// //                   <span>{viewTask.dueDate}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="bg-gray-50 px-6 py-4 flex justify-end">
// //               <button
// //                 onClick={() => setIsViewModalOpen(false)}
// //                 className="px-6 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* --- Edit Task Modal --- */}
// //       {isEditModalOpen && currentTask && (
// //         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
// //             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
// //               <h3 className="text-lg font-bold text-white">Edit Task</h3>
// //               <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full">
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             <div className="p-6 space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
// //                 <input
// //                   type="text"
// //                   name="title"
// //                   value={currentTask.title}
// //                   onChange={handleEditChange}
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
// //                   <select
// //                     name="priority"
// //                     value={currentTask.priority}
// //                     onChange={handleEditChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// //                   >
// //                     <option value="High">High</option>
// //                     <option value="Medium">Medium</option>
// //                     <option value="Low">Low</option>
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
// //                   <select
// //                     name="status"
// //                     value={currentTask.status}
// //                     onChange={handleEditChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// //                   >
// //                     <option value="Pending">Pending</option>
// //                     <option value="In Progress">In Progress</option>
// //                     <option value="Completed">Completed</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
// //                 <input
// //                   type="text"
// //                   name="dueDate"
// //                   value={currentTask.dueDate}
// //                   onChange={handleEditChange}
// //                   placeholder="e.g. Today, 5:00 PM"
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// //                 />
// //               </div>
// //             </div>

// //             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
// //               <button
// //                 onClick={() => setIsEditModalOpen(false)}
// //                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSaveTask}
// //                 className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
// //               >
// //                 <Save size={18} />
// //                 <span>Save Changes</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default StaffDashboard;

// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   ClipboardCheck, Clock, Bell, CheckCircle,
// // //   Menu, User, Calendar, ArrowUpRight,
// // //   Edit, Eye, X, Save, AlertTriangle
// // // } from 'lucide-react';
// // // import { useNavigate } from 'react-router-dom';
// // // import StaffSidebar from './StaffSidebar';
// // // import api from '../services/api';

// // // const StaffDashboard = () => {
// // //   // UI State
// // //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // //   const navigate = useNavigate();
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [error, setError] = useState('');

// // //   // Modal States
// // //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// // //   const [currentTask, setCurrentTask] = useState(null);
// // //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
// // //   const [viewTask, setViewTask] = useState(null);

// // //   // Dashboard Data States
// // //   const [stats, setStats] = useState({
// // //     tasksAssignedToday: 0,
// // //     tasksCompleted: 0,
// // //     hoursWorkedToday: 0
// // //   });

// // //   const [tasks, setTasks] = useState([]);
// // //   const [attendance, setAttendance] = useState({
// // //     punchInTime: '--:-- --',
// // //     punchOutTime: '--:-- --',
// // //     hoursWorked: 0,
// // //     totalHours: 8
// // //   });

// // //   const [notifications, setNotifications] = useState([]);
// // //   const [reminders, setReminders] = useState([]);

// // //   // Fetch dashboard data on component mount
// // //   useEffect(() => {
// // //     fetchDashboardData();
// // //   }, []);

// // //   const fetchDashboardData = async () => {
// // //     setIsLoading(true);
// // //     setError('');
// // //     try {
// // //       // Fetch data in parallel
// // //       const [tasksRes, attendanceRes, notificationsRes] = await Promise.all([
// // //         api.get('/tasks'), // Assuming endpoint for staff's tasks
// // //         api.get('/attendance/today'), // Assuming endpoint for today's attendance
// // //         api.get('/notifications') // Assuming notifications endpoint
// // //       ]);

// // //       // Process tasks
// // //       const tasksData = tasksRes.data || [];
// // //       setTasks(tasksData);

// // //       // Calculate stats from tasks
// // //       const today = new Date().toISOString().split('T')[0];
// // //       const todayTasks = tasksData.filter(task =>
// // //         task.createdAt && task.createdAt.split('T')[0] === today
// // //       );
// // //       const completedTasks = tasksData.filter(task => task.status === 'Completed');

// // //       setStats({
// // //         tasksAssignedToday: todayTasks.length,
// // //         tasksCompleted: completedTasks.length,
// // //         hoursWorkedToday: attendanceRes.data?.hoursWorked || 0
// // //       });

// // //       // Process attendance
// // //       if (attendanceRes.data) {
// // //         setAttendance({
// // //           punchInTime: attendanceRes.data.punchInTime || '--:-- --',
// // //           punchOutTime: attendanceRes.data.punchOutTime || '--:-- --',
// // //           hoursWorked: attendanceRes.data.hoursWorked || 0,
// // //           totalHours: attendanceRes.data.totalHours || 8
// // //         });
// // //       }

// // //       // Process notifications
// // //       setNotifications(notificationsRes.data || []);

// // //       // Generate reminders from tasks (or fetch from API)
// // //       const overdueTasks = tasksData.filter(task => {
// // //         if (!task.dueDate) return false;
// // //         const dueDate = new Date(task.dueDate);
// // //         const now = new Date();
// // //         const timeDiff = dueDate - now;
// // //         const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
// // //         return daysDiff <= 2 && task.status !== 'Completed';
// // //       });

// // //       const taskReminders = overdueTasks.map(task => ({
// // //         type: 'urgent',
// // //         title: 'Task Due Soon',
// // //         description: `${task.title} due in ${Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days`,
// // //         time: new Date(task.dueDate).toLocaleDateString(),
// // //         bgColor: 'bg-yellow-50',
// // //         borderColor: 'border-l-yellow-500',
// // //         icon: '⚠️'
// // //       }));

// // //       setReminders(taskReminders);

// // //     } catch (err) {
// // //       console.error('Error fetching dashboard data:', err);
// // //       setError('Failed to load dashboard data. Please try again.');

// // //       // Fallback to mock data
// // //       setMockData();
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   // Mock data fallback
// // //   const setMockData = () => {
// // //     setStats({
// // //       tasksAssignedToday: 8,
// // //       tasksCompleted: 5,
// // //       hoursWorkedToday: 6.5
// // //     });

// // //     setTasks([
// // //       {
// // //         _id: 1,
// // //         title: 'Inventory Stock Check',
// // //         description: 'Verify and update stock levels for all medications in storage.',
// // //         priority: 'High',
// // //         dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
// // //         status: 'In Progress',
// // //         createdAt: new Date().toISOString()
// // //       },
// // //       {
// // //         _id: 2,
// // //         title: 'Process Customer Orders',
// // //         description: 'Review pending online orders and pack items for delivery.',
// // //         priority: 'Medium',
// // //         dueDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
// // //         status: 'Completed',
// // //         createdAt: new Date().toISOString()
// // //       },
// // //       {
// // //         _id: 3,
// // //         title: 'Update Medicine Database',
// // //         description: 'Add new batches of antibiotics received this morning.',
// // //         priority: 'Low',
// // //         dueDate: new Date(Date.now() + 259200000).toISOString(), // 3 days
// // //         status: 'Pending',
// // //         createdAt: new Date().toISOString()
// // //       },
// // //       {
// // //         _id: 4,
// // //         title: 'Prepare Monthly Report',
// // //         description: 'Compile sales data for the month of December.',
// // //         priority: 'Medium',
// // //         dueDate: new Date('2024-12-28').toISOString(),
// // //         status: 'In Progress',
// // //         createdAt: new Date().toISOString()
// // //       }
// // //     ]);

// // //     setNotifications([
// // //       { _id: 1, message: 'New task assigned by Admin', time: '2 hours ago', read: false },
// // //       { _id: 2, message: 'Leave request approved', time: '5 hours ago', read: true },
// // //       { _id: 3, message: 'Shift schedule updated', time: 'Yesterday', read: false },
// // //       { _id: 4, message: 'Monthly performance review available', time: '2 days ago', read: true }
// // //     ]);
// // //   };

// // //   // Handlers
// // //   const handleViewTask = (task) => {
// // //     setViewTask(task);
// // //     setIsViewModalOpen(true);
// // //   };

// // //   const handleEditClick = (task) => {
// // //     setCurrentTask({ ...task });
// // //     setIsEditModalOpen(true);
// // //   };

// // //   const handleEditChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setCurrentTask(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSaveTask = async () => {
// // //     try {
// // //       // Update task via API
// // //       const res = await api.put(`/tasks/${currentTask._id}`, currentTask);

// // //       // Update local state
// // //       setTasks(prevTasks =>
// // //         prevTasks.map(task => (task._id === currentTask._id ? res.data : task))
// // //       );

// // //       setIsEditModalOpen(false);
// // //       setCurrentTask(null);

// // //       // Refresh stats
// // //       fetchDashboardData();

// // //       alert('Task updated successfully!');
// // //     } catch (error) {
// // //       console.error('Error updating task:', error);
// // //       alert('Failed to update task');
// // //     }
// // //   };

// // //   const handleMarkNotificationAsRead = async (notificationId) => {
// // //     try {
// // //       await api.put(`/notifications/${notificationId}/read`);
// // //       setNotifications(prev =>
// // //         prev.map(notif =>
// // //           notif._id === notificationId ? { ...notif, read: true } : notif
// // //         )
// // //       );
// // //     } catch (error) {
// // //       console.error('Error marking notification as read:', error);
// // //     }
// // //   };

// // //   const handlePunchIn = async () => {
// // //     try {
// // //       await api.post('/attendance/punch-in');
// // //       alert('Punched in successfully!');
// // //       fetchDashboardData(); // Refresh attendance data
// // //     } catch (error) {
// // //       console.error('Error punching in:', error);
// // //       alert('Failed to punch in');
// // //     }
// // //   };

// // //   const handlePunchOut = async () => {
// // //     try {
// // //       await api.post('/attendance/punch-out');
// // //       alert('Punched out successfully!');
// // //       fetchDashboardData(); // Refresh attendance data
// // //     } catch (error) {
// // //       console.error('Error punching out:', error);
// // //       alert('Failed to punch out');
// // //     }
// // //   };

// // //   // Utility functions
// // //   const getPriorityStyle = (priority) => {
// // //     const styles = {
// // //       'High': 'bg-red-100 text-red-700',
// // //       'Medium': 'bg-yellow-100 text-yellow-700',
// // //       'Low': 'bg-blue-100 text-blue-700'
// // //     };
// // //     return styles[priority] || 'bg-gray-100 text-gray-700';
// // //   };

// // //   const getStatusStyle = (status) => {
// // //     const styles = {
// // //       'Pending': 'bg-gray-100 text-gray-700',
// // //       'In Progress': 'bg-yellow-100 text-yellow-700',
// // //       'Completed': 'bg-green-100 text-green-700'
// // //     };
// // //     return styles[status] || 'bg-gray-100 text-gray-700';
// // //   };

// // //   const formatDate = (dateString) => {
// // //     if (!dateString) return 'N/A';
// // //     const date = new Date(dateString);
// // //     const now = new Date();
// // //     const diffTime = Math.abs(now - date);
// // //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// // //     if (diffDays === 0) return 'Today';
// // //     if (diffDays === 1) return 'Tomorrow';
// // //     if (diffDays <= 7) return `${diffDays} days`;

// // //     return date.toLocaleDateString('en-US', {
// // //       month: 'short',
// // //       day: 'numeric',
// // //       hour: '2-digit',
// // //       minute: '2-digit'
// // //     });
// // //   };

// // //   // Stats Cards
// // //   const statsCards = [
// // //     {
// // //       title: 'Tasks Assigned Today',
// // //       value: stats.tasksAssignedToday.toString(),
// // //       icon: ClipboardCheck,
// // //       color: 'text-[#246e72]',
// // //       change: '+2 from yesterday'
// // //     },
// // //     {
// // //       title: 'Tasks Completed',
// // //       value: stats.tasksCompleted.toString(),
// // //       icon: CheckCircle,
// // //       color: 'text-[#246e72]',
// // //       change: '85% completion rate'
// // //     },
// // //     {
// // //       title: 'Hours Worked Today',
// // //       value: stats.hoursWorkedToday.toString(),
// // //       icon: Clock,
// // //       color: 'text-[#246e72]',
// // //       change: `${((stats.hoursWorkedToday / attendance.totalHours) * 100).toFixed(0)}% of target`
// // //     }
// // //   ];

// // //   return (
// // //     <div id='dashboard' className="flex h-screen bg-[#D2EAF4]">
// // //       <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

// // //       {/* Main Content */}
// // //       <div className="flex-1 overflow-auto">
// // //         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
// // //           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
// // //             <div className="flex items-center space-x-4">
// // //               <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
// // //                 <Menu size={24} />
// // //               </button>
// // //               <h2 className="text-2xl font-bold text-white">Staff Dashboard</h2>
// // //             </div>
// // //             <div className="flex items-center space-x-4">
// // //               <span className="text-sm text-white hidden sm:block">Welcome,</span>
// // //               <div className="flex items-center space-x-2">
// // //                 <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
// // //                 <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
// // //                   SJ
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </header>

// // //         <main className="p-4 lg:p-8 space-y-6">
// // //           {/* Error Message */}
// // //           {error && (
// // //             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
// // //               <p className="font-bold">Error</p>
// // //               <p className="text-sm">{error}</p>
// // //             </div>
// // //           )}

// // //           {/* Stats Cards */}
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
// // //             {statsCards.map((card, index) => (
// // //               <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
// // //                 <div className="flex items-start justify-between mb-4">
// // //                   <div>
// // //                     <p className="text-sm text-gray-600 mb-1">{card.title}</p>
// // //                     <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
// // //                   </div>
// // //                   <div className={`p-3 rounded-lg bg-teal-50 ${card.color}`}>
// // //                     <card.icon size={24} />
// // //                   </div>
// // //                 </div>
// // //                 <p className="text-sm text-teal-600">{card.change}</p>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           {/* Reminders Section */}
// // //           {reminders.length > 0 && (
// // //             <div className="bg-white rounded-xl shadow-md p-6">
// // //               <div className="flex items-center space-x-2 mb-6">
// // //                 <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
// // //                   <AlertTriangle size={18} className="text-yellow-600" />
// // //                 </div>
// // //                 <h3 className="text-xl font-bold text-gray-800">Important Reminders</h3>
// // //               </div>
// // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                 {reminders.map((reminder, index) => (
// // //                   <div key={index} className={`${reminder.bgColor} rounded-lg p-4 border-l-4 ${reminder.borderColor}`}>
// // //                     <div className="flex items-start justify-between mb-2">
// // //                       <h4 className="font-semibold text-gray-800 text-sm">{reminder.title}</h4>
// // //                       <span className="text-lg">{reminder.icon}</span>
// // //                     </div>
// // //                     <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
// // //                     <p className="text-xs text-gray-500">Due: {reminder.time}</p>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* My Tasks Section */}
// // //           <div className="bg-white rounded-xl shadow-md p-6">
// // //             <div className="flex items-center justify-between mb-6">
// // //               <div className="flex items-center space-x-2">
// // //                 <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
// // //                   <ClipboardCheck size={18} className="text-[#246e72]" />
// // //                 </div>
// // //                 <h3 className="text-xl font-bold text-gray-800">My Tasks</h3>
// // //               </div>
// // //               <button
// // //                 onClick={() => navigate('/staff/tasks')}
// // //                 className="text-[#246e72] hover:text-[#1a5256] text-sm font-medium flex items-center space-x-1"
// // //               >
// // //                 <span>View All</span>
// // //                 <ArrowUpRight size={16} />
// // //               </button>
// // //             </div>

// // //             {isLoading ? (
// // //               <div className="flex justify-center items-center h-32">
// // //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
// // //               </div>
// // //             ) : (
// // //               <div className="overflow-x-auto">
// // //                 <table className="w-full">
// // //                   <thead>
// // //                     <tr className="border-b border-gray-200">
// // //                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TASK TITLE</th>
// // //                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRIORITY</th>
// // //                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DUE DATE</th>
// // //                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
// // //                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody>
// // //                     {tasks.slice(0, 5).map(task => (
// // //                       <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
// // //                         <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
// // //                         <td className="py-4 px-4">
// // //                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
// // //                             {task.priority}
// // //                           </span>
// // //                         </td>
// // //                         <td className="py-4 px-4 text-sm text-gray-700">
// // //                           {formatDate(task.dueDate)}
// // //                         </td>
// // //                         <td className="py-4 px-4">
// // //                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
// // //                             {task.status}
// // //                           </span>
// // //                         </td>
// // //                         <td className="py-4 px-4">
// // //                           <div className="flex space-x-2">
// // //                             <button
// // //                               onClick={() => handleViewTask(task)}
// // //                               className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
// // //                             >
// // //                               <Eye size={16} />
// // //                             </button>
// // //                             <button
// // //                               onClick={() => handleEditClick(task)}
// // //                               className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center"
// // //                             >
// // //                               <Edit size={16} />
// // //                             </button>
// // //                           </div>
// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>
// // //                 {tasks.length === 0 && (
// // //                   <div className="text-center py-8 text-gray-500">
// // //                     No tasks assigned yet
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Bottom Section */}
// // //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //             {/* Attendance Snapshot */}
// // //             <div className="bg-white rounded-xl shadow-md p-6">
// // //               <div className="flex items-center justify-between mb-6">
// // //                 <div className="flex items-center space-x-2">
// // //                   <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
// // //                     <User size={18} className="text-[#246e72]" />
// // //                   </div>
// // //                   <h3 className="text-lg font-bold text-gray-800">Attendance Snapshot</h3>
// // //                 </div>
// // //                 <div className="flex space-x-2">
// // //                   <button
// // //                     onClick={handlePunchIn}
// // //                     disabled={attendance.punchInTime !== '--:-- --'}
// // //                     className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                   >
// // //                     Punch In
// // //                   </button>
// // //                   <button
// // //                     onClick={handlePunchOut}
// // //                     disabled={attendance.punchOutTime !== '--:-- --'}
// // //                     className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                   >
// // //                     Punch Out
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //               <div className="space-y-4">
// // //                 <div className="flex justify-between items-center">
// // //                   <div>
// // //                     <p className="text-sm text-gray-600">Punch In</p>
// // //                     <p className="text-lg font-bold text-gray-800">{attendance.punchInTime}</p>
// // //                   </div>
// // //                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
// // //                     <CheckCircle className="text-green-600" size={20} />
// // //                   </div>
// // //                 </div>
// // //                 <div className="flex justify-between items-center">
// // //                   <div>
// // //                     <p className="text-sm text-gray-600">Punch Out</p>
// // //                     <p className="text-lg font-bold text-gray-800">{attendance.punchOutTime}</p>
// // //                   </div>
// // //                   <div className={`w-10 h-10 ${attendance.punchOutTime === '--:-- --' ? 'bg-gray-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
// // //                     <Clock className={attendance.punchOutTime === '--:-- --' ? 'text-gray-600' : 'text-green-600'} size={20} />
// // //                   </div>
// // //                 </div>
// // //                 <div>
// // //                   <div className="flex justify-between text-sm mb-2">
// // //                     <span className="text-gray-600">Hours Progress</span>
// // //                     <span className="font-semibold text-gray-800">
// // //                       {attendance.hoursWorked} / {attendance.totalHours} hrs
// // //                     </span>
// // //                   </div>
// // //                   <div className="w-full bg-gray-200 rounded-full h-3">
// // //                     <div
// // //                       className="bg-[#246e72] h-3 rounded-full transition-all duration-300"
// // //                       style={{ width: `${Math.min((attendance.hoursWorked / attendance.totalHours) * 100, 100)}%` }}
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Notifications */}
// // //             <div className="bg-white rounded-xl shadow-md p-6">
// // //               <div className="flex items-center justify-between mb-6">
// // //                 <div className="flex items-center space-x-2">
// // //                   <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
// // //                     <Bell size={18} className="text-[#246e72]" />
// // //                   </div>
// // //                   <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
// // //                 </div>
// // //                 <div className="w-6 h-6 bg-[#246e72] rounded-full flex items-center justify-center text-white text-xs font-bold">
// // //                   {notifications.filter(n => !n.read).length}
// // //                 </div>
// // //               </div>
// // //               <div className="space-y-3 max-h-64 overflow-y-auto">
// // //                 {notifications.slice(0, 5).map(notification => (
// // //                   <div
// // //                     key={notification._id}
// // //                     className={`rounded-lg p-3 cursor-pointer transition-colors ${notification.read ? 'bg-[#D2EAF4]' : 'bg-blue-50 border-l-4 border-blue-500'}`}
// // //                     onClick={() => handleMarkNotificationAsRead(notification._id)}
// // //                   >
// // //                     <p className="text-sm text-gray-800">{notification.message}</p>
// // //                     <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
// // //                     {!notification.read && (
// // //                       <div className="mt-1 text-xs text-blue-600">Click to mark as read</div>
// // //                     )}
// // //                   </div>
// // //                 ))}
// // //                 {notifications.length === 0 && (
// // //                   <div className="text-center py-4 text-gray-500">
// // //                     No notifications
// // //                   </div>
// // //                 )}
// // //               </div>
// // //               <button
// // //                 onClick={() => navigate('/staff/notifications')}
// // //                 className="w-full mt-4 text-[#246e72] hover:text-[#1a5256] text-sm font-medium text-center"
// // //               >
// // //                 View All Notifications
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Quick Actions */}
// // //           <div className="bg-white rounded-xl shadow-md p-6">
// // //             <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
// // //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// // //               <button
// // //                 onClick={() => navigate('/staff/tasks')}
// // //                 className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
// // //               >
// // //                 <ClipboardCheck size={18} />
// // //                 <span>View All Tasks</span>
// // //               </button>
// // //               <button
// // //                 onClick={() => navigate('/staff/leaves')}
// // //                 className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
// // //               >
// // //                 <Calendar size={18} />
// // //                 <span>Apply for Leave</span>
// // //               </button>
// // //               <button
// // //                 onClick={() => navigate('/staff/attendance')}
// // //                 className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
// // //               >
// // //                 <Clock size={18} />
// // //                 <span>Attendance History</span>
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </main>
// // //       </div>

// // //       {/* View Task Modal */}
// // //       {isViewModalOpen && viewTask && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
// // //             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
// // //               <h3 className="text-lg font-bold text-white">Task Preview</h3>
// // //               <button
// // //                 onClick={() => setIsViewModalOpen(false)}
// // //                 className="text-white hover:bg-teal-700 p-1 rounded-full"
// // //               >
// // //                 <X size={20} />
// // //               </button>
// // //             </div>

// // //             <div className="p-6 space-y-4">
// // //               <div>
// // //                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Title</h4>
// // //                 <p className="text-gray-800 font-bold text-xl">{viewTask.title}</p>
// // //               </div>

// // //               <div>
// // //                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Description</h4>
// // //                 <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
// // //                   {viewTask.description || "No description provided."}
// // //                 </p>
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Priority</h4>
// // //                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(viewTask.priority)}`}>
// // //                     {viewTask.priority}
// // //                   </span>
// // //                 </div>
// // //                 <div>
// // //                   <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Status</h4>
// // //                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(viewTask.status)}`}>
// // //                     {viewTask.status}
// // //                   </span>
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Due Date</h4>
// // //                 <div className="flex items-center space-x-2 text-gray-700">
// // //                   <Calendar size={16} />
// // //                   <span>{formatDate(viewTask.dueDate)}</span>
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Created At</h4>
// // //                 <p className="text-sm text-gray-600">
// // //                   {new Date(viewTask.createdAt).toLocaleDateString('en-US', {
// // //                     year: 'numeric',
// // //                     month: 'long',
// // //                     day: 'numeric'
// // //                   })}
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
// // //               <button
// // //                 onClick={() => setIsViewModalOpen(false)}
// // //                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
// // //               >
// // //                 Close
// // //               </button>
// // //               <button
// // //                 onClick={() => {
// // //                   setIsViewModalOpen(false);
// // //                   handleEditClick(viewTask);
// // //                 }}
// // //                 className="px-6 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors"
// // //               >
// // //                 Edit Task
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Edit Task Modal */}
// // //       {isEditModalOpen && currentTask && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
// // //             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
// // //               <h3 className="text-lg font-bold text-white">Edit Task</h3>
// // //               <button
// // //                 onClick={() => setIsEditModalOpen(false)}
// // //                 className="text-white hover:bg-teal-700 p-1 rounded-full"
// // //               >
// // //                 <X size={20} />
// // //               </button>
// // //             </div>

// // //             <div className="p-6 space-y-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
// // //                 <input
// // //                   type="text"
// // //                   name="title"
// // //                   value={currentTask.title}
// // //                   onChange={handleEditChange}
// // //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// // //                 <textarea
// // //                   name="description"
// // //                   value={currentTask.description || ''}
// // //                   onChange={handleEditChange}
// // //                   rows="3"
// // //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// // //                 />
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
// // //                   <select
// // //                     name="priority"
// // //                     value={currentTask.priority}
// // //                     onChange={handleEditChange}
// // //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// // //                   >
// // //                     <option value="High">High</option>
// // //                     <option value="Medium">Medium</option>
// // //                     <option value="Low">Low</option>
// // //                   </select>
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
// // //                   <select
// // //                     name="status"
// // //                     value={currentTask.status}
// // //                     onChange={handleEditChange}
// // //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// // //                   >
// // //                     <option value="Pending">Pending</option>
// // //                     <option value="In Progress">In Progress</option>
// // //                     <option value="Completed">Completed</option>
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
// // //                 <input
// // //                   type="datetime-local"
// // //                   name="dueDate"
// // //                   value={currentTask.dueDate ? currentTask.dueDate.split('.')[0] : ''}
// // //                   onChange={handleEditChange}
// // //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
// // //               <button
// // //                 onClick={() => setIsEditModalOpen(false)}
// // //                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={handleSaveTask}
// // //                 className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
// // //               >
// // //                 <Save size={18} />
// // //                 <span>Save Changes</span>
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default StaffDashboard;

// import React, { useState, useEffect } from 'react';
// import {
//   ClipboardCheck, Clock, Bell, CheckCircle,
//   Menu, User, Calendar,
//   Edit, Eye, X, Save, LogOut
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import StaffSidebar from './StaffSidebar';
// import api from '../services/api'; // Make sure to import your API service

// const StaffDashboard = () => {
//   // UI State
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   // --- Modal States ---
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);

//   // --- View Modal States ---
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [viewTask, setViewTask] = useState(null);

//   // --- Backend Data States ---
//   const [stats, setStats] = useState({
//     tasksAssignedToday: 0,
//     tasksCompleted: 0,
//     hoursWorkedToday: 0
//   });

//   const [tasks, setTasks] = useState([]);
//   const [attendance, setAttendance] = useState({
//     punchInTime: '--:-- --',
//     punchOutTime: '--:-- --',
//     hoursWorked: 0,
//     totalHours: 8
//   });

//   const [notifications, setNotifications] = useState([]);
//   const [staffData, setStaffData] = useState({
//     name: 'Loading...',
//     initials: 'LD'
//   });

//   const [loading, setLoading] = useState({
//     stats: false,
//     tasks: false,
//     attendance: false,
//     notifications: false
//   });

//   // Fetch all data on component mount
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading({
//         stats: true,
//         tasks: true,
//         attendance: true,
//         notifications: true
//       });

//       // Fetch all data in parallel
//       // const [tasksRes, statsRes, attendanceRes, notificationsRes, profileRes] = await Promise.all([
//       //   api.get('/tasks'),
//       //   api.get('/dashboard/stats'),
//       //   api.get('/attendance/today'),
//       //   api.get('/notifications/staff'),
//       //   api.get('/staff/profile')
//       // ]);
//       const tasksRes  = await api.get('/tasks');
//       console.log('Tasks Data:', tasksRes.data);

//       const tasksData = tasksRes.data || [];
//       console.log("tasksData:", tasksData);

//       setTasks(tasksData);
//       console.log(tasks.length);

//       const statsRes  = await api.get('/dashboard/stats');
//       console.log('Stats Data:', statsRes.data);


//       const attendanceRes  = await api.get('/attendance/today');
//       console.log('Attendance Data:', attendanceRes.data);
//       // const notificationsRes  = await api.get('/notifications/staff');
//       const notificationsRes = [];
//       console.log('Notifications Data:', notificationsRes);
//       // const profileRes  = await api.get('/staff/profile');
//       const profileRes = [];
//       console.log('Profile Data:', profileRes?.data || []);


//       const statsData2  = await api.get('/dashboard/stats')
//       console.log('Stats Data 2:', statsData2.data);
//       // Process tasks
    
//       // Process stats
//       const statsData = statsRes.data || {};
//       setStats({
//         tasksAssignedToday: statsData.tasksAssignedToday || 0,
//         tasksCompleted: statsData.tasksCompleted || 0,
//         hoursWorkedToday: statsData.hoursWorkedToday || 0
//       });

//       // Process attendance
//       const attendanceData = attendanceRes.data || {};
//       setAttendance({
//         punchInTime: attendanceData.punchInTime || '--:-- --',
//         punchOutTime: attendanceData.punchOutTime || '--:-- --',
//         hoursWorked: attendanceData.hoursWorked || 0,
//         totalHours: 8 // Default shift hours
//       });

//       // Process notifications
//       const notificationsData = notificationsRes?.data || [];
//       setNotifications(notificationsData);

//       // Process staff profile
//       const profileData = profileRes.data || {};
//       const staffName = profileData.name || 'Staff Member';
//       const initials = staffName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//       setStaffData({
//         name: staffName,
//         initials: initials
//       });

//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       alert('Failed to load dashboard data. Please try again.');
//     } finally {
//       setLoading({
//         stats: false,
//         tasks: false,
//         attendance: false,
//         notifications: false
//       });
//     }
//   };

//   // Handle punch in/out
//   const handlePunchAction = async (action) => {
//     try {
//       const response = await api.post(`/attendance/${action}`);
//       if (response.data.success) {
//         alert(`Successfully ${action === 'punch-in' ? 'punched in' : 'punched out'}!`);
//         // Refresh attendance data
//         const attendanceRes = await api.get('/attendance/today');
//         setAttendance(attendanceRes.data || {});
//       }
//     } catch (error) {
//       console.error(`Error during ${action}:`, error);
//       alert(`Failed to ${action === 'punch-in' ? 'punch in' : 'punch out'}. Please try again.`);
//     }
//   };

//   // Handlers for tasks
//   const handleViewTask = (task) => {
//     setViewTask(task);
//     setIsViewModalOpen(true);
//   };

//   const handleEditClick = (task) => {
//     setCurrentTask({ ...task });
//     setIsEditModalOpen(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentTask(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSaveTask = async () => {
//     try {
//       const response = await api.put(`/tasks/${currentTask._id}`, currentTask);

//       if (response.data.success) {
//         // Update local state
//         setTasks(prevTasks =>
//           prevTasks.map(task => (task._id === currentTask._id ? response.data.task : task))
//         );

//         setIsEditModalOpen(false);
//         setCurrentTask(null);
//         alert('Task updated successfully!');

//         // Refresh stats
//         const statsRes = await api.get('/staff/dashboard-stats');
//         setStats(statsRes.data || {});
//       }
//     } catch (error) {
//       console.error('Error updating task:', error);
//       alert('Failed to update task. Please try again.');
//     }
//   };

//   const handleTaskStatusUpdate = async (taskId, newStatus) => {
//     try {
//       const response = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });

//       if (response.data.success) {
//         // Update local state
//         setTasks(prevTasks =>
//           prevTasks.map(task => (task._id === taskId ? { ...task, status: newStatus } : task))
//         );

//         // Refresh stats
//         const statsRes = await api.get('/staff/dashboard-stats');
//         setStats(statsRes.data || {});
//       }
//     } catch (error) {
//       console.error('Error updating task status:', error);
//       alert('Failed to update task status.');
//     }
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await api.post('/auth/logout');
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Force logout anyway
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       navigate('/login');
//     }
//   };

//   // Mark notification as read
//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       await api.patch(`/notifications/${notificationId}/read`);
//       // Remove from local state
//       setNotifications(prev => prev.filter(n => n._id !== notificationId));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   // Utility functions
//   const getPriorityStyle = (priority) => {
//     const styles = {
//       'High': 'bg-red-100 text-red-700',
//       'Medium': 'bg-yellow-100 text-yellow-700',
//       'Low': 'bg-blue-100 text-blue-700'
//     };
//     return styles[priority] || 'bg-gray-100 text-gray-700';
//   };

//   const getStatusStyle = (status) => {
//     const styles = {
//       'Pending': 'bg-gray-100 text-gray-700',
//       'In Progress': 'bg-yellow-100 text-yellow-700',
//       'Completed': 'bg-green-100 text-green-700'
//     };
//     return styles[status] || 'bg-gray-100 text-gray-700';
//   };

//   // Stats Cards Data
//   const statsCards = [
//     {
//       title: 'Tasks Assigned Today',
//       value: stats.tasksAssignedToday.toString(),
//       icon: ClipboardCheck,
//       color: 'text-[#246e72]',
//       loading: loading.stats
//     },
//     {
//       title: 'Tasks Completed',
//       value: stats.tasksCompleted.toString(),
//       icon: CheckCircle,
//       color: 'text-[#246e72]',
//       loading: loading.stats
//     },
//     {
//       title: 'Hours Worked Today',
//       value: stats.hoursWorkedToday.toFixed(1),
//       icon: Clock,
//       color: 'text-[#246e72]',
//       loading: loading.attendance
//     }
//   ];

//   return (
//     <div id='dashboard' className="flex h-screen bg-[#D2EAF4]">

//       <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
//           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
//             <div className="flex items-center space-x-4">
//               <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
//                 <Menu size={24} />
//               </button>
//               <h2 className="text-2xl font-bold text-white">Staff Dashboard</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-white hidden sm:block">Welcome,</span>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-white hidden sm:block">
//                   {staffData.name}
//                 </span>
//                 <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
//                   {staffData.initials}
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="text-white hover:text-red-200 transition-colors ml-2"
//                   title="Logout"
//                 >
//                   <LogOut size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 space-y-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//             {statsCards.map((card, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">{card.title}</p>
//                     <h3 className="text-3xl font-bold text-gray-800">
//                       {card.loading ? (
//                         <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
//                       ) : (
//                         card.value
//                       )}
//                     </h3>
//                   </div>
//                   <div className={`p-3 rounded-lg bg-teal-50 ${card.color}`}>
//                     <card.icon size={24} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* My Tasks Section */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
//                   <ClipboardCheck size={18} className="text-[#246e72]" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800">My Tasks</h3>
//               </div>
//               <button
//                 onClick={fetchDashboardData}
//                 className="text-sm text-[#246e72] hover:text-[#1a5256] font-medium"
//               >
//                 Refresh
//               </button>
//             </div>

//             {loading.tasks ? (
//               <div className="flex justify-center items-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TASK TITLE</th>
//                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRIORITY</th>
//                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DUE DATE</th>
//                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
//                       <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {tasks.length > 0 ?  (
//                       tasks.map(task => (
//                         <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                           <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
//                           <td className="py-4 px-4">
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
//                               {task.priority}
//                             </span>
//                           </td>
//                           <td className="py-4 px-4 text-sm text-gray-700">
//                             {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'short',
//                               year: 'numeric',
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             }) : 'No due date'}
//                           </td>
//                           <td className="py-4 px-4">
//                             <select
//                               value={task.status}
//                               onChange={(e) => handleTaskStatusUpdate(task._id, e.target.value)}
//                               className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none ${getStatusStyle(task.status)}`}
//                             >
//                               <option value="Pending">Pending</option>
//                               <option value="In Progress">In Progress</option>
//                               <option value="Completed">Completed</option>
//                             </select>
//                           </td>
//                           <td className="py-4 px-4">
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleViewTask(task)}
//                                 className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center"
//                               >
//                                 <Eye size={16} />
//                               </button>
//                               <button
//                                 onClick={() => handleEditClick(task)}
//                                 className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center"
//                               >
//                                 <Edit size={16} />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="py-8 text-center text-gray-500">
//                           No tasks assigned yet.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Bottom Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Attendance Snapshot */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
//                     <User size={18} className="text-[#246e72]" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-800">Attendance Snapshot</h3>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handlePunchAction('punch-in')}
//                     className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
//                   >
//                     Punch In
//                   </button>
//                   <button
//                     onClick={() => handlePunchAction('punch-out')}
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
//                   >
//                     Punch Out
//                   </button>
//                 </div>
//               </div>

//               {loading.attendance ? (
//                 <div className="flex justify-center items-center h-32">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]"></div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-sm text-gray-600">Punch In</p>
//                       <p className="text-lg font-bold text-gray-800">{attendance.punchInTime}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <CheckCircle className="text-green-600" size={20} />
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-sm text-gray-600">Punch Out</p>
//                       <p className="text-lg font-bold text-gray-800">{attendance.punchOutTime}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                       <Clock className="text-gray-600" size={20} />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">Hours Progress</span>
//                       <span className="font-semibold text-gray-800">
//                         {attendance.hoursWorked} / {attendance.totalHours} hrs
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                       <div
//                         className="bg-[#246e72] h-3 rounded-full transition-all duration-300"
//                         style={{ width: `${(attendance.hoursWorked / attendance.totalHours) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Notifications */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
//                     <Bell size={18} className="text-[#246e72]" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
//                 </div>
//                 <div className="w-6 h-6 bg-[#246e72] rounded-full flex items-center justify-center text-white text-xs font-bold">
//                   {notifications.length}
//                 </div>
//               </div>

//               {loading.notifications ? (
//                 <div className="flex justify-center items-center h-32">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]"></div>
//                 </div>
//               ) : notifications.length > 0 ? (
//                 <div className="space-y-3">
//                   {notifications.map(notification => (
//                     <div
//                       key={notification._id}
//                       className="bg-[#D2EAF4] rounded-lg p-3 flex justify-between items-start"
//                     >
//                       <div>
//                         <p className="text-sm text-gray-800">{notification.message}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {new Date(notification.createdAt).toLocaleTimeString([], {
//                             hour: '2-digit',
//                             minute: '2-digit'
//                           })} • {new Date(notification.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleMarkAsRead(notification._id)}
//                         className="text-[#246e72] hover:text-[#1a5256] text-sm"
//                       >
//                         Mark as read
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-center text-gray-500 py-4">No new notifications</p>
//               )}

//               <button
//                 onClick={() => navigate('/staff/notifications')}
//                 className="w-full mt-4 text-[#246e72] hover:text-[#1a5256] text-sm font-medium text-center"
//               >
//                 View All Notifications
//               </button>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <button
//                 onClick={() => navigate('/staff/tasks')}
//                 className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
//               >
//                 <ClipboardCheck size={18} />
//                 <span>View All Tasks</span>
//               </button>
//               <button
//                 onClick={() => navigate('/staff/leaves')}
//                 className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
//               >
//                 <Calendar size={18} />
//                 <span>Apply for Leave</span>
//               </button>
//               <button
//                 onClick={() => navigate('/staff/attendance')}
//                 className="bg-[#246e72] text-white py-3 px-4 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center justify-center space-x-2"
//               >
//                 <Clock size={18} />
//                 <span>Attendance History</span>
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* View Task Preview Modal */}
//       {isViewModalOpen && viewTask && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
//             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
//               <h3 className="text-lg font-bold text-white">Task Preview</h3>
//               <button onClick={() => setIsViewModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Title</h4>
//                 <p className="text-gray-800 font-bold text-xl">{viewTask.title}</p>
//               </div>

//               <div>
//                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Description</h4>
//                 <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                   {viewTask.description || "No description provided."}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Priority</h4>
//                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(viewTask.priority)}`}>
//                     {viewTask.priority}
//                   </span>
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Status</h4>
//                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(viewTask.status)}`}>
//                     {viewTask.status}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Due Date</h4>
//                 <div className="flex items-center space-x-2 text-gray-700">
//                   <Calendar size={16} />
//                   <span>
//                     {viewTask.dueDate ? new Date(viewTask.dueDate).toLocaleString('en-GB', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     }) : 'No due date'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-end">
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="px-6 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Task Modal */}
//       {isEditModalOpen && currentTask && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
//             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
//               <h3 className="text-lg font-bold text-white">Edit Task</h3>
//               <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={currentTask.title || ''}
//                   onChange={handleEditChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <textarea
//                   name="description"
//                   value={currentTask.description || ''}
//                   onChange={handleEditChange}
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
//                   <select
//                     name="priority"
//                     value={currentTask.priority || 'Medium'}
//                     onChange={handleEditChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                   >
//                     <option value="High">High</option>
//                     <option value="Medium">Medium</option>
//                     <option value="Low">Low</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     name="status"
//                     value={currentTask.status || 'Pending'}
//                     onChange={handleEditChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Completed">Completed</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
//                 <input
//                   type="datetime-local"
//                   name="dueDate"
//                   value={currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().slice(0, 16) : ''}
//                   onChange={handleEditChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                 />
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
//               <button
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveTask}
//                 className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
//               >
//                 <Save size={18} />
//                 <span>Save Changes</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffDashboard;


import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, Clock, Bell, CheckCircle,
  Menu, User, Calendar,
  Edit, Eye, X, Save, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import api from '../services/api';

const StaffDashboard = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState({
    punchInTime: '--:-- --',
    punchOutTime: '--:-- --',
    hoursWorked: 0,
    totalHours: 8
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
        punchInTime: formatTime(attendanceData.punchInTime),
        punchOutTime: formatTime(attendanceData.punchOutTime),
        hoursWorked: attendanceData.totalHours || dashboardData.todayStats.hoursWorkedToday || 0,
        totalHours: 8
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
  const handlePunchAction = async (action) => {
    try {
      const endpoint = action === 'punch-in' ? '/attendance/punch-in' : '/attendance/punch-out';
      const response = await api.post(endpoint);

      if (response.data.success) {
        alert(`Successfully ${action === 'punch-in' ? 'punched in' : 'punched out'}!`);
        // Refresh dashboard and attendance data
        await Promise.all([
          fetchDashboardData(),
          api.get('/attendance/today').then(res => {
            const data = res.data.data || res.data || {};
            setAttendance(prev => ({
              ...prev,
              punchInTime: data.punchInTime ? new Date(data.punchInTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }) : '--:-- --',
              punchOutTime: data.punchOutTime ? new Date(data.punchOutTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }) : '--:-- --',
              hoursWorked: data.totalHours || 0
            }));
          })
        ]);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      alert(`Failed to ${action === 'punch-in' ? 'punch in' : 'punch out'}. ${error.response?.data?.message || 'Please try again.'}`);
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
    <div id='dashboard' className="flex h-screen bg-[#D2EAF4]">

      <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Staff Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">
                  {staffData.name}
                </span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  {staffData.initials}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-red-200 transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
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

          {/* My Tasks Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <ClipboardCheck size={18} className="text-[#246e72]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">My Tasks</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={fetchDashboardData}
                  className="text-sm text-[#246e72] hover:text-[#1a5256] font-medium"
                >
                  Refresh
                </button>
                <span className="text-sm text-gray-500">
                  {dashboardData.overallStats.pendingTasks} pending • {dashboardData.overallStats.inProgressTasks} in progress
                </span>
              </div>
            </div>

            {loading.tasks ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
              </div>
            ) : (
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
                    {displayTasks.length > 0 ? (
                      displayTasks.map(task => (
                        <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'No due date'}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={task.status}
                              onChange={(e) => handleTaskStatusUpdate(task._id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none ${getStatusStyle(task.status)}`}
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewTask(task)}
                                className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditClick(task)}
                                className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] transition-colors flex items-center justify-center"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No tasks assigned yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Snapshot */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                    <User size={18} className="text-[#246e72]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Attendance Snapshot</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePunchAction('punch-in')}
                    disabled={dashboardData.todayStats.hasPunchedIn}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${dashboardData.todayStats.hasPunchedIn
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                  >
                    {dashboardData.todayStats.hasPunchedIn ? 'Already Punched In' : 'Punch In'}
                  </button>
                  <button
                    onClick={() => handlePunchAction('punch-out')}
                    disabled={dashboardData.todayStats.hasPunchedOut || !dashboardData.todayStats.hasPunchedIn}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${dashboardData.todayStats.hasPunchedOut || !dashboardData.todayStats.hasPunchedIn
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                  >
                    {dashboardData.todayStats.hasPunchedOut ? 'Already Punched Out' : 'Punch Out'}
                  </button>
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
                  </div>
                </div>
              )}
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

              {loading.notifications ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div
                      key={notification._id || notification.id}
                      className="bg-[#D2EAF4] rounded-lg p-3 flex justify-between items-start"
                    >
                      <div>
                        <p className="text-sm text-gray-800">{notification.message || notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.createdAt ? new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''} • {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => handleMarkAsRead(notification._id || notification.id)}
                        className="text-[#246e72] hover:text-[#1a5256] text-sm"
                      >
                        Mark as read
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No new notifications</p>
              )}

              <button
                onClick={() => navigate('/staff/notifications')}
                className="w-full mt-4 text-[#246e72] hover:text-[#1a5256] text-sm font-medium text-center"
              >
                View All Notifications
              </button>
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
        </main>
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
    </div>
  );
};

export default StaffDashboard;
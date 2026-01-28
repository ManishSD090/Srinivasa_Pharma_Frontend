// import React, { useState } from 'react';
// import {
//   ClipboardCheck, CheckCircle, Clock, AlertTriangle,
//   Edit, Trash2, Download, ChevronLeft, ChevronRight,
//   X, Menu, Eye, Save, Send, Filter
// } from 'lucide-react';
// import StaffSidebar from './StaffSidebar';

// const StaffTask = () => {
//   // UI State
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');

//   // --- UPDATED FILTER STATE (Matches Admin Theme) ---
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [showExportDropdown, setShowExportDropdown] = useState(false);

//   // --- Modal States ---
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [viewTask, setViewTask] = useState(null);

//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [taskToUpdate, setTaskToUpdate] = useState(null);
//   const [newStatus, setNewStatus] = useState('');

//   // Summary stats
//   const summaryCards = [
//     { title: 'Total Tasks Assigned', value: '24', icon: ClipboardCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
//     { title: 'Completed Tasks', value: '16', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
//     { title: 'Pending Tasks', value: '6', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
//     { title: 'Overdue Tasks', value: '2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
//   ];

//   // Tasks Data
//   const [tasks, setTasks] = useState([
//     {
//       id: 1,
//       title: 'Inventory Stock Check',
//       description: 'Verify and update stock levels for all medications in storage',
//       priority: 'High',
//       deadline: '2024-01-15',
//       status: 'Pending'
//     },
//     {
//       id: 2,
//       title: 'Customer Prescription Review',
//       description: 'Review and process pending prescriptions from morning shift',
//       priority: 'Medium',
//       deadline: '2024-01-14',
//       status: 'In Progress'
//     },
//     {
//       id: 3,
//       title: 'Equipment Maintenance',
//       description: 'Monthly equipment check and cleaning of pharmacy tools',
//       priority: 'Low',
//       deadline: '2024-01-20',
//       status: 'Pending'
//     },
//     {
//       id: 4,
//       title: 'Monthly Sales Report',
//       description: 'Compile and analyze monthly sales data for management review',
//       priority: 'Medium',
//       deadline: '2024-01-18',
//       status: 'Completed'
//     },
//     {
//       id: 5,
//       title: 'Staff Training Session',
//       description: 'Conduct training on new pharmacy software system',
//       priority: 'High',
//       deadline: '2024-01-10',
//       status: 'Overdue'
//     },
//     {
//       id: 6,
//       title: 'Update Medicine Database',
//       description: 'Add new medicines and update pricing information',
//       priority: 'Medium',
//       deadline: '2024-01-16',
//       status: 'In Progress'
//     }
//   ]);

//   // --- Handlers ---

//   const handleViewTask = (task) => {
//     setViewTask(task);
//     setIsViewModalOpen(true);
//   };

//   const handleEditClick = (task) => {
//     setTaskToUpdate(task);
//     setNewStatus(task.status);
//     setIsStatusModalOpen(true);
//   };

//   const handleRequestStatusChange = () => {
//     if (newStatus === taskToUpdate.status) {
//       alert("No changes made to status.");
//       return;
//     }
//     // Simulation of sending request
//     alert(`Request Sent Successfully!\n\nAdmin will review your request to change status of "${taskToUpdate.title}" from '${taskToUpdate.status}' to '${newStatus}'.`);

//     setIsStatusModalOpen(false);
//     setTaskToUpdate(null);
//   };

//   const handleFilterSelect = (filterType) => {
//     setActiveFilter(filterType);
//     setShowFilterDropdown(false);
//     setCurrentPage(1);
//   };

//   // --- UPDATED Filter Logic (Unified) ---
//   const filteredTasks = tasks.filter(task => {
//     const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchQuery.toLowerCase());

//     let matchesFilter = true;
//     if (activeFilter === 'All') {
//       matchesFilter = true;
//     } else if (['High', 'Medium', 'Low'].includes(activeFilter)) {
//       // Filter by Priority
//       matchesFilter = task.priority === activeFilter;
//     } else {
//       // Filter by Status
//       matchesFilter = task.status === activeFilter;
//     }

//     return matchesSearch && matchesFilter;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredTasks.length / entriesPerPage);
//   const displayedTasks = filteredTasks.slice(
//     (currentPage - 1) * entriesPerPage,
//     currentPage * entriesPerPage
//   );

//   // Utility functions
//   const getPriorityStyle = (priority) => {
//     const styles = {
//       'High': 'bg-red-100 text-red-700',
//       'Medium': 'bg-yellow-100 text-yellow-700',
//       'Low': 'bg-green-100 text-green-700'
//     };
//     return styles[priority] || 'bg-gray-100 text-gray-700';
//   };

//   const getStatusStyle = (status) => {
//     const styles = {
//       'Pending': 'bg-yellow-100 text-yellow-700',
//       'In Progress': 'bg-blue-100 text-blue-700',
//       'Completed': 'bg-green-100 text-green-700',
//       'Overdue': 'bg-red-100 text-red-700'
//     };
//     return styles[status] || 'bg-gray-100 text-gray-700';
//   };

//   return (
//     <div className="flex h-screen bg-[#D2EAF4]">

//       <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

//       <div className="flex-1 overflow-auto">
//         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
//           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
//             <div className="flex items-center space-x-4">
//               <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
//               <h2 className="text-2xl font-bold text-white">Staff Tasks</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-white hidden sm:block">Welcome,</span>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
//                 <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">SJ</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 space-y-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//             {summaryCards.map((card, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">{card.title}</p>
//                     <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
//                   </div>
//                   <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
//                     <card.icon size={24} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Tasks Table */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
//                 <ClipboardCheck size={18} className="text-[#246e72]" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">Task List</h3>
//             </div>

//             {/* --- UPDATED TABLE CONTROLS (Matches Orders Page Theme) --- */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                     className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 text-sm ${activeFilter !== 'All' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-[#246e72] text-white hover:bg-teal-700'}`}
//                   >
//                     <Filter size={18} />
//                     <span>{activeFilter === 'All' ? 'Filter' : activeFilter}</span>
//                   </button>
//                   {showFilterDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                       <div className="py-1">
//                         <button onClick={() => handleFilterSelect('All')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium">All Tasks</button>
//                       </div>

//                       <div className="border-t border-gray-100 my-1"></div>
//                       <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">By Status</div>
//                       {['Pending', 'In Progress', 'Completed', 'Overdue'].map(status => (
//                         <button key={status} onClick={() => handleFilterSelect(status)} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">{status}</button>
//                       ))}

//                       <div className="border-t border-gray-100 my-1"></div>
//                       <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">By Priority</div>
//                       {['High', 'Medium', 'Low'].map(prio => (
//                         <button key={prio} onClick={() => handleFilterSelect(prio)} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">{prio}</button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
//                   <option value={10}>Show 10</option>
//                   <option value={50}>Show 50</option>
//                   <option value={100}>Show 100</option>
//                 </select>

//                 <div className="relative">
//                   <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 text-sm">
//                     <Download size={18} /><span>Export</span>
//                   </button>
//                   {showExportDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Excel</button>
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">PDF</button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="w-full sm:w-auto">
//                 <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TASK TITLE</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DESCRIPTION</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRIORITY</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DEADLINE</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedTasks.map(task => (
//                     <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
//                       <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">{task.description}</td>
//                       <td className="py-4 px-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
//                           {task.priority}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4 text-sm text-gray-700">{task.deadline}</td>
//                       <td className="py-4 px-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
//                           {task.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleViewTask(task)}
//                             title="View Details"
//                             className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
//                           >
//                             <Eye size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleEditClick(task)}
//                             title="Request Status Change"
//                             className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
//                           >
//                             <Edit size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
//               <p className="text-sm text-gray-600">Showing {displayedTasks.length} of {filteredTasks.length} tasks</p>
//               <div className="flex items-center space-x-2">
//                 <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronLeft size={18} /></button>
//                 <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronRight size={18} /></button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* --- VIEW TASK MODAL (Preview Only) --- */}
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
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
//                 <p className="text-gray-800 font-bold text-xl">{viewTask.title}</p>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
//                 <p className="text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 mt-1">
//                   {viewTask.description}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</label>
//                   <div className="mt-1">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(viewTask.priority)}`}>
//                       {viewTask.priority}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
//                   <div className="mt-1">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(viewTask.status)}`}>
//                       {viewTask.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</label>
//                 <p className="text-gray-800 font-medium">{viewTask.deadline}</p>
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-end">
//               <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- STATUS REQUEST MODAL (Restricted Edit) --- */}
//       {isStatusModalOpen && taskToUpdate && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
//             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
//               <h3 className="text-lg font-bold text-white">Update Task Status</h3>
//               <button onClick={() => setIsStatusModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
//                 <div className="flex items-start">
//                   <AlertTriangle className="text-yellow-500 mr-2 shrink-0" size={20} />
//                   <p className="text-sm text-yellow-700">
//                     <strong>Note:</strong> You can only request a status change. The Admin must approve this request before the task status is updated.
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
//                 <input
//                   type="text"
//                   value={taskToUpdate.title}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
//                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusStyle(taskToUpdate.status)}`}>
//                   {taskToUpdate.status}
//                 </span>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">New Status Request</label>
//                 <select
//                   value={newStatus}
//                   onChange={(e) => setNewStatus(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Completed">Completed</option>
//                 </select>
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
//               <button onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
//               <button
//                 onClick={handleRequestStatusChange}
//                 className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
//               >
//                 <Send size={16} />
//                 <span>Send Request</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default StaffTask;


import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, CheckCircle, Clock, AlertTriangle,
  Edit, Trash2, Download, ChevronLeft, ChevronRight,
  X, Menu, Eye, Save, Send, Filter
} from 'lucide-react';
import StaffSidebar from './StaffSidebar';
import {
  fetchTasks,
  fetchTaskById,
  requestTaskStatusChange,
  updateTask,
  fetchOverdueTasks
} from '../services/task.api';
import { useAuth } from '../authContext';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StaffTask = () => {
  // UI State
  const { user, staffId } = useAuth();
  console.log("Stored User in StaffTask:", staffId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Filter State
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Data State
  const [tasks, setTasks] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  // User Info (replace with actual user data from auth)
  const [userInfo] = useState({
    name: 'Sarah Johnson', // Replace with actual user data
    userId: localStorage.getItem('userId') // Assuming you store user ID in localStorage
  });

  // Fetch tasks on component mount
  useEffect(() => {
    loadTasks();
  }, [user, staffId]);

  const loadTasks = async () => {
    if (!user || !staffId) {
      console.log("Auth not ready yet, skipping task load");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchTasks(user, staffId);
      console.log(response);
      const tasksData = response.data;

      setTasks(tasksData);
      console.log("Fetched tasks:", tasksData);
      calculateSummaryStats(tasksData);

      // Fetch overdue tasks separately if needed
      try {
        const overdueResponse = await fetchOverdueTasks();
        setSummaryStats(prev => ({
          ...prev,
          overdue: overdueResponse.data.length
        }));
      } catch (err) {
        console.error("Failed to fetch overdue tasks:", err);
      }

    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      alert("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSummaryStats = (tasksData) => {
    const total = tasksData.length;
    const completed = tasksData.filter(task => task.status === 'Completed').length;
    const pending = tasksData.filter(task =>
      ['Not Started', 'In Progress'].includes(task.status)
    ).length;
    const overdue = tasksData.filter(task => {
      if (task.status === 'Completed') return false;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;

    setSummaryStats({ total, completed, pending, overdue });
  };

  // Summary cards with dynamic data
  const summaryCards = [
    {
      title: 'Total Tasks Assigned',
      value: summaryStats.total.toString(),
      icon: ClipboardCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      title: 'Completed Tasks',
      value: summaryStats.completed.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Pending Tasks',
      value: summaryStats.pending.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Overdue Tasks',
      value: summaryStats.overdue.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  // Handlers
  const handleViewTask = (task) => {
    setViewTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (task) => {
    // Check if task is assigned to current user
    if (task.assignedTo && task.assignedTo._id !== staffId) {
      alert("You can only request status changes for tasks assigned to you.");
      return;
    }

    setTaskToUpdate(task);
    setNewStatus(task.status);
    setIsStatusModalOpen(true);
  };

  const handleRequestStatusChange = async () => {
    if (!taskToUpdate) return;

    if (newStatus === taskToUpdate.status) {
      alert("No changes made to status.");
      return;
    }

    try {
      // Use the API function to request status change
      await requestTaskStatusChange(taskToUpdate._id, newStatus, staffId);

      alert(`Request Sent Successfully!\n\nAdmin will review your request to change status of "${taskToUpdate.title}" from '${taskToUpdate.status}' to '${newStatus}'.`);

      // Refresh tasks to show updated status if immediate update is allowed
      loadTasks();

      setIsStatusModalOpen(false);
      setTaskToUpdate(null);
    } catch (err) {
      console.error("Failed to request status change:", err);
      alert("Failed to send request. Please try again.");
    }
  };

  // For immediate status update (if your backend allows staff to update directly)
  const handleImmediateStatusUpdate = async () => {
    if (!taskToUpdate) return;

    try {
      await updateTask(taskToUpdate._id, { status: newStatus });
      alert(`Status updated successfully!`);
      loadTasks();
      setIsStatusModalOpen(false);
      setTaskToUpdate(null);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleFilterSelect = (filterType) => {
    setActiveFilter(filterType);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === 'All') {
      matchesFilter = true;
    } else if (['High', 'Medium', 'Low'].includes(activeFilter)) {
      // Filter by Priority
      matchesFilter = task.priority === activeFilter;
    } else if (['Not Started', 'In Progress', 'Completed', 'Overdue'].includes(activeFilter)) {
      // Filter by Status
      matchesFilter = task.status === activeFilter;
    } else {
      // Additional filters if needed
      matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / entriesPerPage);
  const displayedTasks = filteredTasks.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Utility functions
  const getPriorityStyle = (priority) => {
    const styles = {
      'High': 'bg-red-100 text-red-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'Low': 'bg-green-100 text-green-700'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Not Started': 'bg-gray-100 text-gray-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700',
      'Overdue': 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Format tasks for export
  const formatTasksForExport = (tasksArray) => {
    return tasksArray.map(task => ({
      "Task Title": task.title,
      "Description": task.description,
      "Priority": task.priority,
      "Deadline": formatDate(task.dueDate),
      "Status": task.status
    }));
  };

  const exportTasksToExcel = () => {
    try {
      const data = formatTasksForExport(filteredTasks);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

      XLSX.writeFile(
        workbook,
        `Staff_Tasks_${new Date().toISOString().slice(0, 10)}.xlsx`
      );

      setShowExportDropdown(false);
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel");
    }
  };

  const exportTasksToPDF = () => {
    try {
      const doc = new jsPDF("landscape");

      const tableColumn = [
        "Task Title",
        "Description",
        "Priority",
        "Deadline",
        "Status"
      ];

      const tableRows = formatTasksForExport(filteredTasks).map(row => [
        row["Task Title"],
        row["Description"],
        row["Priority"],
        row["Deadline"],
        row["Status"]
      ]);

      doc.text("Staff Tasks Report", 14, 15);

      autoTable(doc, {
        startY: 20,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [36, 110, 114] }
      });

      doc.save(`Staff_Tasks_${new Date().toISOString().slice(0, 10)}.pdf`);
      setShowExportDropdown(false);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Staff Tasks</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">
                  {userInfo.name}
                </span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {summaryCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                    <card.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tasks Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ClipboardCheck size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Task List</h3>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 text-sm ${activeFilter !== 'All'
                      ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-[#246e72] text-white hover:bg-teal-700'
                      }`}
                  >
                    <Filter size={18} />
                    <span>{activeFilter === 'All' ? 'Filter' : activeFilter}</span>
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleFilterSelect('All')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium"
                        >
                          All Tasks
                        </button>
                      </div>

                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        By Status
                      </div>
                      {['Not Started', 'In Progress', 'Completed', 'Overdue'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleFilterSelect(status)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                          {status}
                        </button>
                      ))}

                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        By Priority
                      </div>
                      {['High', 'Medium', 'Low'].map(prio => (
                        <button
                          key={prio}
                          onClick={() => handleFilterSelect(prio)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                          {prio}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                >
                  <option value={10}>Show 10</option>
                  <option value={20}>Show 20</option>
                  <option value={50}>Show 50</option>
                </select>

                <div className="relative">
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 text-sm"
                  >
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  {showExportDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={exportTasksToExcel}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        Excel
                      </button>
                      <button
                        onClick={exportTasksToPDF}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
                <p className="mt-2 text-gray-600">Loading tasks...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TASK TITLE</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DESCRIPTION</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRIORITY</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DEADLINE</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedTasks.length > 0 ? (
                        displayedTasks.map(task => (
                          <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
                            <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">
                              {task.description}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {formatDate(task.dueDate)}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewTask(task)}
                                  title="View Details"
                                  className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleEditClick(task)}
                                  title="Request Status Change"
                                  className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                                  disabled={!task.assignedTo || task.assignedTo._id !== staffId}
                                >
                                  <Edit size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-gray-500">
                            No tasks found. {searchQuery && 'Try a different search term.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredTasks.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <p className="text-sm text-gray-600">
                      Showing {displayedTasks.length} of {filteredTasks.length} tasks
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* View Task Modal */}
      {isViewModalOpen && viewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Task Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-white hover:bg-teal-700 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </label>
                <p className="text-gray-800 font-bold text-xl">{viewTask.title}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 mt-1">
                  {viewTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Priority
                  </label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(viewTask.priority)}`}>
                      {viewTask.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(viewTask.status)}`}>
                      {viewTask.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Due Date
                  </label>
                  <p className="text-gray-800 font-medium">{formatDate(viewTask.dueDate)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assigned By
                  </label>
                  <p className="text-gray-800 font-medium">
                    {viewTask.assignedById?.name || 'Admin'}
                  </p>
                </div>
              </div>

              {viewTask.assignedTo && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </label>
                  <p className="text-gray-800 font-medium">
                    {viewTask.assignedTo.name} ({viewTask.assignedTo.role})
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Request Modal */}
      {isStatusModalOpen && taskToUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Update Task Status</h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-white hover:bg-teal-700 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-500 mr-2 shrink-0" size={20} />
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> You can only request a status change. The Admin must approve this request before the task status is updated.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskToUpdate.title}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Status
                </label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusStyle(taskToUpdate.status)}`}>
                  {taskToUpdate.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status Request
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestStatusChange}
                className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
              >
                <Send size={16} />
                <span>Send Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTask;
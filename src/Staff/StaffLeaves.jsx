<<<<<<< HEAD
// import React, { useState } from 'react';
// import {
//   CalendarCheck, Clock, CheckCircle, XCircle,
//   ChevronLeft, ChevronRight, Menu, Filter, Download
// } from 'lucide-react';
// import StaffSidebar from './StaffSidebar';

// const StaffLeaves = () => {
//   // UI State
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');

//   // --- UPDATED FILTER STATE ---
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [showExportDropdown, setShowExportDropdown] = useState(false);

//   // Form Data
//   const [formData, setFormData] = useState({
//     type: '',
//     startDate: '',
//     endDate: '',
//     reason: ''
//   });

//   // Summary Cards Data
//   const summaryCards = [
//     { title: 'Total Leaves Taken', value: '8', icon: CalendarCheck, color: 'text-[#246e72]', bgColor: 'bg-teal-50' },
//     { title: 'Remaining Leaves', value: '12', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
//     { title: 'Pending Approvals', value: '2', icon: CheckCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
//     { title: 'Rejected Requests', value: '1', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' }
//   ];

//   // Leave History Data
//   const [leaveData] = useState([
//     {
//       id: 1, type: 'Sick Leave', fromDate: '2024-01-15', toDate: '2024-01-16',
//       status: 'Approved', remarks: 'Medical certificate verified'
//     },
//     {
//       id: 2, type: 'Casual Leave', fromDate: '2024-01-10', toDate: '2024-01-10',
//       status: 'Approved', remarks: 'Personal work'
//     },
//     {
//       id: 3, type: 'Annual Leave', fromDate: '2024-02-05', toDate: '2024-02-07',
//       status: 'Pending', remarks: 'Awaiting manager approval'
//     },
//     {
//       id: 4, type: 'Sick Leave', fromDate: '2024-01-20', toDate: '2024-01-21',
//       status: 'Rejected', remarks: 'Insufficient documentation'
//     },
//     {
//       id: 5, type: 'Casual Leave', fromDate: '2024-01-25', toDate: '2024-01-25',
//       status: 'Pending', remarks: 'Family function'
//     },
//     {
//       id: 6, type: 'Annual Leave', fromDate: '2024-03-10', toDate: '2024-03-15',
//       status: 'Approved', remarks: 'Vacation planned'
//     },
//     {
//       id: 7, type: 'Sick Leave', fromDate: '2024-04-01', toDate: '2024-04-02',
//       status: 'Approved', remarks: 'Flu recovery'
//     },
//     {
//       id: 8, type: 'Casual Leave', fromDate: '2024-04-10', toDate: '2024-04-10',
//       status: 'Approved', remarks: 'Personal errands'
//     },
//     {
//       id: 9, type: 'Annual Leave', fromDate: '2024-05-20', toDate: '2024-05-25',
//       status: 'Pending', remarks: 'Family trip planned'
//     },
//     {
//       id: 10, type: 'Sick Leave', fromDate: '2024-06-05', toDate: '2024-06-06',
//       status: 'Approved', remarks: 'Dental surgery recovery'
//     },
//     {
//       id: 11, type: 'Casual Leave', fromDate: '2024-06-15', toDate: '2024-06-15',
//       status: 'Rejected', remarks: 'Exceeded casual leave quota'
//     },
//     {
//       id: 12, type: 'Annual Leave', fromDate: '2024-07-01', toDate: '2024-07-05',
//       status: 'Approved', remarks: 'Summer vacation'
//     },
//     {
//       id: 13, type: 'Sick Leave', fromDate: '2024-07-10', toDate: '2024-07-11',
//       status: 'Pending', remarks: 'Under medical observation'
//     },
//     {
//       id: 14, type: 'Casual Leave', fromDate: '2024-07-20', toDate: '2024-07-20',
//       status: 'Approved', remarks: 'Household work'
//     },
//     {
//       id: 15, type: 'Annual Leave', fromDate: '2024-08-15', toDate: '2024-08-20',
//       status: 'Approved', remarks: 'Traveling abroad'
//     },
//     {
//       id: 16, type: 'Sick Leave', fromDate: '2024-08-25', toDate: '2024-08-26',
//       status: 'Rejected', remarks: 'No medical proof provided'
//     },
//     {
//       id: 17, type: 'Casual Leave', fromDate: '2024-09-05', toDate: '2024-09-05',
//       status: 'Pending', remarks: 'Attending a wedding'
//     },
//     {
//       id: 18, type: 'Annual Leave', fromDate: '2024-09-15', toDate: '2024-09-20',
//       status: 'Approved', remarks: 'Visiting family'
//     },
//     {
//       id: 19, type: 'Sick Leave', fromDate: '2024-10-01', toDate: '2024-10-02',
//       status: 'Approved', remarks: 'Surgery recovery'
//     },
//     {
//       id: 20, type: 'Casual Leave', fromDate: '2024-10-10', toDate: '2024-10-10',
//       status: 'Approved', remarks: 'Personal commitments'
//     }
//   ]);

//   // Handlers
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleApplyLeave = () => {
//     if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
//       alert('Please fill in all fields');
//       return;
//     }
//     alert(`Leave application submitted:\nType: ${formData.type}\nFrom: ${formData.startDate}\nTo: ${formData.endDate}\nReason: ${formData.reason}`);
//     setFormData({ type: '', startDate: '', endDate: '', reason: '' });
//   };

//   // --- Filter Handler ---
//   const handleFilterSelect = (status) => {
//     setFilterStatus(status);
//     setShowFilterDropdown(false);
//     setCurrentPage(1);
//   };

//   // Calculate duration between dates
//   const calculateDuration = (fromDate, toDate) => {
//     const start = new Date(fromDate);
//     const end = new Date(toDate);
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
//   };

//   // Filter leaves
//   const filteredLeaves = leaveData.filter(leave => {
//     const matchesSearch = leave.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       leave.remarks.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = filterStatus === 'All' || leave.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredLeaves.length / entriesPerPage);
//   const displayedLeaves = filteredLeaves.slice(
//     (currentPage - 1) * entriesPerPage,
//     currentPage * entriesPerPage
//   );

//   // Utility function
//   const getStatusStyle = (status) => {
//     const styles = {
//       'Approved': 'bg-green-100 text-green-700',
//       'Pending': 'bg-yellow-100 text-yellow-700',
//       'Rejected': 'bg-red-100 text-red-700'
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
//               <button
//                 className="lg:hidden text-white"
//                 onClick={() => setIsSidebarOpen(true)}
//               >
//                 <Menu size={24} />
//               </button>
//               <h2 className="text-2xl font-bold text-white">My Leaves</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-white hidden sm:block">Welcome,</span>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
//                 <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
//                   SJ
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 space-y-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//             {summaryCards.map((card, index) => {
//               const Icon = card.icon;
//               return (
//                 <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <p className="text-sm text-gray-600 mb-1">{card.title}</p>
//                       <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
//                     </div>
//                     <div className={`p-3 rounded-lg ${card.bgColor}`}>
//                       <Icon className={card.color} size={24} />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Apply Leave Form */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
//                 <CalendarCheck size={18} className="text-[#246e72]" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">Apply for Leave</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
//                 <select
//                   name="type"
//                   value={formData.type}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                 >
//                   <option value="">Select leave type</option>
//                   <option value="Sick Leave">Sick Leave</option>
//                   <option value="Casual Leave">Casual Leave</option>
//                   <option value="Annual Leave">Annual Leave</option>
//                   <option value="Emergency Leave">Emergency Leave</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
//                 <textarea
//                   name="reason"
//                   value={formData.reason}
//                   onChange={handleFormChange}
//                   placeholder="Please provide a reason for your leave request..."
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none resize-none text-sm"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <button
//                 onClick={handleApplyLeave}
//                 className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-[#1a5256] font-medium transition-colors text-sm"
//               >
//                 Apply Leave
//               </button>
//             </div>
//           </div>

//           {/* Leave History Table */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
//                 <CalendarCheck size={18} className="text-[#246e72]" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">Leave History</h3>
//             </div>

//             {/* --- UPDATED TABLE CONTROLS (MATCHES ADMIN THEME) --- */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search leave records..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                   />
//                 </div>

//                 <div className="relative">
//                   <button
//                     onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                     className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 text-sm ${filterStatus !== 'All' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-[#246e72] text-white hover:bg-teal-700'}`}
//                   >
//                     <Filter size={18} />
//                     <span>{filterStatus === 'All' ? 'Filter Status' : filterStatus}</span>
//                   </button>
//                   {showFilterDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                       <button onClick={() => handleFilterSelect('All')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">All Status</button>
//                       <button onClick={() => handleFilterSelect('Approved')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Approved</button>
//                       <button onClick={() => handleFilterSelect('Pending')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Pending</button>
//                       <button onClick={() => handleFilterSelect('Rejected')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Rejected</button>
//                     </div>
//                   )}
//                 </div>

//                 <select
//                   value={entriesPerPage}
//                   onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                 >
//                   <option value={10}>Show 10</option>
//                   <option value={50}>Show 50</option>
//                   <option value={100}>Show 100</option>
//                 </select>

//                 <div className="relative">
//                   <button
//                     onClick={() => setShowExportDropdown(!showExportDropdown)}
//                     className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 text-sm"
//                   >
//                     <Download size={18} />
//                     <span>Export</span>
//                   </button>
//                   {showExportDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Excel</button>
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">PDF</button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">LEAVE TYPE</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">FROM DATE</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TO DATE</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DURATION</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">REMARKS</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedLeaves.map(leave => (
//                     <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-4 px-4 text-sm text-gray-800 font-medium">{leave.type}</td>
//                       <td className="py-4 px-4 text-sm text-gray-700">{leave.fromDate}</td>
//                       <td className="py-4 px-4 text-sm text-gray-700">{leave.toDate}</td>
//                       <td className="py-4 px-4 text-sm text-gray-700">{calculateDuration(leave.fromDate, leave.toDate)}</td>
//                       <td className="py-4 px-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(leave.status)}`}>
//                           {leave.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4 text-sm text-gray-600">{leave.remarks}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
//               <p className="text-sm text-gray-600">
//                 Showing {displayedLeaves.length} of {filteredLeaves.length} leaves
//               </p>

//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
//                 >
//                   <ChevronLeft size={16} />
//                   <span className="hidden sm:inline">Previous</span>
//                 </button>

//                 {[...Array(totalPages)].map((_, index) => (
//                   <button
//                     key={index + 1}
//                     onClick={() => setCurrentPage(index + 1)}
//                     className={`w-10 h-10 rounded-lg transition-colors text-sm font-medium ${currentPage === index + 1
//                         ? 'bg-[#246e72] text-white'
//                         : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
//                       }`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
//                 >
//                   <span className="hidden sm:inline">Next</span>
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StaffLeaves;
import React, { useEffect, useState } from 'react';
import {
  CalendarCheck, Clock, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Menu, Filter, Download,
  Loader2, AlertCircle
} from 'lucide-react';
import StaffSidebar from './StaffSidebar';
import api from '../services/api';
=======
import React, { useState } from 'react';
import { 
  CalendarCheck, Clock, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Menu, Filter, Download
} from 'lucide-react';
import StaffSidebar from './StaffSidebar';
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f

const StaffLeaves = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
<<<<<<< HEAD

  // Filter State
=======
  
  // --- UPDATED FILTER STATE ---
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

<<<<<<< HEAD
  // Backend State
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState({
    totalLeavesTaken: 0,
    remainingLeaves: 0,
    pendingApprovals: 0,
    rejectedLeaves: 0
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState({
    summary: true,
    leaves: true,
    apply: false
  });
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ name: 'Loading...', initials: 'U' });

=======
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
  // Form Data
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

<<<<<<< HEAD
  // Summary Cards Data with icons
  const summaryCards = [
    {
      title: 'Total Leaves Taken',
      value: summary.totalLeavesTaken,
      icon: CalendarCheck,
      color: 'text-[#246e72]',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Remaining Leaves',
      value: summary.remainingLeaves,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Approvals',
      value: summary.pendingApprovals,
      icon: CheckCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Rejected Requests',
      value: summary.rejectedLeaves,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

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

  // Fetch leaves summary
  const fetchSummary = async () => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      const response = await api.get('/leaves/summary');
      setSummary(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leave summary:', err);
      setError('Failed to load leave summary');
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  // Fetch leaves with pagination and filters
  const fetchLeaves = async () => {
    try {
      setLoading(prev => ({ ...prev, leaves: true }));

      const params = {
        page: currentPage,
        limit: entriesPerPage,
        search: searchQuery || undefined
      };

      // Only add status filter if not 'All'
      if (filterStatus !== 'All') {
        params.status = filterStatus;
      }

      const response = await api.get('/leaves/my', { params });
      setLeaves(response.data.data || response.data.leaves || []);
      setTotalRecords(response.data.total || response.data.pagination?.total || 0);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
      setError('Failed to load leave history');
      setLeaves([]);
      setTotalRecords(0);
    } finally {
      setLoading(prev => ({ ...prev, leaves: false }));
    }
  };

  // Handle apply leave
  const handleApplyLeave = async () => {
    const { type, startDate, endDate, reason } = formData;

    // Validation
    if (!type || !startDate || !endDate || !reason) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('End date must be after start date');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, apply: true }));

      const leaveData = {
        type,
        startDate,
        endDate,
        reason: reason.trim()
      };


      await api.post('/leaves/apply', leaveData);

      alert('Leave application submitted successfully!');

      // Reset form
      setFormData({
        type: '',
        startDate: '',
        endDate: '',
        reason: ''
      });

      // Refresh data
      fetchLeaves();
      fetchSummary();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to apply for leave';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(prev => ({ ...prev, apply: false }));
    }
  };

  // Handle filter selection
  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle export
  const handleExport = async (format) => {
    try {
      const response = await api.get(`/leaves/export/${format}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leaves_export_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert(`${format.toUpperCase()} export completed!`);
    } catch (err) {
      alert(`Failed to export ${format}: ${err.response?.data?.message || err.message}`);
    }
=======
  // Summary Cards Data
  const summaryCards = [
    { title: 'Total Leaves Taken', value: '8', icon: CalendarCheck, color: 'text-[#246e72]', bgColor: 'bg-teal-50' },
    { title: 'Remaining Leaves', value: '12', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Pending Approvals', value: '2', icon: CheckCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Rejected Requests', value: '1', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  // Leave History Data
  const [leaveData] = useState([
    { 
      id: 1, type: 'Sick Leave', fromDate: '2024-01-15', toDate: '2024-01-16', 
      status: 'Approved', remarks: 'Medical certificate verified'
    },
    { 
      id: 2, type: 'Casual Leave', fromDate: '2024-01-10', toDate: '2024-01-10', 
      status: 'Approved', remarks: 'Personal work'
    },
    { 
      id: 3, type: 'Annual Leave', fromDate: '2024-02-05', toDate: '2024-02-07', 
      status: 'Pending', remarks: 'Awaiting manager approval'
    },
    { 
      id: 4, type: 'Sick Leave', fromDate: '2024-01-20', toDate: '2024-01-21', 
      status: 'Rejected', remarks: 'Insufficient documentation'
    },
    { 
      id: 5, type: 'Casual Leave', fromDate: '2024-01-25', toDate: '2024-01-25', 
      status: 'Pending', remarks: 'Family function'
    },
    { 
      id: 6, type: 'Annual Leave', fromDate: '2024-03-10', toDate: '2024-03-15', 
      status: 'Approved', remarks: 'Vacation planned'
    },
    { 
      id: 7, type: 'Sick Leave', fromDate: '2024-04-01', toDate: '2024-04-02', 
      status: 'Approved', remarks: 'Flu recovery'
    },
    { 
      id: 8, type: 'Casual Leave', fromDate: '2024-04-10', toDate: '2024-04-10', 
      status: 'Approved', remarks: 'Personal errands'
    },
    {
      id: 9, type: 'Annual Leave', fromDate: '2024-05-20', toDate: '2024-05-25',
      status: 'Pending', remarks: 'Family trip planned'
    },
    {
      id: 10, type: 'Sick Leave', fromDate: '2024-06-05', toDate: '2024-06-06',
      status: 'Approved', remarks: 'Dental surgery recovery'
    },
    {
      id: 11, type: 'Casual Leave', fromDate: '2024-06-15', toDate: '2024-06-15',
      status: 'Rejected', remarks: 'Exceeded casual leave quota'
    },
    { 
      id: 12, type: 'Annual Leave', fromDate: '2024-07-01', toDate: '2024-07-05',
      status: 'Approved', remarks: 'Summer vacation'
    },
    {
      id: 13, type: 'Sick Leave', fromDate: '2024-07-10', toDate: '2024-07-11',
      status: 'Pending', remarks: 'Under medical observation'
    },
    {
      id: 14, type: 'Casual Leave', fromDate: '2024-07-20', toDate: '2024-07-20',
      status: 'Approved', remarks: 'Household work'
    },
    {
      id: 15, type: 'Annual Leave', fromDate: '2024-08-15', toDate: '2024-08-20',
      status: 'Approved', remarks: 'Traveling abroad'
    },
    {
      id: 16, type: 'Sick Leave', fromDate: '2024-08-25', toDate: '2024-08-26',
      status: 'Rejected', remarks: 'No medical proof provided'
    },
    {
      id: 17, type: 'Casual Leave', fromDate: '2024-09-05', toDate: '2024-09-05',
      status: 'Pending', remarks: 'Attending a wedding'
    },
    { 
      id: 18, type: 'Annual Leave', fromDate: '2024-09-15', toDate: '2024-09-20',
      status: 'Approved', remarks: 'Visiting family'
    },
    { 
      id: 19, type: 'Sick Leave', fromDate: '2024-10-01', toDate: '2024-10-02',
      status: 'Approved', remarks: 'Surgery recovery'
    },
    {
      id: 20, type: 'Casual Leave', fromDate: '2024-10-10', toDate: '2024-10-10',
      status: 'Approved', remarks: 'Personal commitments'
    } 
  ]);

  // Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyLeave = () => {
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Leave application submitted:\nType: ${formData.type}\nFrom: ${formData.startDate}\nTo: ${formData.endDate}\nReason: ${formData.reason}`);
    setFormData({ type: '', startDate: '', endDate: '', reason: '' });
  };

  // --- Filter Handler ---
  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
    setCurrentPage(1);
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
  };

  // Calculate duration between dates
  const calculateDuration = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

<<<<<<< HEAD
  // Get status badge style
=======
  // Filter leaves
  const filteredLeaves = leaveData.filter(leave => {
    const matchesSearch = leave.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          leave.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeaves.length / entriesPerPage);
  const displayedLeaves = filteredLeaves.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Utility function
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
  const getStatusStyle = (status) => {
    const styles = {
      'Approved': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
<<<<<<< HEAD
      'Rejected': 'bg-red-100 text-red-700',
      'Cancelled': 'bg-gray-100 text-gray-700'
=======
      'Rejected': 'bg-red-100 text-red-700'
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

<<<<<<< HEAD
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalRecords / entriesPerPage);
  const startItem = totalRecords > 0 ? ((currentPage - 1) * entriesPerPage) + 1 : 0;
  const endItem = Math.min(currentPage * entriesPerPage, totalRecords);

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [currentPage, entriesPerPage, filterStatus, searchQuery]);

  // Reset to first page when entries per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

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
              <h2 className="text-2xl font-bold text-white">My Leaves</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
<<<<<<< HEAD
                <span className="text-sm font-medium text-white hidden sm:block">{user.name}</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  {user.initials}
=======
                <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
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

=======
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{card.title}</p>
<<<<<<< HEAD
                      {loading.summary ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                          <span className="text-sm text-gray-500">Loading...</span>
                        </div>
                      ) : (
                        <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                      )}
=======
                      <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                    </div>
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <Icon className={card.color} size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Apply Leave Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <CalendarCheck size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Apply for Leave</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
<<<<<<< HEAD
                  disabled={loading.apply}
=======
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                >
                  <option value="">Select leave type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
<<<<<<< HEAD
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
=======
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
<<<<<<< HEAD
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                  disabled={loading.apply}
=======
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
<<<<<<< HEAD
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                  disabled={loading.apply}
=======
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleFormChange}
                  placeholder="Please provide a reason for your leave request..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none resize-none text-sm"
<<<<<<< HEAD
                  disabled={loading.apply}
=======
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                />
              </div>
            </div>

<<<<<<< HEAD
            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={handleApplyLeave}
                disabled={loading.apply}
                className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-[#1a5256] font-medium transition-colors text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.apply ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  'Apply Leave'
                )}
              </button>

              <button
                onClick={() => setFormData({ type: '', startDate: '', endDate: '', reason: '' })}
                className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading.apply}
              >
                Clear
=======
            <div className="mt-6">
              <button
                onClick={handleApplyLeave}
                className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-[#1a5256] font-medium transition-colors text-sm"
              >
                Apply Leave
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
              </button>
            </div>
          </div>

          {/* Leave History Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <CalendarCheck size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Leave History</h3>
            </div>

<<<<<<< HEAD
            {/* Table Controls */}
=======
            {/* --- UPDATED TABLE CONTROLS (MATCHES ADMIN THEME) --- */}
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search leave records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                  />
                </div>

                <div className="relative">
<<<<<<< HEAD
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 text-sm ${filterStatus !== 'All' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-[#246e72] text-white hover:bg-teal-700'}`}
                    disabled={loading.leaves}
=======
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
                    className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 text-sm ${filterStatus !== 'All' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-[#246e72] text-white hover:bg-teal-700'}`}
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                  >
                    <Filter size={18} />
                    <span>{filterStatus === 'All' ? 'Filter Status' : filterStatus}</span>
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button onClick={() => handleFilterSelect('All')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">All Status</button>
<<<<<<< HEAD
                      <button onClick={() => handleFilterSelect('Pending')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Pending</button>
                      <button onClick={() => handleFilterSelect('Approved')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Approved</button>
=======
                      <button onClick={() => handleFilterSelect('Approved')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Approved</button>
                      <button onClick={() => handleFilterSelect('Pending')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Pending</button>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                      <button onClick={() => handleFilterSelect('Rejected')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Rejected</button>
                    </div>
                  )}
                </div>

                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
<<<<<<< HEAD
                  disabled={loading.leaves}
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

                <div className="relative">
<<<<<<< HEAD
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 text-sm"
                    disabled={loading.leaves}
=======
                  <button 
                    onClick={() => setShowExportDropdown(!showExportDropdown)} 
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 text-sm"
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                  >
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  {showExportDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
<<<<<<< HEAD
                      <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Excel (CSV)</button>
                      <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">PDF</button>
=======
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Excel</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">PDF</button>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">LEAVE TYPE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">FROM DATE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TO DATE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DURATION</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">REMARKS</th>
                  </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                  {loading.leaves ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Loader2 className="h-8 w-8 animate-spin text-[#246e72]" />
                          <p className="text-sm text-gray-600">Loading leave history...</p>
                        </div>
                      </td>
                    </tr>
                  ) : leaves.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <CalendarCheck className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">No leave records found</p>
                          {searchQuery && (
                            <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    leaves.map(leave => (
                      <tr key={leave._id || leave.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-800 font-medium">{leave.leaveType || leave.type}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{formatDate(leave.startDate)}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{formatDate(leave.endDate)}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {calculateDuration(leave.startDate, leave.endDate)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(leave.status)}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate" title={leave.reason}>
                          {leave.reason || '-'}
                        </td>
                      </tr>
                    ))
                  )}
=======
                  {displayedLeaves.map(leave => (
                    <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">{leave.type}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{leave.fromDate}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{leave.toDate}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{calculateDuration(leave.fromDate, leave.toDate)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{leave.remarks}</td>
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
                {loading.leaves ? (
                  'Loading...'
                ) : (
                  `Showing ${startItem} to ${endItem} of ${totalRecords} leaves`
                )}
              </p>

              {totalPages > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading.leaves}
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
                        disabled={loading.leaves}
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
                    disabled={currentPage === totalPages || loading.leaves}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
=======
                Showing {displayedLeaves.length} of {filteredLeaves.length} leaves
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

export default StaffLeaves;
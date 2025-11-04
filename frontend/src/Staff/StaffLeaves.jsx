import React, { useState } from 'react';
import { 
  CalendarCheck, Clock, CheckCircle, XCircle,
  Edit, Trash2, ChevronLeft, ChevronRight, 
  X, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffLeaves = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  // Form Data
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/staff/dashboard' },
    { name: 'Orders', path: '/staff/orders' },
    { name: 'Tasks', path: '/staff/tasks' },
    { name: 'Attendance', path: '/staff/attendance' },
    { name: 'Leaves', path: '/staff/leaves' },
    { name: 'Logout', path: '/' }
  ];

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
      id: 1, 
      type: 'Sick Leave', 
      fromDate: '2024-01-15', 
      toDate: '2024-01-16', 
      status: 'Approved',
      remarks: 'Medical certificate verified'
    },
    { 
      id: 2, 
      type: 'Casual Leave', 
      fromDate: '2024-01-10', 
      toDate: '2024-01-10', 
      status: 'Approved',
      remarks: 'Personal work'
    },
    { 
      id: 3, 
      type: 'Annual Leave', 
      fromDate: '2024-02-05', 
      toDate: '2024-02-07', 
      status: 'Pending',
      remarks: 'Awaiting manager approval'
    },
    { 
      id: 4, 
      type: 'Sick Leave', 
      fromDate: '2024-01-20', 
      toDate: '2024-01-21', 
      status: 'Rejected',
      remarks: 'Insufficient documentation'
    },
    { 
      id: 5, 
      type: 'Casual Leave', 
      fromDate: '2024-01-25', 
      toDate: '2024-01-25', 
      status: 'Pending',
      remarks: 'Family function'
    },
    { 
      id: 6, 
      type: 'Annual Leave', 
      fromDate: '2024-03-10', 
      toDate: '2024-03-15', 
      status: 'Approved',
      remarks: 'Vacation planned'
    }
  ]);

  // Handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyLeave = () => {
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Leave application submitted:\nType: ${formData.type}\nFrom: ${formData.startDate}\nTo: ${formData.endDate}\nReason: ${formData.reason}`);
    setFormData({ type: '', startDate: '', endDate: '', reason: '' });
  };

  // Calculate duration between dates
  const calculateDuration = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

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
  const getStatusStyle = (status) => {
    const styles = {
      'Approved': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      {/* Mobile Sidebar Overlay */}
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
                ${item.path === '/staff/leaves'
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
              <h2 className="text-2xl font-bold text-white">My Leaves</h2>
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

        {/* Main Content */}
        <main className="p-4 lg:p-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                      <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
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
                >
                  <option value="">Select leave type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
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
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleApplyLeave}
                className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-[#1a5256] font-medium transition-colors text-sm"
              >
                Apply Leave
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

            {/* Table Controls */}
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

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                >
                  <option value={10}>Show 10</option>
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>
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
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLeaves;
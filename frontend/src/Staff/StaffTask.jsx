import React, { useState } from 'react';
import { 
  ClipboardCheck, CheckCircle, Clock, AlertTriangle,
  Edit, Trash2, Download, ChevronLeft, ChevronRight, 
  X, Menu, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffTask = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const navigate = useNavigate();

  // Form Data for adding personal task/note
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    deadline: ''
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

  // Summary stats
  const summaryCards = [
    { title: 'Total Tasks Assigned', value: '24', icon: ClipboardCheck, color: 'text-[#246e72]', bgColor: 'bg-teal-50' },
    { title: 'Completed Tasks', value: '16', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Pending Tasks', value: '6', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Overdue Tasks', value: '2', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  // Tasks Data
  const [tasks] = useState([
    { 
      id: 1, 
      title: 'Inventory Stock Check', 
      description: 'Verify and update stock levels for all medications in storage', 
      priority: 'High', 
      deadline: '2024-01-15', 
      status: 'Pending' 
    },
    { 
      id: 2, 
      title: 'Customer Prescription Review', 
      description: 'Review and process pending prescriptions from morning shift', 
      priority: 'Medium', 
      deadline: '2024-01-14', 
      status: 'In Progress' 
    },
    { 
      id: 3, 
      title: 'Equipment Maintenance', 
      description: 'Monthly equipment check and cleaning of pharmacy tools', 
      priority: 'Low', 
      deadline: '2024-01-20', 
      status: 'Pending' 
    },
    { 
      id: 4, 
      title: 'Monthly Sales Report', 
      description: 'Compile and analyze monthly sales data for management review', 
      priority: 'Medium', 
      deadline: '2024-01-18', 
      status: 'Completed' 
    },
    { 
      id: 5, 
      title: 'Staff Training Session', 
      description: 'Conduct training on new pharmacy software system', 
      priority: 'High', 
      deadline: '2024-01-10', 
      status: 'Overdue' 
    },
    { 
      id: 6, 
      title: 'Update Medicine Database', 
      description: 'Add new medicines and update pricing information', 
      priority: 'Medium', 
      deadline: '2024-01-16', 
      status: 'In Progress' 
    }
  ]);

  // Handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

    const handleViewTask = (task) => {
    alert(`Viewing details for task: ${task.title}`);
    };

    const handleUpdateTask = (task) => {
    alert(`Updating status for task: ${task.title}`);
    };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
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
      'Pending': 'bg-yellow-100 text-yellow-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700',
      'Overdue': 'bg-red-100 text-red-700'
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
                ${item.path === '/staff/tasks'
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
              <h2 className="text-2xl font-bold text-white">My Tasks</h2>
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

          {/* Tasks Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ClipboardCheck size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">My Task List</h3>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search my tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                  />
                </div>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">TASK TITLE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DESCRIPTION</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PRIORITY</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DEADLINE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTasks.map(task => (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">{task.title}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{task.description}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{task.deadline}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">
                Showing {displayedTasks.length} of {filteredTasks.length} tasks
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

export default StaffTask;
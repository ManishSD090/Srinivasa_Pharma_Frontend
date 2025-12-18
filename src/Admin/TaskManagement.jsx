import React, { useState } from 'react';
import { 
  Edit, Trash2, Download, 
  ChevronLeft, ChevronRight, X, 
  CheckCircle, Menu, Users, 
  AlertTriangle, Plus, Filter, Check, XCircle
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const TaskManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- FILTER STATE (Matches OrdersPage) ---
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showVolunteerApproval, setShowVolunteerApproval] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // State for Creating a Task
  const [formData, setFormData] = useState({
    title: '', description: '', priority: '', dueDate: '', assignedTo: ''
  });

  // State for Editing a Task
  const [editFormData, setEditFormData] = useState({
    id: null, title: '', description: '', priority: '', dueDate: '', assignedTo: '', status: ''
  });

  // --- Tasks Data ---
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Inventory Stock Check', description: 'Check all medication stock levels', assignedTo: 'Dr. Sarah Johnson', priority: 'High', dueDate: '2025-11-15', status: 'In Progress' },
    { id: 2, title: 'Customer Prescription Review', description: 'Review pending prescriptions', assignedTo: 'Open for volunteer', priority: 'Medium', dueDate: '2025-11-18', status: 'Not Started' },
    { id: 3, title: 'Equipment Maintenance', description: 'Monthly equipment check and cleaning', assignedTo: 'Lisa Anderson', priority: 'Low', dueDate: '2025-10-10', status: 'Overdue' },
    { id: 4, title: 'Monthly Sales Report', description: 'Compile and analyze monthly sales data', assignedTo: 'Mike Chen', priority: 'Medium', dueDate: '2025-11-20', status: 'Completed' }
  ]);

  // --- NEW: Status Change Requests (From Staff) ---
  const [statusRequests, setStatusRequests] = useState([
    { id: 101, taskId: 1, taskTitle: 'Inventory Stock Check', staffName: 'Dr. Sarah Johnson', requestedStatus: 'Completed', currentStatus: 'In Progress' },
    { id: 102, taskId: 3, taskTitle: 'Equipment Maintenance', staffName: 'Lisa Anderson', requestedStatus: 'In Progress', currentStatus: 'Overdue' }
  ]);

  const volunteerRequests = [
    { id: 1, name: 'John Smith', taskId: 2, taskTitle: 'Customer Prescription Review', initial: 'JS', color: 'bg-cyan-400' },
    { id: 2, name: 'Emma Wilson', taskId: 6, taskTitle: 'Supplier Order Review', initial: 'EW', color: 'bg-teal-400' }
  ];

  // --- Handlers ---

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = () => {
    const newTask = {
      id: tasks.length + 1,
      ...formData,
      status: 'Not Started',
    };
    setTasks([...tasks, newTask]);
    setFormData({ title: '', description: '', priority: '', dueDate: '', assignedTo: '' });
  };

  const handleDeleteTask = () => {
    setTasks(tasks.filter(t => t.id !== selectedTask.id));
    setShowDeleteModal(false);
    setSelectedTask(null);
  };

  const handleEditClick = (task) => {
    setEditFormData(task);
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map(t => t.id === editFormData.id ? editFormData : t));
    setShowEditModal(false);
  };

  // --- Filter Handler ---
  const handleFilterSelect = (status) => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  // --- NEW: Status Approval Handlers ---
  const approveStatusChange = (request) => {
    // Update the actual task status
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === request.taskId ? { ...task, status: request.requestedStatus } : task
    ));
    // Remove request from list
    setStatusRequests(prev => prev.filter(r => r.id !== request.id));
    alert(`Approved: Task "${request.taskTitle}" marked as ${request.requestedStatus}`);
  };

  const rejectStatusChange = (requestId) => {
    setStatusRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // --- Filtering Logic ---
  const overdueTasks = tasks.filter(task => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const dueDate = new Date(task.dueDate);
    return task.status !== 'Completed' && dueDate < today;
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTasks.length / entriesPerPage);
  const displayedTasks = filteredTasks.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  
  const getPriorityBadge = (priority) => {
    const styles = { 'High': 'bg-red-100 text-red-700', 'Medium': 'bg-yellow-100 text-yellow-700', 'Low': 'bg-green-100 text-green-700' };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status) => {
    const styles = { 'Not Started': 'bg-gray-100 text-gray-700', 'In Progress': 'bg-blue-100 text-blue-700', 'Completed': 'bg-green-100 text-green-700', 'Overdue': 'bg-red-100 text-red-700' };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      {isSidebarOpen && <div className="fixed inset-0 bg-none z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-white">Task Management</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome back,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Dr. Admin</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">DA</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
          
          {/* Create Task Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Plus size={24} className="text-[#246e72]" />
              <h2 className="text-xl font-bold text-gray-800">Create New Task</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="Enter task title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
                  <option value="">Select Staff Member</option>
                  <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                  <option value="Mike Chen">Mike Chen</option>
                  <option value="Lisa Anderson">Lisa Anderson</option>
                  <option value="Open for volunteer">Open for volunteer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select name="priority" value={formData.priority} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Enter task description" rows="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
            </div>
            <button onClick={handleCreateTask} className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium">+ Create Task</button>
          </div>

          {overdueTasks.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-yellow-600" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800">Tasks Requiring Urgent Attention</h3>
                  <p className="text-sm text-gray-600">{overdueTasks.length} overdue task(s) need immediate action</p>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">{overdueTasks.length} Overdue</span>
            </div>
          )}

          {/* Task List Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><CheckCircle size={18} className="text-[#246e72]" /></div>
              <h3 className="text-xl font-bold text-gray-800">All Tasks</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <input type="text" placeholder="Search tasks or staff..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
                
                {/* --- CUSTOM FILTER DROPDOWN (Matches OrdersPage Style) --- */}
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
                    className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 text-sm ${filterStatus !== 'All' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-[#246e72] text-white hover:bg-teal-700'}`}
                  >
                    <Filter size={18} />
                    <span>{filterStatus === 'All' ? 'Filter Status' : filterStatus}</span>
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button onClick={() => handleFilterSelect('All')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">All</button>
                      <button onClick={() => handleFilterSelect('Not Started')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Not Started</button>
                      <button onClick={() => handleFilterSelect('In Progress')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">In Progress</button>
                      <button onClick={() => handleFilterSelect('Completed')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Completed</button>
                      <button onClick={() => handleFilterSelect('Overdue')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Overdue</button>
                    </div>
                  )}
                </div>

                <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
                  <option value={10}>Show 10</option>
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>
              </div>
              <div className="relative">
                <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2">
                  <Download size={18} /><span>Export</span>
                </button>
                {showExportDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Export as Excel</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Export as PDF</button>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Task Details</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Assigned To</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Deadline</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTasks.map(task => (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-gray-800 font-medium">{task.title}</p>
                          <p className="text-xs text-gray-500 max-w-xs truncate">{task.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{task.assignedTo}</td>
                      <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>{task.priority}</span></td>
                      <td className="py-4 px-4 text-sm text-gray-700">{new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>{task.status}</span></td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditClick(task)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center" title="Edit Task"><Edit size={16} /></button>
                          <button onClick={() => { setSelectedTask(task); setShowDeleteModal(true); }} className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center" title="Delete Task"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">Showing {displayedTasks.length} of {filteredTasks.length} tasks</p>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-1 text-sm"><ChevronLeft size={16} /><span className="hidden sm:inline">Previous</span></button>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-1 text-sm"><span className="hidden sm:inline">Next</span><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* --- NEW SECTION: Pending Status Approvals --- */}
            {statusRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={18} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Pending Status Approvals</h3>
                </div>
                <div className="space-y-4">
                  {statusRequests.map(request => (
                    <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{request.taskTitle}</p>
                          <p className="text-xs text-gray-500">Requested by: <span className="font-medium text-gray-700">{request.staffName}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mb-4">
                        <span className={`px-2 py-0.5 rounded ${getStatusBadge(request.currentStatus)} opacity-70`}>{request.currentStatus}</span>
                        <span className="text-gray-400">→</span>
                        <span className={`px-2 py-0.5 rounded ${getStatusBadge(request.requestedStatus)} font-bold`}>{request.requestedStatus}</span>
                      </div>
                      <div className="flex space-x-3">
                        <button onClick={() => approveStatusChange(request)} className="flex-1 bg-[#246e72] text-white py-1.5 rounded hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-1"><CheckCircle size={14} /> Approve</button>
                        <button onClick={() => rejectStatusChange(request.id)} className="flex-1 bg-red-500 text-white py-1.5 rounded hover:bg-red-500 text-sm font-medium flex items-center justify-center gap-1"><XCircle size={14} /> Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Management (Existing) */}
            {volunteerRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Users size={18} className="text-[#246e72]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Volunteer Management</h3>
                </div>
                <div className="space-y-4">
                  {volunteerRequests.map(volunteer => (
                    <div key={volunteer.id} className="flex items-center justify-between bg-[#D2EAF4] rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${volunteer.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {volunteer.initial}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{volunteer.name}</p>
                          <p className="text-sm text-gray-600">Requested: {volunteer.taskTitle}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setSelectedVolunteer(volunteer); setShowVolunteerApproval(true); }} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm">Approve</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- UPDATED EDIT MODAL --- */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Task</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reassign To</label>
                <select name="assignedTo" value={editFormData.assignedTo} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
                  <option value="">Select Staff Member</option>
                  <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                  <option value="Mike Chen">Mike Chen</option>
                  <option value="Lisa Anderson">Lisa Anderson</option>
                  <option value="Open for volunteer">Open for volunteer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea name="description" value={editFormData.description} onChange={handleEditFormChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select name="priority" value={editFormData.priority} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
                    <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input type="date" name="dueDate" value={editFormData.dueDate} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">Cancel</button>
              <button onClick={handleUpdateTask} className="flex-1 px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete and Volunteer Modals remain unchanged... */}
      {showDeleteModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Delete Task</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete the task "{selectedTask.title}"? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">Cancel</button>
              <button onClick={handleDeleteTask} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">Delete Task</button>
            </div>
          </div>
        </div>
      )}

      {showVolunteerApproval && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Approve Volunteer Request</h3>
              <button onClick={() => setShowVolunteerApproval(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            </div>
            <div className="bg-[#D2EAF4] rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 ${selectedVolunteer.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {selectedVolunteer.initial}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedVolunteer.name}</p>
                  <p className="text-sm text-gray-600">Volunteer Request</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Task:</span><span className="font-medium text-gray-800">{selectedVolunteer.taskTitle}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Requested:</span><span className="font-medium text-gray-800">2 hours ago</span></div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowVolunteerApproval(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">Decline</button>
              <button onClick={() => setShowVolunteerApproval(false)} className="flex-1 px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">Approve Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
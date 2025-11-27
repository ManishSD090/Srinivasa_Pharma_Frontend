import React, { useState, useEffect } from 'react';
import { 
  Edit, Trash2, Download, 
  ChevronLeft, ChevronRight, X, 
  Users, Menu, CheckCircle, Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  
  // --- Modal States ---
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Controls the Edit Popup
  const [selectedLeaveStaff, setSelectedLeaveStaff] = useState(null);
  
  const navigate = useNavigate();
  
  // Inline Form Data (Add New Staff)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    salary: '',
    joiningDate: '',
    role: '',
    password: ''
  });

  // Edit Modal Form Data
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    phone: '',
    salary: '',
    joiningDate: '',
    role: '',
    password: '' // Added for completeness
  });

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard'},
    { name: 'Order Management', path: '/admin/orders' },
    { name: 'Inventory Checklist', path: '/admin/inventory' },
    { name: 'Staff Management', path: '/admin/staff' },
    { name: 'Task Management', path: '/admin/tasks' },
    { name: 'Payroll & Attendance', path: '/admin/payroll' },
    { name: 'Logout', path: '/' }
  ];

  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', phone: '+1 234-567-8901', salary: '₹4,500', joiningDate: '2020-01-15', leavingDate: '----', status: 'Active', initial: 'SJ', color: 'bg-cyan-400' },
    { id: 2, name: 'Mike Chen', phone: '+1 234-567-8902', salary: '₹2,800', joiningDate: '2023-03-10', leavingDate: '----', status: 'On Leave', initial: 'MC', color: 'bg-teal-400', leavePending: true },
    { id: 3, name: 'Emily Rodriguez', phone: '+1 234-567-8903', salary: '₹3,200', joiningDate: '2023-02-20', leavingDate: '----', status: 'Active', initial: 'ER', color: 'bg-emerald-400' },
    { id: 4, name: 'James Wilson', phone: '+1 234-567-8904', salary: '₹2,500', joiningDate: '2021-04-05', leavingDate: '2023-01-15', status: 'Resigned', initial: 'JW', color: 'bg-green-400' },
    { id: 5, name: 'Lisa Anderson', phone: '+1 234-567-8905', salary: '₹5,200', joiningDate: '2023-01-01', leavingDate: '----', status: 'Active', initial: 'LA', color: 'bg-lime-400' },
    { id: 6, name: 'David Kumar', phone: '+1 234-567-8906', salary: '₹4,300', joiningDate: '2023-05-12', leavingDate: '----', status: 'Active', initial: 'DK', color: 'bg-cyan-500' }
  ]);

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          staff.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'All' || staff.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredStaff.length / entriesPerPage);
  const displayedStaff = filteredStaff.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // --- Handlers ---

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = () => {
    if(!formData.name || !formData.phone) { alert("Name and Phone are required"); return; }
    const newStaff = {
      ...formData,
      id: Date.now(),
      status: 'Active',
      leavingDate: '----',
      initial: formData.name.substring(0,2).toUpperCase(),
      color: 'bg-teal-500'
    };
    setStaffList([...staffList, newStaff]);
    setFormData({ name: '', phone: '', salary: '', joiningDate: '', role: '', password: '' });
  };

  // OPEN EDIT POPUP
  const handleEdit = (staff) => {
    if (staff) {
      // Editing existing staff
      setEditFormData(staff);
    } else {
      // Button clicked without staff (e.g. the one near title) - treat as Add or Empty
      setEditFormData({ id: null, name: '', phone: '', salary: '', joiningDate: '', role: '', password: '' });
    }
    setShowEditModal(true);
  };

  // SAVE CHANGES FROM POPUP
  const handleUpdateStaff = () => {
    if (editFormData.id) {
      // Update existing
      setStaffList(staffList.map(s => s.id === editFormData.id ? editFormData : s));
    } else {
      // Add new (if used as Add button)
      const newStaff = {
        ...editFormData,
        id: Date.now(),
        status: 'Active',
        leavingDate: '----',
        initial: editFormData.name ? editFormData.name.substring(0,2).toUpperCase() : '??',
        color: 'bg-teal-500'
      };
      setStaffList([...staffList, newStaff]);
    }
    setShowEditModal(false);
  };

  const handleDelete = (staff) => {
    if(window.confirm(`Delete ${staff.name}?`)) {
      setStaffList(staffList.filter(s => s.id !== staff.id));
    }
  };

  const handleApproveLeave = (staff) => {
    setSelectedLeaveStaff(staff);
    setShowApproveModal(true);
  };

  const approveLeave = () => {
    setShowApproveModal(false);
    setSelectedLeaveStaff(null);
  };

  const rejectLeave = () => {
    setShowApproveModal(false);
    setSelectedLeaveStaff(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-700',
      'On Leave': 'bg-yellow-100 text-yellow-700',
      'Resigned': 'bg-red-100 text-red-700'
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

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#246e72] font-bold text-xl">M</div>
              <div>
                <h1 className="text-xl font-bold text-white">Srinivasa Pharma</h1>
                <p className="text-xs text-white">Admin Panel</p>
              </div>
            </div>
            <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${window.location.pathname === item.path ? 'bg-teal-50 text-[#246e72] font-medium' : 'text-white hover:bg-gray-50 hover:text-[#246e72] font-medium'}`}
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
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Staff Management</h2>
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
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users size={24} className="text-[#246e72]" />
              <h2 className="text-xl font-bold text-gray-800">Add New Staff Member</h2>
              
              {/* --- YOUR ADDED BUTTON (Fixed to work) --- */}
              <button 
                onClick={() => handleEdit(null)} 
                className="w-8 h-8 bg-[#246e72] ml-4 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                title="Open Edit Popup"
                >
                  <Edit size={16} />
              </button>
              {/* --------------------------------------- */}

            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter full name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Enter phone number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <input type="text" name="salary" value={formData.salary} onChange={handleFormChange} placeholder="Enter salary amount" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder="Enter password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
            </div>

            <button onClick={handleAddStaff} className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium">
              + Add Staff Member
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <Users size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Staff List</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input type="text" placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
                  <option value="All">All Staff</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Resigned">Resigned</option>
                </select>
                <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
                  <option value={10}>Show 10</option>
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>
              </div>
              <div className="relative">
                <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2">
                  <Download size={18} />
                  <span>Export</span>
                </button>
                {showExportDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export as Excel</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export as PDF</button>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Staff Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone Number</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joining Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Leaving Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStaff.map(staff => (
                    <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${staff.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>{staff.initial}</div>
                          <span className="text-sm text-gray-700 font-medium">{staff.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{staff.phone}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{staff.salary}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{staff.joiningDate}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{staff.leavingDate}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(staff.status)}`}>{staff.status}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          {/* --- TABLE EDIT BUTTON --- */}
                          <button onClick={() => handleEdit(staff)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(staff)} className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center" title="Delete">
                            <Trash2 size={16} />
                          </button>
                          {staff.leavePending && (
                            <button onClick={() => handleApproveLeave(staff)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center" title="Approve Leave">
                              <CheckCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination ... */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">Showing {displayedStaff.length} of {filteredStaff.length} staff members</p>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-1 text-sm"><ChevronLeft size={16} /><span className="hidden sm:inline">Previous</span></button>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-1 text-sm"><span className="hidden sm:inline">Next</span><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- EDIT STAFF POPUP MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editFormData.id ? 'Edit Staff Details' : 'Add Staff Details'}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={editFormData.phone} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" placeholder="+91..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <input type="text" name="salary" value={editFormData.salary} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" placeholder="₹..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password (Optional)</label>
                <input type="password" name="password" value={editFormData.password} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" placeholder="******" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                <input type="date" name="joiningDate" value={editFormData.joiningDate} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leaving Date</label>
                <input type="date" name="leavingDate" value={editFormData.joiningDate} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdateStaff} className="px-6 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- LEAVE APPROVAL MODAL --- */}
      {showApproveModal && selectedLeaveStaff && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Approve Leave Request</h3>
              <button onClick={() => setShowApproveModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="bg-[#D2EAF4] rounded-lg p-4 mb-4">
                <p className="font-bold text-[#246e72]">{selectedLeaveStaff.name}</p>
                <p className="text-sm">Reason: Sick Leave</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={rejectLeave} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Reject</button>
              <button onClick={approveLeave} className="flex-1 px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700">Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
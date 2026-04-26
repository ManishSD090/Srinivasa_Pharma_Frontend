import React, { useState, useEffect } from 'react';
import {
  Edit, Trash2, Download,
  ChevronLeft, ChevronRight, X,
  Users, CheckCircle, Save, Loader2
} from 'lucide-react';
import { fetchAllStaff, fetchResignedStaff, updateStaff, createStaff } from '../services/staff.api';
import api from '../services/api'; // Ensure this points to your axios instance
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const StaffManagement = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // --- Modal States ---
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLeaveStaff, setSelectedLeaveStaff] = useState(null);
  const [updating, setUpdating] = useState(false);


  // Inline Form Data (Add New Staff) -> Added workHours
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salary: '',
    workHours: '',
    joiningDate: '',
    role: '',
    password: ''
  });

  // Edit Modal Form Data -> Added workHours
  const [editFormData, setEditFormData] = useState({
    _id: null,
    name: '',
    email: '',
    phone: '',
    salary: '',
    workHours: '',
    joiningDate: '',
    leavingDate: '',
    role: '',
    status: 'Active',   // ✅ NEW
    password: ''
  });


  const [staffList, setStaffList] = useState([]);
  const [resignedStaffList, setResignedStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const [activeRes, resignedRes] = await Promise.all([
        fetchAllStaff(),
        fetchResignedStaff()
      ]);

      // 🔴 ADD THESE TWO LINES 🔴
      console.log("Raw Active Staff Data:", activeRes.data);
      console.log("Raw Resigned Staff Data:", resignedRes.data);

      setStaffList(activeRes.data);
      setResignedStaffList(resignedRes.data);
    } catch (err) {
      // 🔴 UPDATE THIS LINE SO WE CAN SEE ERRORS 🔴
      console.error("API Fetch Error:", err.response || err);
      setError('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

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

  const formatStaffForExport = (staffArray) => {
    return staffArray.map(staff => ({
      Name: staff.name,
      Phone: staff.phone,
      Email: staff.userId?.email || "—",
      Role: staff.role,
      Salary: staff.salary,
      "Work Hours": staff.dailyWorkHrs,
      "Joining Date": staff.joiningDate
        ? new Date(staff.joiningDate).toLocaleDateString("en-GB")
        : "—",
      Status: staff.status
    }));
  };

  const exportStaffToExcel = () => {
    try {
      const data = formatStaffForExport(filteredStaff);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");

      XLSX.writeFile(
        workbook,
        `Staff_List_${new Date().toISOString().slice(0, 10)}.xlsx`
      );

      setShowExportDropdown(false);
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel");
    }
  };

  const exportStaffToPDF = () => {
    try {
      const doc = new jsPDF("landscape");

      const tableColumn = [
        "Name",
        "Phone",
        "Email",
        "Role",
        "Salary",
        "Work Hrs",
        "Joining Date",
        "Status"
      ];

      const tableRows = formatStaffForExport(filteredStaff).map(row => [
        row.Name,
        row.Phone,
        row.Email,
        row.Role,
        row.Salary,
        row["Work Hours"],
        row["Joining Date"],
        row.Status
      ]);

      doc.text("Staff Report", 14, 15);

      autoTable(doc, {
        startY: 20,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [36, 110, 114] }
      });

      doc.save(`Staff_List_${new Date().toISOString().slice(0, 10)}.pdf`);
      setShowExportDropdown(false);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF");
    }
  };


  // --- Handlers ---

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    setEditFormData(prev => {
      // Auto-set leaving date when resigning
      if (name === "status" && value === "Resigned") {
        return {
          ...prev,
          status: value,
          leavingDate: prev.leavingDate || new Date().toISOString().split("T")[0]
        };
      }

      // Clear leaving date if not resigned
      if (name === "status" && value !== "Resigned") {
        return {
          ...prev,
          status: value,
          leavingDate: ""
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };


  const handleAddStaff = async () => {
    if (!formData.role) {
      alert("Please select a staff role");
      return;
    }

    try {
      await createStaff({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        salary: formData.salary,
        joiningDate: formData.joiningDate,
        role: formData.role,
        dailyWorkHrs: formData.workHours,
        password: formData.password
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        salary: '',
        workHours: '',
        joiningDate: '',
        role: '',
        password: ''
      });

      loadStaff(); // 🔥 refresh from MongoDB
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add staff');
    }
  };


  // OPEN EDIT POPUP
  const handleEdit = (staff) => {
    if (staff) {
      setEditFormData({
        _id: staff._id, // User ID (keep for reference)
        staffDocId: staff.staffDocId, // ✅ ADD THIS: Actual Staff ID needed for backend
        name: staff.name,
        email: staff.userId?.email || '',
        phone: staff.phone,
        salary: staff.salary,
        workHours: staff.dailyWorkHrs,
        joiningDate: staff.joiningDate,
        leavingDate: staff.leavingDate,
        role: staff.role,
        status: staff.status,
        password: ''
      });
    }
    setShowEditModal(true);
  };

  const handleUpdateStaff = async () => {
    try {
      if (!editFormData.name || !editFormData.email || !editFormData.phone) {
        alert("Name, email and phone are required");
        return;
      }

      setUpdating(true);

      // CHANGE THIS LINE: Use staffDocId instead of _id
      await updateStaff(editFormData.staffDocId, {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        salary: editFormData.salary,
        dailyWorkHrs: editFormData.workHours || 8,
        role: editFormData.role,
        password: editFormData.password,
        status: editFormData.status,
        leavingDate: editFormData.leavingDate
      });

      setShowEditModal(false);
      loadStaff();
      alert("Staff updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update staff');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (staff) => {
    const confirm = window.confirm(
      `Mark ${staff.name} as Resigned? This will remove them from active staff list.`
    );

    if (!confirm) return;

    try {
      await updateStaff(staff._id, {
        status: 'Resigned'
      });

      loadStaff(); // refresh from MongoDB
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to resign staff');
    }
  };

  const handleRejoin = async (staff) => {
    const confirmRejoin = window.confirm(`Are you sure you want to rejoin ${staff.name}?`);
    if (!confirmRejoin) return;

    try {
      setLoading(true);
      // Calls the Patch route added to the backend
      await api.patch(`/staff/${staff.staffDocId}/rejoin`);

      alert(`${staff.name} has been successfully rejoined.`);
      loadStaff(); // Refresh the lists
    } catch (err) {
      alert(err.response?.data?.message || "Failed to rejoin staff");
    } finally {
      setLoading(false);
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
    <>
      {/* --- LOADING SPINNER OVERLAY --- */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 z-[100] flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-[#246e72] animate-spin" />
            <p className="text-[#246e72] font-semibold">Loading Staff Data...</p>
          </div>
        </div>
      )}

      <main className="p-4 lg:p-8 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Users size={24} className="text-[#246e72]" />
            <h2 className="text-xl font-bold text-gray-800">Add New Staff Member</h2>

            <button
              onClick={() => handleEdit(null)}
              className="w-8 h-8 bg-[#246e72] ml-4 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
              title="Open Edit Popup"
            >
              <Edit size={16} />
            </button>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="staff@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
              >
                <option value="">Select role</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Assistant">Assistant</option>
                <option value="Manager">Manager</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
              <input type="number" name="salary" value={formData.salary} onChange={handleFormChange} placeholder="Enter salary" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Work Hours</label>
              <input type="number" name="workHours" value={formData.workHours} onChange={handleFormChange} placeholder="e.g. 8" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
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
                  <button onClick={exportStaffToExcel} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Export as Excel</button>
                  <button onClick={exportStaffToPDF} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Export as PDF</button>
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
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Salary</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Work Hours</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joining Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedStaff.map(staff => (
                  <tr key={staff._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${staff.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>{staff.initial}</div>
                        <span className="text-sm text-gray-700 font-medium">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{staff.phone}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{staff.userId?.email || '—'}</td>
                    <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{staff.salary}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{staff.dailyWorkHrs} Hrs</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{staff.joiningDate}</td>
                    <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(staff.status)}`}>{staff.status}</span></td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(staff)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center" title="Edit"><Edit size={16} /></button>
                        {staff.leavePending && (
                          <button onClick={() => handleApproveLeave(staff)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center" title="Approve Leave"><CheckCircle size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-gray-600">Showing {displayedStaff.length} of {filteredStaff.length} staff members</p>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-1 text-sm"><ChevronLeft size={16} /><span className="hidden sm:inline">Previous</span></button>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center space-x-1 text-sm"><span className="hidden sm:inline">Next</span><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Users size={20} className="text-red-600" />
            <h3 className="text-xl font-bold text-gray-800">Resigned Staff</h3>
            <span className="ml-auto bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">{resignedStaffList.length} staff</span>
          </div>

          {resignedStaffList.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No resigned staff found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50 border-b border-red-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-red-800">Name</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-red-800">Phone</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-red-800">Role</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-red-800">Joining Date</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-red-800">Leaving Date</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-red-800">Status</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-red-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resignedStaffList.map((staff, index) => (
                    <tr key={staff._id} className={`border-b border-gray-100 hover:bg-red-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 text-red-700 rounded-lg flex items-center justify-center font-semibold text-sm">{staff.name?.charAt(0).toUpperCase()}</div>
                          <span className="text-sm font-medium text-gray-900">{staff.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{staff.phone}</td>
                      <td className="py-4 px-4"><span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{staff.role}</span></td>
                      <td className="py-4 px-4 text-sm text-gray-600">{new Date(staff.joiningDate).toLocaleDateString("en-GB")}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{staff.leavingDate ? new Date(staff.leavingDate).toLocaleDateString("en-GB") : "—"}</td>
                      <td className="py-4 px-4 text-center"><span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Resigned</span></td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleRejoin(staff)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center gap-1 mx-auto"
                          title="Rejoin Staff"
                        >
                          <CheckCircle size={14} /> Rejoin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- EDIT STAFF MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800">{editFormData._id ? 'Edit Staff Details' : 'Add Staff Details'}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={editFormData.phone} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <input type="text" name="salary" value={editFormData.salary} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Work Hours</label>
                <input type="number" name="workHours" value={editFormData.workHours} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Status</label>
                <select name="status" value={editFormData.status} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Resigned">Resigned</option>
                </select>
                {editFormData.status === 'Resigned' && <p className="text-xs text-red-600 mt-1">Marking as resigned will remove staff from active list.</p>}
              </div>
              {editFormData.status === "Resigned" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leaving Date <span className="text-red-500">*</span></label>
                  <input type="date" name="leavingDate" value={editFormData.leavingDate || ""} onChange={handleEditFormChange} className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdateStaff} disabled={updating} className="px-6 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50">
                <Save size={18} />
                {updating ? "Saving..." : "Save Changes"}
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
    </>
  );
};

export default StaffManagement;
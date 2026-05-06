import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Users, DollarSign,
  CheckSquare, Calendar
} from 'lucide-react';
import api from '../services/api';
import {
  fetchStatusRequests,
  approveStatusRequest,
  rejectStatusRequest
} from "../services/task.api";

const AdminDashboard = () => {
  // --- New Distributor State ---
  const [currentLeaves, setCurrentLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);


  // --- Data States from Backend ---
  const [orders, setOrders] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalOrdersToday: 0,
    staffCountToday: 0,
    totalAdvanceAmount: 0
  });
  const [loading, setLoading] = useState({
    orders: false,
    staff: false,
    tasks: false
  });
  // --- Task Status Approval ---
  const [statusRequests, setStatusRequests] = useState([]);
  const [loadingStatusRequests, setLoadingStatusRequests] = useState(false);


  const fetchPendingStatusRequests = async () => {
    try {
      setLoadingStatusRequests(true);
      const res = await fetchStatusRequests();
      setStatusRequests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch status requests", err);
    } finally {
      setLoadingStatusRequests(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPendingStatusRequests();
    fetchCurrentLeaves();
    fetchPendingLeaves();
  }, []);

  const handleApproveStatus = async (request) => {
    try {
      const acceptedTaskId = request.taskId?._id || request.taskId;
      await approveStatusRequest(request._id);
      
      // Winner takes all: filter out all requests for this task
      setStatusRequests(prev => prev.filter(r => (r.taskId?._id || r.taskId) !== acceptedTaskId));
      
      alert("Task status approved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to approve request");
    }
  };

  const handleRejectStatus = async (requestId) => {
    try {
      await rejectStatusRequest(requestId);
      setStatusRequests(prev => prev.filter(r => r._id !== requestId));
      alert("Task status request rejected");
    } catch (err) {
      console.error(err);
      alert("Failed to reject request");
    }
  };
  const handleApproveLeave = async (id) => {
    await api.put(`/leaves/admin/${id}/approve`);
    setPendingLeaves(prev => prev.filter(l => l._id !== id));
    alert("Leave approved");
  };

  const handleRejectLeave = async (id) => {
    await api.put(`/leaves/admin/${id}/reject`);
    setPendingLeaves(prev => prev.filter(l => l._id !== id));
    alert("Leave rejected");
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading({ orders: true, staff: true, tasks: true });

    // Use Promise.allSettled so one 500 error doesn't kill the whole dashboard
    const [ordersRes, staffRes, tasksRes] = await Promise.allSettled([
      api.get('/orders'),
      api.get('/staff'),
      api.get('/tasks')
    ]);

    // Process Orders
    const ordersData = ordersRes.status === 'fulfilled' ? (ordersRes.value.data || []) : [];
    setOrders(ordersData);

    // Process Staff (This is the one currently failing)
    const staffData = staffRes.status === 'fulfilled' ? (staffRes.value.data || []) : [];
    setStaffList(staffData);

    // Process Tasks
    const tasksData = tasksRes.status === 'fulfilled' ? (tasksRes.value.data || []) : [];
    setTasks(tasksData);

    // Calculate stats with whatever data we successfully got
    calculateStats(ordersData, staffData);

    // Log errors silently for the failed ones
    if (staffRes.status === 'rejected') console.error("Staff API failed:", staffRes.reason);

  } catch (error) {
    console.error('Critical Dashboard Error:', error);
    // Only alert if something truly catastrophic happens
  } finally {
    setLoading({ orders: false, staff: false, tasks: false });
  }
};

  const calculateStats = (ordersData = [], staffData = []) => {
  const today = new Date().toISOString().split('T')[0];

  // Use optional chaining and array checks
  const todayOrders = Array.isArray(ordersData) 
    ? ordersData.filter(order => order.date?.split('T')[0] === today)
    : [];

  const activeStaff = Array.isArray(staffData)
    ? staffData.filter(staff => staff.status === 'Active')
    : [];

  const totalAdvance = todayOrders.reduce((sum, order) =>
    sum + (Number(order.advance) || 0), 0
  );

  setStats({
    totalOrdersToday: todayOrders.length,
    staffCountToday: activeStaff.length,
    totalAdvanceAmount: totalAdvance
  });
};

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Orders Today',
      value: stats.totalOrdersToday.toString(),
      change: '+12% from yesterday',
      icon: ShoppingCart,
      color: 'text-teal-600'
    },
    {
      title: 'Staff Count Today',
      value: stats.staffCountToday.toString(),
      subtitle: `${staffList.filter(s => s.status === 'Active').length} present`,
      icon: Users,
      color: 'text-teal-600'
    },
    {
      title: 'Total Advance Amount',
      value: `₹${stats.totalAdvanceAmount.toLocaleString()}`,
      subtitle: "Today's collection",
      icon: DollarSign,
      color: 'text-teal-600'
    }
  ];

  // Filter tasks for dashboard (nearing deadline)
  const dashboardTasks = tasks
    .filter(task => task.status !== 'Completed')
    .slice(0, 3)
    .map(task => ({
      name: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      }) : 'N/A',
      priorityColor: task.priority === 'High' ? 'bg-red-100 text-red-700' :
        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
    }));

  const fetchCurrentLeaves = async () => {
    try {
      const res = await api.get('/leaves/admin/current');
      setCurrentLeaves(res.data || []);
    } catch (err) {
      console.error("Failed to fetch current leaves", err);
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const res = await api.get("/leaves/admin/pending");
      setPendingLeaves(res.data || []);
    } catch (err) {
      console.error("Failed to fetch pending leaves", err);
    } finally {
      setLoadingLeaves(false);
    }
  };



  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hours12 = h % 12 || 12;
      return `${hours12}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <main className="p-4 lg:p-8 space-y-6" id='dashboard'>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
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
            <p className={`text-sm ${card.subtitle === 'Needs attention' ? 'text-red-500' : 'text-teal-600'}`}>
              {card.change || card.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Section (Tasks, Leaves, Distributors) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><CheckSquare size={18} className="text-[#246e72]" /></div>
            <h3 className="text-lg font-bold text-gray-800">Tasks Nearing Deadline</h3>
          </div>
          {loading.tasks ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]"></div>
            </div>
          ) : dashboardTasks.length > 0 ? (
            <div className="space-y-4">
              {dashboardTasks.map((task, index) => (
                <div key={index} className="bg-[#D2EAF4] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{task.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${task.priorityColor} font-medium`}>{task.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <p className="text-xs text-gray-500">Due: {task.deadline}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No tasks nearing deadline</p>
          )}
        </div>

        {/* Leaves */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
              <Calendar size={18} className="text-[#246e72]" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Staff on Leave</h3>
          </div>

          {currentLeaves.length > 0 ? (
            <div className="space-y-4">
              {currentLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center space-x-3 p-3 bg-[#D2EAF4] rounded-lg"
                >
                  <div className="w-10 h-10 bg-[#246e72] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {leave.initials}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {leave.staffName}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {leave.type} (
                      {new Date(leave.startDate).toLocaleDateString()}
                      {leave.startTime ? ` (${formatTime(leave.startTime)})` : ""} →{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                      {leave.endTime ? ` (${formatTime(leave.endTime)})` : ""}
                      )
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No staff on leave today
            </p>
          )}
        </div>
      </div>
      {/* === TASK STATUS APPROVALS === */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
            <CheckSquare size={18} className="text-[#246e72]" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            Pending Task Status Approvals
          </h3>
        </div>

        {loadingStatusRequests ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]"></div>
          </div>
        ) : statusRequests.length > 0 ? (
          <div className="space-y-4">
            {statusRequests.map(req => (
              <div
                key={req._id}
                className="bg-[#D2EAF4] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {req.taskId?.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Requested by: <strong>{req.staffId?.name}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status:
                    <span className="font-medium"> {req.currentStatus}</span> →
                    <span className="font-semibold text-[#246e72] ml-1">
                      {req.requestedStatus}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveStatus(req)}
                    className="px-4 py-2 bg-[#246e72] text-white rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectStatus(req._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No pending task status requests 🎉
          </p>
        )}
      </div>
      {/* === LEAVE APPROVALS === */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
            <Calendar size={18} className="text-[#246e72]" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            Pending Leave Requests
          </h3>
        </div>

        {loadingLeaves ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#246e72]" />
          </div>
        ) : pendingLeaves.length > 0 ? (
          <div className="space-y-4">
            {pendingLeaves.map(leave => (
              <div
                key={leave._id}
                className="bg-[#D2EAF4] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#246e72] rounded-full flex items-center justify-center text-white font-semibold">
                    {leave.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {leave.staffName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {leave.leaveType} | {new Date(leave.startDate).toLocaleDateString()} {leave.startTime ? `(${formatTime(leave.startTime)})` : ""} → {new Date(leave.endDate).toLocaleDateString()} {leave.endTime ? `(${formatTime(leave.endTime)})` : ""}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reason: {leave.reason || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveLeave(leave._id)}
                    className="px-4 py-2 bg-[#246e72] text-white rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectLeave(leave._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No pending leave requests 🎉
          </p>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
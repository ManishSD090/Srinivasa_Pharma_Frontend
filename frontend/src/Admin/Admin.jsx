import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import OrdersPage from './OrdersPage';
// import StaffPage from './StaffPage';
// import TasksPage from './TasksPage';
// import RemindersPage from './RemindersPage';
// import LeavesPage from './LeavesPage';

const Admin = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/orders" element={<OrdersPage />} />
      {/* <Route path="/staff" element={<StaffPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/reminders" element={<RemindersPage />} />
      <Route path="/leaves" element={<LeavesPage />} /> */}
    </Routes>
  );
};

export default Admin;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import OrdersPage from './OrdersPage';
import StaffManagement from './StaffManagement';
import TaskManagement from './TaskManagement';
import PayrollAttendancePage from './PayrollAttendance';
import InventoryChecklist from './InventoryChecklist';

const Admin = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/staff" element={<StaffManagement />} />
      <Route path="/tasks" element={<TaskManagement />} />
      <Route path="/payroll" element={<PayrollAttendancePage />} />
      <Route path="/inventory" element={<InventoryChecklist />} />
    </Routes>
  );
};

export default Admin;

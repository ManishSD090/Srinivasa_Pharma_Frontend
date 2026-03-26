import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import OrdersPage from './OrdersPage';
import StaffManagement from './StaffManagement';
import TaskManagement from './TaskManagement';
import PayrollAttendancePage from './PayrollAttendance';
import InventoryChecklist from './InventoryChecklist';

const Admin = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="payroll" element={<PayrollAttendancePage />} />
        <Route path="inventory" element={<InventoryChecklist />} />
      </Route>
    </Routes>
  );
};

export default Admin;

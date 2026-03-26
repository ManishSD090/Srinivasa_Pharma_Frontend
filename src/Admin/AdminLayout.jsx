import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Map of routes to titles
  const routeToTitle = {
    '/admin/dashboard': 'Admin Dashboard',
    '/admin/orders': 'Orders',
    '/admin/staff': 'Staff Management',
    '/admin/tasks': 'Task Management',
    '/admin/payroll': 'Payroll & Attendance',
    '/admin/inventory': 'Inventory Checklist',
  };

  const currentTitle = routeToTitle[location.pathname] || 'Admin Panel';

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      {/* Sidebar - Handles its own logic with props */}
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header - Fixed at top */}
        <AdminHeader setIsSidebarOpen={setIsSidebarOpen} title={currentTitle} />
        
        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

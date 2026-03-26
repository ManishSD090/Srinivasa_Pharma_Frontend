import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import StaffHeader from './StaffHeader';

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const staffData = {
    name: userData.name || 'Staff',
    initials: userData.name
      ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'ST'
  };

  const routeToTitle = {
    '/staff/dashboard': 'Staff Dashboard',
    '/staff/tasks': 'My Tasks',
    '/staff/attendance': 'Attendance',
    '/staff/leaves': 'Leave Management',
    '/staff/inventory': 'Inventory',
    '/staff/orders': 'Orders'
  };

  const currentTitle = routeToTitle[location.pathname] || 'Staff Panel';

  return (
    <div className="flex h-screen bg-[#D2EAF4]">

      <StaffSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-auto">

        <StaffHeader
          setIsSidebarOpen={setIsSidebarOpen}
          title={currentTitle}
          staffData={staffData}
        />

        <main className="flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StaffLayout;
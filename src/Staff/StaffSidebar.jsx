import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

import { useAuth } from '../authContext';
import LogoutConfirmModal from '../components/LogoutConfirmModal';

const StaffSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/staff/dashboard' },
    { name: 'Orders', path: '/staff/orders' },
    { name: 'Inventory', path: '/staff/inventory' },
    { name: 'My Tasks', path: '/staff/tasks' },
    { name: 'Attendance', path: '/staff/attendance' },
    { name: 'Leaves', path: '/staff/leaves' },
    { name: 'Logout', path: '/' }
  ];

  const handleNavClick = async (item) => {
    if (item.name === 'Logout') {
      setIsLogoutModalOpen(true);
    } else {
      navigate(item.path);
    }

    setIsSidebarOpen(false);
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen} 
        onConfirm={confirmLogout} 
        onCancel={() => setIsLogoutModalOpen(false)} 
      />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* HEADER */}
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#246e72] font-bold text-xl">
                S
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Srinivasa Pharma</h1>
                <p className="text-xs text-white">Staff Panel</p>
              </div>
            </div>

            <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* NAV */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${location.pathname === item.path
                  ? 'bg-teal-50 text-[#246e72]'
                  : 'text-white hover:bg-gray-50 hover:text-[#246e72]'
                }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default StaffSidebar;
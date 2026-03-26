import React from 'react';
import { Menu } from 'lucide-react';

const AdminHeader = ({ setIsSidebarOpen, title }) => {
  return (
    <header className="bg-[#21696d] shadow-md sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <button 
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] text-teal-100 uppercase tracking-wider font-semibold">Logged in as</span>
            <span className="text-sm font-medium text-white">Dr. Admin</span>
          </div>
          <div className="w-10 h-10 bg-[linear-gradient(135deg,#D2EAF4_0%,#B8DCEB_100%)] rounded-full flex items-center justify-center text-[#246e72] font-bold shadow-sm ring-2 ring-white/20">
            DA
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

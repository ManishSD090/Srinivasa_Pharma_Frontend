import React, { useState } from 'react';
import { ShoppingCart, Users,Edit, Trash2, DollarSign, Truck, Bell, CheckSquare, Calendar, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const navigate = useNavigate();

  const statsCards = [
    { 
      title: 'Total Orders Today', 
      value: '127', 
      change: '+12% from yesterday', 
      icon: ShoppingCart,
      color: 'text-teal-600'
    },
    { 
      title: 'Staff Count Today', 
      value: '24', 
      subtitle: 'All present', 
      icon: Users,
      color: 'text-teal-600'
    },
    { 
      title: 'Total Advance Amount', 
      value: '₹45,230', 
      subtitle: "Today's collection", 
      icon: DollarSign,
      color: 'text-teal-600'
    },
    { 
      title: 'Pending Deliveries', 
      value: '18', 
      subtitle: 'Needs attention', 
      icon: Truck,
      color: 'text-red-500'
    }
  ];

  const recentOrders = [
    { 
      id: 1, 
      date: '2024-01-15', 
      item: 'Combiflam Tablet', 
      quantity: '2 strips', 
      advance: '₹150', 
      distributor: 'Combiflam → Ravindra', 
      phone: '+91 98765 43210' 
    },
    { 
      id: 2, 
      date: '2024-01-15', 
      item: 'Paracetamol 500mg', 
      quantity: '1 bottle', 
      advance: '₹85', 
      distributor: 'Paracetamol → Suresh', 
      phone: '+91 87654 32109' 
    },
    { 
      id: 3, 
      date: '2024-01-14', 
      item: 'Crocin Advance', 
      quantity: '3 strips', 
      advance: '₹240', 
      distributor: 'Crocin → Mahesh', 
      phone: '+91 76543 21098' 
    }
  ];

  const reminders = [
    { 
      type: 'alert', 
      title: 'Stock Alert', 
      description: 'Aspirin running low - 5 units left', 
      time: 'Overdue by 2 days',
      bgColor: 'bg-red-50',
      borderColor: 'border-l-red-500',
      icon: '🔴'
    },
    { 
      type: 'warning', 
      title: 'Expiry Check', 
      description: '15 medicines expiring this month', 
      time: 'Due in 3 days',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-yellow-500',
      icon: '⚠️'
    },
    { 
      type: 'info', 
      title: 'Supplier Meeting', 
      description: 'Monthly review with distributors', 
      time: 'Tomorrow 10:00 AM',
      bgColor: 'bg-teal-50',
      borderColor: 'border-l-teal-500',
      icon: '📋'
    }
  ];

  const tasks = [
    { 
      name: 'Inventory Audit', 
      description: 'Complete monthly stock verification', 
      priority: 'High', 
      deadline: 'Jan 18',
      priorityColor: 'bg-red-100 text-red-700'
    },
    { 
      name: 'Staff Training', 
      description: 'New safety protocols training', 
      priority: 'Medium', 
      deadline: 'Jan 20',
      priorityColor: 'bg-yellow-100 text-yellow-700'
    },
    { 
      name: 'License Renewal', 
      description: 'Pharmacy license documentation', 
      priority: 'Low', 
      deadline: 'Jan 25',
      priorityColor: 'bg-green-100 text-green-700'
    }
  ];

  const leaves = [
    { name: 'Rajesh Kumar', type: 'Sick Leave', duration: '2 days', status: 'Pending', initial: 'RK' },
    { name: 'Priya Sharma', type: 'Personal Leave', duration: '1 day', status: 'Approved', initial: 'PS' },
    { name: 'Amit Mehta', type: 'Vacation', duration: '5 days', status: 'Pending', initial: 'AM' }
  ];

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard'},
    { name: 'Order Management', path: '/admin/orders' },
    { name: 'Staff Management', path: '/admin/staff' },
    { name: 'Task Management', path: '/admin/tasks' },
    { name: 'Payroll & Attendance', path: '/admin/payroll' },
    { name: 'Logout', path: '/' }
  ];

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]" id='dashboard'>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-none z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
         `}>
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#246e72] font-bold text-xl">
                S
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Srinivasa Pharma</h1>
                <p className="text-xs text-white">Admin Panel</p>
              </div>
            </div>
            <button
              className="lg:hidden text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${window.location.pathname === item.path
              ? 'bg-teal-50 text-[#246e72] font-medium'
              : 'text-white hover:bg-gray-50 hover:text-[#246e72] font-medium'
              }
              `}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button 
                className="lg:hidden text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome back,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Dr. Admin</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  DA
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">PLACED</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DATE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ITEM NAME</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">QUANTITY</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ADVANCE AMOUNT</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DISTRIBUTOR</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">CUSTOMER PHONE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-8">
                        <input 
                          type="checkbox" 
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4 text-[#246e72] rounded border-gray-300 focus:ring-[#246e72]"
                        />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-medium">{order.item}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.quantity}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{order.advance}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.distributor}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.phone}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
                            <Edit size={16} />
                          </button>
                          <button className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reminders & Alerts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Bell size={18} className="text-[#246e72]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Reminders & Alerts</h3>
              </div>
              <div className="space-y-4">
                {reminders.map((reminder, index) => (
                  <div 
                    key={index} 
                    className={`${reminder.bgColor} border-l-4 ${reminder.borderColor} rounded-lg p-4`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{reminder.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{reminder.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                        <p className="text-xs text-gray-500">{reminder.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Nearing Deadline */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <CheckSquare size={18} className="text-[#246e72]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Tasks Nearing Deadline</h3>
              </div>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="bg-[#D2EAF4] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{task.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${task.priorityColor} font-medium`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <p className="text-xs text-gray-500">Due: {task.deadline}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Applications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Calendar size={18} className="text-[#246e72]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Leave Applications</h3>
              </div>
              <div className="space-y-4">
                {leaves.map((leave, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#D2EAF4] rounded-lg">
                    <div className="w-10 h-10 bg-[#246e72] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {leave.initial}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{leave.name}</h4>
                      <p className="text-xs text-gray-600">{leave.type} - {leave.duration}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      leave.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
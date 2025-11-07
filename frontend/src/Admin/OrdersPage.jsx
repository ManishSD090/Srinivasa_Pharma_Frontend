import React, { useState } from 'react';
import { 
  Edit, Trash2, Filter, Download, 
  ChevronLeft, ChevronRight, X, 
  ShoppingCart, Truck, 
  Bell, Menu 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    itemName: '',
    quantity: '',
    advance: '',
    distributor: '',
    phone: ''
  });

  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Staff', path: '/admin/staff' },
    { name: 'Tasks', path: '/admin/tasks' },
    { name: 'Reminders & Alerts', path: '/admin/reminders' },
    { name: 'Leaves', path: '/admin/leaves' }
  ];

  const orders = [
    { id: 1, date: '2024-01-15', item: 'Paracetamol 500mg', quantity: 100, advance: '₹2,500', distributor: 'MedSupply Co.', phone: '+91 98765 43210' },
    { id: 2, date: '2024-01-14', item: 'Amoxicillin 250mg', quantity: 50, advance: '₹1,200', distributor: 'PharmaCorp Ltd.', phone: '+91 87654 32109' },
    { id: 3, date: '2024-01-13', item: 'Insulin Glargine', quantity: 20, advance: '₹8,000', distributor: 'DiabetesCare Inc.', phone: '+91 76543 21098' },
    { id: 4, date: '2024-01-12', item: 'Vitamin D3 Tablets', quantity: 200, advance: '₹1,500', distributor: 'HealthPlus Dist.', phone: '+91 65432 10987' },
    { id: 5, date: '2024-01-11', item: 'Cough Syrup 100ml', quantity: 75, advance: '₹900', distributor: 'ColdCare Pharma', phone: '+91 54321 09876' }
  ];

  const filteredOrders = orders.filter(order =>
    order.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.distributor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddOrder = () => {
    console.log('Adding order:', formData);
    setFormData({
      date: '',
      itemName: '',
      quantity: '',
      advance: '',
      distributor: '',
      phone: ''
    });
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-none z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#00AD8E] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#00AD8E] font-bold text-xl">
                M
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MedStore</h1>
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
                  ? 'bg-teal-50 text-[#00AD8E] font-medium'
                  : 'text-white hover:bg-gray-50 hover:text-[#00AD8E] font-medium'
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
        <header className="bg-[#00AD8E] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-600"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Orders</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome back,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Dr. Admin</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#00AD8E] font-semibold">
                  DA
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Orders Content */}
        <main className="p-4 lg:p-8 space-y-6">
          {/* Add Order Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Order</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Order</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                <input
                  type="text"
                  name="advance"
                  value={formData.advance}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distributor</label>
                <input
                  type="text"
                  name="distributor"
                  value={formData.distributor}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleAddOrder}
              className="bg-[#00AD8E] text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              + Add Order
            </button>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#00AD8E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Order List</h3>
            </div>
            {/* Orders Table Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="bg-[#00AD8E] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
                >
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
                
                {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Daily
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Weekly
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Monthly
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Yearly
                    </button>
                   {/* Custom Date Range with collapsible calendar */}
                        <div className="border-t border-gray-200">
                        <button
                            onClick={() => setShowCustomRange(!showCustomRange)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center justify-between"
                        >
                            <span>Custom Date Range</span>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showCustomRange ? 'rotate-180' : 'rotate-0'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showCustomRange && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                <input
                                type="date"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                                <input
                                type="date"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] outline-none text-sm"
                                />
                            </div>
                            <button
                                className="w-full bg-[#00AD8E] text-white py-1.5 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                            >
                                Apply Filter
                            </button>
                            </div>
                        )}
                        </div>
                    </div>
                )}
                </div>

                <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium 
                                focus:ring-2 focus:ring-[#00AD8E] focus:border-[#00AD8E] outline-none 
                                transition-all duration-200 bg-white hover:border-[#00AD8E] shadow-sm"
                    >
                    <option
                        value={10}
                        className="bg-white text-gray-700 hover:bg-teal-50 hover:text-[#00AD8E]"
                    >
                        10 entries
                    </option>
                    <option
                        value={50}
                        className="bg-white text-gray-700 hover:bg-teal-50 hover:text-[#00AD8E]"
                    >
                        50 entries
                    </option>
                    <option
                        value={100}
                        className="bg-white text-gray-700 hover:bg-teal-50 hover:text-[#00AD8E]"
                    >
                        100 entries
                    </option>
                </select>

                <div className="relative">
                <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="bg-[#00AD8E] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
                >
                    <Download size={18} />
                    <span>Export</span>
                </button>
                
                {showExportDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Export as Excel
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        Export as PDF
                    </button>
                    </div>
                )}
                </div>
            </div>

            <div className="w-full sm:w-auto">
                <input
                type="text"
                placeholder="Search orders..."
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AD8E] focus:border-transparent outline-none transition-all text-sm"
                />
            </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Placed</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Item</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Advance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Distributor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-8">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4 text-[#00AD8E] border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-medium">{order.item}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.quantity}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.advance}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.distributor}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.phone}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 bg-[#00AD8E] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
                            <Edit size={16} />
                          </button>
                          <button className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
                            <Trash2 size={16} />
                          </button>
                          <button className="w-8 h-8 bg-[#00AD8E] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
                            <Bell size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Showing {displayedOrders.length} of {filteredOrders.length} entries</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;

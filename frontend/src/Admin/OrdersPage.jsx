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
  
  // Mock Data for Dropdown
  const distributors = [
    'MedSupply Co.',
    'PharmaCorp Ltd.',
    'DiabetesCare Inc.',
    'HealthPlus Dist.',
    'Apex Distributors',
    'Global Health Pharma'
  ];

  // --- UPDATED STATE ---
  // 1. Distributor removed from formData (Order Level)
  const [formData, setFormData] = useState({
    date: '',
    phone: ''
  });

  // 2. Distributor added to items (Item Level)
  const [items, setItems] = useState([
    { itemName: '', quantity: '', advance: '', distributor: '' }
  ]);

  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Order Management', path: '/admin/orders' },
    { name: 'Inventory Checklist', path: '/admin/inventory' },
    { name: 'Staff Management', path: '/admin/staff' },
    { name: 'Task Management', path: '/admin/tasks' },
    { name: 'Payroll & Attendance', path: '/admin/payroll' },
    { name: 'Logout', path: '/' }
  ];

  // 3. Updated Orders Data Structure (Distributor inside items)
  const [orders, setOrders] = useState([
    { 
      id: 1, date: '2024-01-15', phone: '+91 98765 43210', 
      items: [{ itemName: 'Paracetamol 500mg', quantity: 100, advance: '₹2,500', distributor: 'MedSupply Co.' }] 
    },
    { 
      id: 2, date: '2024-01-14', phone: '+91 87654 32109', 
      items: [{ itemName: 'Amoxicillin 250mg', quantity: 50, advance: '₹1,200', distributor: 'PharmaCorp Ltd.' }] 
    },
    { 
      id: 3, date: '2024-01-13', phone: '+91 76543 21098', 
      items: [{ itemName: 'Insulin Glargine', quantity: 20, advance: '₹8,000', distributor: 'DiabetesCare Inc.' }] 
    },
    { 
      id: 4, date: '2024-01-12', phone: '+91 65432 10987', 
      items: [
        { itemName: 'Vitamin D3 Tablets', quantity: 200, advance: '₹1,500', distributor: 'HealthPlus Dist.' },
        { itemName: 'Cough Syrup 100ml', quantity: 75, advance: '₹900', distributor: 'Apex Distributors' }
      ] 
    },
  ]);

  // 4. Updated filter logic to search inside items for distributors
  const filteredOrders = orders.filter(order =>
    order.phone.includes(searchQuery) ||
    order.items.some(item => 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.distributor.toLowerCase().includes(searchQuery.toLowerCase())
    )
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

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  // Initialize new item with empty distributor
  const handleAddItemRow = () => {
    setItems([...items, { itemName: '', quantity: '', advance: '', distributor: '' }]);
  };

  const handleRemoveItemRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // --- UPDATED SUBMIT HANDLER ---
  const handleAddOrder = () => {
    // Validate Order fields
    if (!formData.date || !formData.phone) {
      alert('Please fill in Date and Phone');
      return;
    }
    // Validate Item fields (including Distributor)
    if (items.some(i => !i.itemName || !i.quantity || !i.advance || !i.distributor)) {
      alert('Please complete all item fields including Distributor');
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      ...formData,
      items // Items now contain distributor info
    };

    setOrders([newOrder, ...orders]);
    alert('Order added successfully!');
    
    // Reset forms
    setFormData({ date: '', phone: '' });
    setItems([{ itemName: '', quantity: '', advance: '', distributor: '' }]);
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-none z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#246e72] font-bold text-xl">
                M
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
              <h2 className="text-2xl font-bold text-white">Orders</h2>
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

        {/* Orders Content */}
        <main className="p-4 lg:p-8 space-y-6">
          
          {/* --- UPDATED ADD ORDER FORM --- */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Order</h2>
            
            {/* Order-Level Fields (Distributor Removed) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Order</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                />
              </div>
            </div>

            {/* Item-Level Dynamic Fields */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h4>
              {items.map((item, index) => (
                // Changed grid to 12 cols for better spacing
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-center border-b border-gray-100 pb-3 md:border-0 md:pb-0">
                  
                  {/* Item Name (3 cols) */}
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      name="itemName"
                      placeholder="Item Name"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                    />
                  </div>

                  {/* Distributor (3 cols) - MOVED HERE */}
                  <div className="md:col-span-3">
                    <select 
                      name="distributor" 
                      value={item.distributor} 
                      onChange={(e) => handleItemChange(index, e)} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Quantity (2 cols) */}
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                    />
                  </div>

                  {/* Advance (2 cols) */}
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="advance"
                      placeholder="Advance"
                      value={item.advance}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                    />
                  </div>

                  {/* Actions (2 cols) */}
                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      onClick={handleAddItemRow}
                      className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 flex items-center justify-center font-bold"
                      title="Add Item"
                    >
                      +
                    </button>
                    {items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItemRow(index)}
                        className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center font-bold"
                        title="Remove Item"
                      >
                        <Trash2 size={16} /> 
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddOrder}
              className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              + Add Order
            </button>
          </div>
          {/* --- END UPDATED ADD ORDER FORM --- */}


          {/* --- UPDATED ORDERS TABLE --- */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Order List</h3>
            </div>
            
            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Filter size={18} />
                    <span>Filter</span>
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Daily</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Weekly</button>
                    </div>
                  )}
                </div>

                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium focus:ring-2 focus:ring-[#246e72] outline-none"
                >
                  <option value={10}>10 entries</option>
                  <option value={50}>50 entries</option>
                  <option value={100}>100 entries</option>
                </select>

                <div className="relative">
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  {showExportDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export as Excel</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export as PDF</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by item, distributor, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      <input type="checkbox" className="w-4 h-4 text-[#246e72] border-gray-300 rounded" />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items & Distributors</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4 text-[#246e72] border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.phone}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <ul className="space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex flex-col">
                              <span className="font-medium text-gray-800">{item.itemName}</span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">
                                    {item.distributor}
                                </span>
                                <span className="text-gray-500">Qty: {item.quantity} | Adv: {item.advance}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
                            <Edit size={16} />
                          </button>
                          <button className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
                            <Trash2 size={16} />
                          </button>
                          <button className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
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
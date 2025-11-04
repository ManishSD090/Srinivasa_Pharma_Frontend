import React, { useState } from 'react';
import { 
  Edit, Filter, ChevronLeft, ChevronRight, 
  X, Menu, ShoppingCart, Bell, AlertTriangle, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffOrders = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const navigate = useNavigate();

  // Form Data (Split into order-level and item-level)
  const [formData, setFormData] = useState({
    date: '',
    distributor: '',
    phone: ''
  });
  const [items, setItems] = useState([
    { itemName: '', quantity: '', advance: '' }
  ]);
  const [isForReview, setIsForReview] = useState(false);

  // Mock Data
  const distributors = [
    'Mark for Review Distributors',
    'MedSupply Co.',
    'PharmaCorp Ltd.',
    'Apex Distributors',
    'Global Health Pharma',
    'Sunway Medical Supplies',
    'Heritage Pharmaceuticals',
    'Reliance Pharma'
  ];

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/staff/dashboard' },
    { name: 'Orders', path: '/staff/orders' },
    { name: 'Tasks', path: '/staff/tasks' },
    { name: 'Attendance', path: '/staff/attendance' },
    { name: 'Leaves', path: '/staff/leaves' },
    { name: 'Logout', path: '/' }
  ];

  // Orders Data (New Nested Structure)
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      date: '2024-01-15', 
      distributor: 'MedSupply Co.', 
      phone: '+91 98765 43210', 
      status: 'Placed',
      items: [
        { itemName: 'Paracetamol 500mg', quantity: 100, advance: '₹2,500' }
      ] 
    },
    { 
      id: 2, 
      date: '2024-01-14', 
      distributor: 'PharmaCorp Ltd.', 
      phone: '+91 87654 32109', 
      status: 'Needs Review',
      items: [
        { itemName: 'Amoxicillin 250mg', quantity: 50, advance: '₹1,200' }
      ] 
    },
    { 
      id: 3, 
      date: '2024-01-13', 
      distributor: 'Apex Distributors', 
      phone: '+91 76543 21098', 
      status: 'Placed',
      items: [
        { itemName: 'Insulin Glargine', quantity: 20, advance: '₹8,000' }
      ] 
    },
    { 
      id: 4, 
      date: '2024-01-12', 
      distributor: 'Global Health Pharma', 
      phone: '+91 65432 10987', 
      status: 'Placed',
      items: [
        { itemName: 'Vitamin D3 Tablets', quantity: 200, advance: '₹1,500' },
        { itemName: 'Cough Syrup 100ml', quantity: 75, advance: '₹900' }
      ] 
    }
  ]);

  // Handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- New Item Handlers ---
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const handleAddItemRow = () => {
    setItems([...items, { itemName: '', quantity: '', advance: '' }]);
  };

  const handleRemoveItemRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };
  // --- End New Item Handlers ---

  // --- Updated Add Order Handler ---
  const handleAddOrder = () => {
    if (!formData.date || !formData.distributor || !formData.phone) {
      alert('Please fill in all required order fields (Date, Distributor, Phone)');
      return;
    }
    if (items.some(i => !i.itemName || !i.quantity || !i.advance)) {
      alert('Please complete all item fields (Name, Quantity, Advance)');
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      ...formData,
      status: isForReview ? 'Needs Review' : 'Placed',
      items // Add the items array
    };

    setOrders([newOrder, ...orders]);
    alert('Order added successfully!');
    
    // Reset all forms
    setFormData({ date: '', distributor: '', phone: '' });
    setItems([{ itemName: '', quantity: '', advance: '' }]);
    setIsForReview(false);
  };
  // --- End Updated Handler ---

  const handleSendReminder = (id) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      setReminderMessage(`Reminder sent to ${order.phone}`);
      setTimeout(() => setReminderMessage(''), 3000);
    }
  };

  // Filter & Pagination (Updated filter logic)
  const filteredOrders = orders.filter(order =>
    order.distributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phone.includes(searchQuery) ||
    order.items.some(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-green-100 text-green-700';
      case 'Needs Review':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };


  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-none z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-[14px] border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-lg flex items-center justify-center text-[#246e72] font-bold text-xl">S</div>
              <div>
                <h1 className="text-xl font-bold text-white">Srinivasa Pharma</h1>
                <p className="text-xs text-white">Staff Portal</p>
              </div>
            </div>
            <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.path === '/staff/orders' ? 'bg-teal-50 text-[#246e72] font-medium' : 'text-white hover:bg-gray-50 hover:text-[#246e72] font-medium'}`}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-white">Orders</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">SJ</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
          {reminderMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg">
              <p className="font-bold">Success</p>
              <p className="text-sm">{reminderMessage}</p>
            </div>
          )}

          {/* === UPDATED ADD ORDER FORM === */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Add New Order</h3>
            </div>

            {/* Order-Level Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Order</label>
                <input type="date" name="date" value={formData.date} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distributor</label>
                <select name="distributor" value={formData.distributor} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
                  <option value="">Select Distributor</option>
                  {distributors.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"/>
              </div>
            </div>

            {/* Item-Level Dynamic Fields */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h4>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-center">
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Item Name"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm md:col-span-2"
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                  />
                  <input
                    type="text"
                    name="advance"
                    placeholder="Advance (e.g., ₹100)"
                    value={item.advance}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddItemRow}
                      className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center font-bold"
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
            
            <div className="flex items-center justify-between">
              <button onClick={handleAddOrder} className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-[#1a5256] transition-colors font-medium text-sm">
                + Add Order
              </button>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="markForReview"
                  checked={isForReview}
                  onChange={(e) => setIsForReview(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#246e72] focus:ring-[#246e72]"
                />
                <label htmlFor="markForReview" className="text-sm font-medium text-gray-700">Mark for Review</label>
                <AlertTriangle className="h-5 w-5 text-yellow-500" /> 
              </div>
            </div>
          </div>
          {/* === END UPDATED FORM === */}


          {/* === UPDATED ORDER LIST === */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Order List</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center space-x-2 text-sm">
                    <Filter size={18} />
                    <span>Filter</span>
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {/* ... filter options ... */}
                    </div>
                  )}
                </div>
                <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
                  <option value={10}>Show 10</option>
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <input type="text" placeholder="Search by item, distributor, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"/>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">DATE</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">DISTRIBUTOR</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">PHONE</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ITEMS</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">STATUS</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.distributor}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.phone}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              <span className="font-medium text-gray-800">{item.itemName}</span>
                              <span className="text-gray-600"> (Qty: {item.quantity}, Adv: {item.advance})</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button title="Edit Order" className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center"><Edit size={16} /></button>
                          <button onClick={() => handleSendReminder(order.id)} title="Send Reminder" className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center"><Bell size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">Showing {displayedOrders.length} of {filteredOrders.length} entries</p>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronLeft size={18} /></button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffOrders;
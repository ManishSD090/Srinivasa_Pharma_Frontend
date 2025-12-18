import React, { useState } from 'react';
import { 
  ShoppingCart, Users, Edit, Trash2, DollarSign, 
  Truck, Bell, CheckSquare, Calendar, Menu, X, Save,
  Filter, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // --- Filter & Pagination States ---
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 

  // --- Edit Modal States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Mock Data for Dropdown (Same as OrdersPage)
  const distributors = [
    'Ravindra', 'Suresh', 'Mahesh', 
    'HealthPlus', 'Apex'
  ];

  const statsCards = [
    { title: 'Total Orders Today', value: '127', change: '+12% from yesterday', icon: ShoppingCart, color: 'text-teal-600' },
    { title: 'Staff Count Today', value: '24', subtitle: 'All present', icon: Users, color: 'text-teal-600' },
    { title: 'Total Advance Amount', value: '₹45,230', subtitle: "Today's collection", icon: DollarSign, color: 'text-teal-600' }
  ];

  // --- Data ---
  const [recentOrders, setRecentOrders] = useState([
    { 
      id: 1, date: '2024-01-15', phone: '+91 98765 43210', advance: '₹150',
      items: [{ itemName: 'Combiflam Tablet', quantity: '2 strips', distributor: 'Ravindra' }]
    },
    { 
      id: 2, date: '2024-01-15', phone: '+91 87654 32109', advance: '₹85',
      items: [{ itemName: 'Paracetamol 500mg', quantity: '1 bottle', distributor: 'Suresh' }]
    },
    { 
      id: 3, date: '2024-01-13', phone: '+91 76543 21098', advance: '₹240',
      items: [{ itemName: 'Crocin Advance', quantity: '3 strips', distributor: 'Mahesh' }]
    },
    { 
      id: 4, date: '2024-01-14', phone: '+91 65432 10987', advance: '₹1,200',
      items: [
        { itemName: 'Vitamin C', quantity: '10 strips', distributor: 'HealthPlus' },
        { itemName: 'Zinc Tablets', quantity: '5 bottles', distributor: 'Apex' }
      ]
    },
    { 
      id: 5, date: '2024-01-08', phone: '+91 98765 11111', advance: '₹500',
      items: [{ itemName: 'Cough Syrup', quantity: '5 bottles', distributor: 'Ravindra' }]
    }
  ]);

  const reminders = [
    { type: 'alert', title: 'Stock Alert', description: 'Aspirin running low - 5 units left', time: 'Overdue by 2 days', bgColor: 'bg-red-50', borderColor: 'border-l-red-500', icon: '🔴' },
    { type: 'warning', title: 'Expiry Check', description: '15 medicines expiring this month', time: 'Due in 3 days', bgColor: 'bg-yellow-50', borderColor: 'border-l-yellow-500', icon: '⚠️' },
    { type: 'info', title: 'Supplier Meeting', description: 'Monthly review with distributors', time: 'Tomorrow 10:00 AM', bgColor: 'bg-teal-50', borderColor: 'border-l-teal-500', icon: '📋' }
  ];

  const tasks = [
    { name: 'Inventory Audit', description: 'Complete monthly stock verification', priority: 'High', deadline: 'Jan 18', priorityColor: 'bg-red-100 text-red-700' },
    { name: 'Staff Training', description: 'New safety protocols training', priority: 'Medium', deadline: 'Jan 20', priorityColor: 'bg-yellow-100 text-yellow-700' },
    { name: 'License Renewal', description: 'Pharmacy license documentation', priority: 'Low', deadline: 'Jan 25', priorityColor: 'bg-green-100 text-green-700' }
  ];

  const leaves = [
    { name: 'Rajesh Kumar', type: 'Sick Leave', duration: '2 days', status: 'Pending', initial: 'RK' },
    { name: 'Priya Sharma', type: 'Personal Leave', duration: '1 day', status: 'Approved', initial: 'PS' },
    { name: 'Amit Mehta', type: 'Vacation', duration: '5 days', status: 'Pending', initial: 'AM' }
  ];

  // --- FILTERING LOGIC (Matches OrdersPage) ---
  const filteredOrders = recentOrders.filter(order => {
    // 1. Search Logic
    const matchesSearch = 
      order.phone.includes(searchQuery) ||
      order.items.some(item => 
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.distributor.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // 2. Filter Logic
    let matchesFilter = true;
    const orderDate = new Date(order.date);
    const mockToday = new Date('2024-01-15'); // Fixed date for demo purposes
    
    if (activeFilter === 'All') {
      matchesFilter = true;
    } else if (activeFilter === 'Daily') {
      // Check if dates match today
      matchesFilter = orderDate.toISOString().split('T')[0] === mockToday.toISOString().split('T')[0];
    } else if (activeFilter === 'Weekly') {
      // Check if within last 7 days
      const lastWeek = new Date(mockToday);
      lastWeek.setDate(mockToday.getDate() - 7);
      matchesFilter = orderDate >= lastWeek && orderDate <= mockToday;
    } else {
      // *** Distributor Filter Logic ***
      // Check if ANY item in the order comes from the selected distributor
      matchesFilter = order.items.some(item => item.distributor === activeFilter);
    }

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  // --- Handlers ---
  const handleFilterSelect = (filterType) => {
    setActiveFilter(filterType);
    setShowFilterDropdown(false);
    setCurrentPage(1); 
  };

  const handleEditClick = (order) => {
    setCurrentOrder(JSON.parse(JSON.stringify(order))); 
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleEditItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...currentOrder.items];
    updatedItems[index][name] = value;
    setCurrentOrder(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSaveOrder = () => {
    setRecentOrders(prevOrders => 
      prevOrders.map(order => (order.id === currentOrder.id ? currentOrder : order))
    );
    setIsEditModalOpen(false);
    setCurrentOrder(null);
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]" id='dashboard'>
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome back,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Dr. Admin</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">DA</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
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

          {/* === RECENT ORDERS TABLE === */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
            </div>
            
            {/* --- UPDATED FILTER CONTROLS (With Distributor List) --- */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
                    className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 text-sm ${activeFilter !== 'All' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 'bg-[#246e72] text-white hover:bg-teal-700'}`}
                  >
                    <Filter size={18} />
                    <span>{activeFilter === 'All' ? 'Filter' : activeFilter}</span>
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-64 overflow-y-auto">
                      <div className="py-1">
                        <button onClick={() => handleFilterSelect('All')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium">All Orders</button>
                        <button onClick={() => handleFilterSelect('Daily')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Daily (Today)</button>
                        <button onClick={() => handleFilterSelect('Weekly')} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Weekly (7 Days)</button>
                      </div>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Distributors</div>
                      {distributors.map(dist => (
                        <button key={dist} onClick={() => handleFilterSelect(dist)} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 truncate" title={dist}>
                          {dist}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium focus:ring-2 focus:ring-[#246e72] outline-none">
                  <option value={10}>10 entries</option>
                  <option value={50}>50 entries</option>
                </select>
                <div className="relative">
                  <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 text-sm">
                    <Download size={18} /><span>Export</span>
                  </button>
                  {showExportDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Excel</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">PDF</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none transition-all text-sm" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600"><input type="checkbox" className="w-4 h-4 text-[#246e72] border-gray-300 rounded" /></th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items & Distributors</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.length > 0 ? (
                    displayedOrders.map(order => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4"><input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={() => toggleOrderSelection(order.id)} className="w-4 h-4 text-[#246e72] border-gray-300 rounded" /></td>
                        <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{order.phone}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          <ul className="space-y-2">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex flex-col">
                                <span className="font-medium text-gray-800">{item.itemName}</span>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">{item.distributor}</span>
                                  <span className="text-gray-500">Qty: {item.quantity} | Adv: {order.advance}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditClick(order)} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"><Edit size={16} /></button>
                            <button className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No orders found matching your filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Showing {displayedOrders.length} of {filteredOrders.length} entries</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronLeft size={18} /></button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          {/* Bottom Section (Reminders, Tasks, Leaves - Unchanged) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">          
            {/* Tasks */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><CheckSquare size={18} className="text-[#246e72]" /></div>
                <h3 className="text-lg font-bold text-gray-800">Tasks Nearing Deadline</h3>
              </div>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="bg-[#D2EAF4] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{task.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${task.priorityColor} font-medium`}>{task.priority}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <p className="text-xs text-gray-500">Due: {task.deadline}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaves */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><Calendar size={18} className="text-[#246e72]" /></div>
                <h3 className="text-lg font-bold text-gray-800">Leave Applications</h3>
              </div>
              <div className="space-y-4">
                {leaves.map((leave, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#D2EAF4] rounded-lg">
                    <div className="w-10 h-10 bg-[#246e72] rounded-full flex items-center justify-center text-white font-semibold text-sm">{leave.initial}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{leave.name}</h4>
                      <p className="text-xs text-gray-600">{leave.type} - {leave.duration}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{leave.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- Edit Order Modal --- */}
      {isEditModalOpen && currentOrder && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-white">Edit Order #{currentOrder.id}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="date" value={currentOrder.date} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" name="phone" value={currentOrder.phone} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                  <input type="text" name="advance" value={currentOrder.advance} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">Order Items</h4>
                <div className="space-y-4">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                        <input type="text" name="itemName" value={item.itemName} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                        <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Distributor</label>
                        <select name="distributor" value={item.distributor} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
                          <option value="">Select</option>
                          {distributors.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 shrink-0 border-t border-gray-200">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
              <button onClick={handleSaveOrder} className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"><Save size={18} /><span>Save Changes</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
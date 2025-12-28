// import React, { useState } from 'react';
// import {
//   Edit, Filter, ChevronLeft, ChevronRight,
//   Menu, ShoppingCart, Bell, AlertTriangle, Trash2,
//   X, Save
// } from 'lucide-react';
// import StaffSidebar from './StaffSidebar';

// const StaffOrders = () => {
//   // UI State
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [reminderMessage, setReminderMessage] = useState('');

//   // --- NEW: Edit Modal States ---
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);

//   // Form Data
//   const [formData, setFormData] = useState({
//     date: '',
//     phone: '',
//     advance: '' // Ensure advance is initialized here
//   });

//   // Items State
//   const [items, setItems] = useState([
//     { itemName: '', quantity: '', distributor: '' }
//   ]);
//   const [isForReview, setIsForReview] = useState(false);

//   // Mock Data
//   const distributors = [
//     'MedSupply Co.', 'PharmaCorp Ltd.', 'Apex Distributors',
//     'Global Health Pharma', 'Sunway Medical Supplies',
//     'Heritage Pharmaceuticals', 'Reliance Pharma'
//   ];

//   // Orders Data
//   const [orders, setOrders] = useState([
//     {
//       id: 1, date: '2024-01-15', phone: '+91 98765 43210', status: 'Placed', advance: '₹2,500',
//       items: [{ itemName: 'Paracetamol 500mg', quantity: 100, distributor: 'MedSupply Co.' }]
//     },
//     {
//       id: 2, date: '2024-01-14', phone: '+91 87654 32109', status: 'Needs Review', advance: '₹1,200',
//       items: [{ itemName: 'Amoxicillin 250mg', quantity: 50, distributor: 'PharmaCorp Ltd.' }]
//     },
//     {
//       id: 3, date: '2024-01-13', phone: '+91 76543 21098', status: 'Placed', advance: '₹8,000',
//       items: [{ itemName: 'Insulin Glargine', quantity: 20, distributor: 'Apex Distributors' }]
//     },
//     {
//       id: 4, date: '2024-01-12', phone: '+91 65432 10987', status: 'Placed', advance: '₹2,400',
//       items: [
//         { itemName: 'Vitamin D3 Tablets', quantity: 200, distributor: 'Global Health Pharma' },
//         { itemName: 'Cough Syrup 100ml', quantity: 75, distributor: 'Sunway Medical Supplies' }
//       ]
//     }
//   ]);

//   // --- Main Form Handlers ---
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...items];
//     updatedItems[index][name] = value;
//     setItems(updatedItems);
//   };

//   const handleAddItemRow = () => {
//     setItems([...items, { itemName: '', quantity: '', distributor: '' }]);
//   };

//   const handleRemoveItemRow = (index) => {
//     const updatedItems = items.filter((_, i) => i !== index);
//     setItems(updatedItems);
//   };

//   const handleAddOrder = () => {
//     if (!formData.date || !formData.phone) { alert('Please fill in Date and Phone'); return; }
//     if (items.some(i => !i.itemName || !i.quantity || !i.distributor)) { alert('Please complete all item fields'); return; }

//     const newOrder = {
//       id: orders.length + 1,
//       ...formData, // Includes advance
//       status: isForReview ? 'Needs Review' : 'Placed',
//       items
//     };

//     setOrders([newOrder, ...orders]);
//     alert('Order added successfully!');
//     setFormData({ date: '', phone: '', advance: '' });
//     setItems([{ itemName: '', quantity: '', distributor: '' }]);
//     setIsForReview(false);
//   };

//   const handleSendReminder = (id) => {
//     const order = orders.find(o => o.id === id);
//     if (order) {
//       setReminderMessage(`Reminder sent to ${order.phone}`);
//       setTimeout(() => setReminderMessage(''), 3000);
//     }
//   };

//   // --- NEW: Edit Handlers ---
//   const handleEditClick = (order) => {
//     setCurrentOrder(JSON.parse(JSON.stringify(order))); // Deep copy
//     setIsEditModalOpen(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentOrder(prev => ({ ...prev, [name]: value }));
//   };

//   const handleEditItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...currentOrder.items];
//     updatedItems[index][name] = value;
//     setCurrentOrder(prev => ({ ...prev, items: updatedItems }));
//   };

//   const handleSaveOrder = () => {
//     setOrders(prevOrders =>
//       prevOrders.map(order => (order.id === currentOrder.id ? currentOrder : order))
//     );
//     setIsEditModalOpen(false);
//     setCurrentOrder(null);
//   };

//   // --- Filtering & Pagination ---
//   const filteredOrders = orders.filter(order =>
//     order.phone.includes(searchQuery) ||
//     order.items.some(item =>
//       item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.distributor.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
//   const displayedOrders = filteredOrders.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'Placed': return 'bg-green-100 text-green-700';
//       case 'Needs Review': return 'bg-yellow-100 text-yellow-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#D2EAF4]">

//       <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

//       <div className="flex-1 overflow-auto">
//         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
//           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
//             <div className="flex items-center space-x-4">
//               <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
//               <h2 className="text-2xl font-bold text-white">Orders</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-white hidden sm:block">Welcome,</span>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
//                 <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">SJ</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 space-y-6">
//           {reminderMessage && (
//             <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg">
//               <p className="font-bold">Success</p>
//               <p className="text-sm">{reminderMessage}</p>
//             </div>
//           )}

//           {/* Add Order Form */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><ShoppingCart size={18} className="text-[#246e72]" /></div>
//               <h3 className="text-xl font-bold text-gray-800">Add New Order</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Date of Order</label>
//                 <input type="date" name="date" value={formData.date} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
//                 <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
//                 <input type="text" name="advance" placeholder="Advance" value={formData.advance} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//               </div>
//             </div>

//             <div className="mb-4">
//               <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h4>
//               {items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-center border-b border-gray-100 pb-3 md:border-0 md:pb-0">
//                   <div className="md:col-span-4">
//                     <input type="text" name="itemName" placeholder="Item Name" value={item.itemName} onChange={(e) => handleItemChange(index, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//                   </div>
//                   <div className="md:col-span-4">
//                     <select name="distributor" value={item.distributor} onChange={(e) => handleItemChange(index, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
//                       <option value="">Select Distributor</option>
//                       {distributors.map(d => <option key={d} value={d}>{d}</option>)}
//                     </select>
//                   </div>
//                   <div className="md:col-span-2">
//                     <input type="number" name="quantity" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//                   </div>
//                   <div className="md:col-span-2 flex space-x-2">
//                     <button onClick={handleAddItemRow} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center font-bold" title="Add Item">+</button>
//                     {items.length > 1 && <button onClick={() => handleRemoveItemRow(index)} className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center font-bold" title="Remove Item"><Trash2 size={16} /></button>}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex items-center justify-between">
//               <button onClick={handleAddOrder} className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-[#1a5256] transition-colors font-medium text-sm">+ Add Order</button>
//               <div className="flex items-center space-x-2">
//                 <input type="checkbox" id="markForReview" checked={isForReview} onChange={(e) => setIsForReview(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#246e72] focus:ring-[#246e72]" />
//                 <label htmlFor="markForReview" className="text-sm font-medium text-gray-700">Mark for Review</label>
//                 <AlertTriangle className="h-5 w-5 text-yellow-500" />
//               </div>
//             </div>
//           </div>

//           {/* Order List Table */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><ShoppingCart size={18} className="text-[#246e72]" /></div>
//               <h3 className="text-xl font-bold text-gray-800">Order List</h3>
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="relative">
//                   <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center space-x-2 text-sm">
//                     <Filter size={18} /><span>Filter</span>
//                   </button>
//                 </div>
//                 <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
//                   <option value={10}>Show 10</option>
//                   <option value={50}>Show 50</option>
//                   <option value={100}>Show 100</option>
//                 </select>
//               </div>
//               <div className="w-full sm:w-auto">
//                 <input type="text" placeholder="Search item, distributor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">DATE</th>
//                     <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">PHONE</th>
//                     <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ITEMS & DISTRIBUTORS</th>
//                     <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">STATUS</th>
//                     <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ACTIONS</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedOrders.map(order => (
//                     <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
//                       <td className="py-4 px-4 text-sm text-gray-700">{order.phone}</td>
//                       <td className="py-4 px-4 text-sm text-gray-700">
//                         <ul className="space-y-2">
//                           {order.items.map((item, idx) => (
//                             <li key={idx} className="flex flex-col">
//                               <span className="font-medium text-gray-800">{item.itemName}</span>
//                               <div className="flex items-center gap-2 text-xs">
//                                 <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">{item.distributor}</span>
//                                 <span className="text-gray-500">Qty: {item.quantity} | Adv: {order.advance}</span>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td className="py-4 px-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>{order.status}</span>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="flex space-x-2">
//                           {/* --- UPDATED: Edit Button triggers Modal --- */}
//                           <button onClick={() => handleEditClick(order)} title="Edit Order" className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center">
//                             <Edit size={16} />
//                           </button>
//                           <button onClick={() => handleSendReminder(order.id)} title="Send Reminder" className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center">
//                             <Bell size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
//               <p className="text-sm text-gray-600">Showing {displayedOrders.length} of {filteredOrders.length} entries</p>
//               <div className="flex items-center space-x-2">
//                 <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronLeft size={18} /></button>
//                 <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
//                 <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded-md bg-gray-100 disabled:opacity-50"><ChevronRight size={18} /></button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* --- NEW: Edit Order Modal --- */}
//       {isEditModalOpen && currentOrder && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center shrink-0">
//               <h3 className="text-lg font-bold text-white">Edit Order #{currentOrder.id}</h3>
//               <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full"><X size={20} /></button>
//             </div>

//             <div className="p-6 space-y-6 overflow-y-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input type="date" name="date" value={currentOrder.date} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                   <input type="tel" name="phone" value={currentOrder.phone} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
//                   <input type="text" name="advance" value={currentOrder.advance} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select name="status" value={currentOrder.status} onChange={handleEditChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none">
//                     <option value="Placed">Placed</option>
//                     <option value="Needs Review">Needs Review</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">Order Items</h4>
//                 <div className="space-y-4">
//                   {currentOrder.items.map((item, idx) => (
//                     <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <div className="sm:col-span-2">
//                         <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
//                         <input type="text" name="itemName" value={item.itemName} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
//                         <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">Distributor</label>
//                         <select name="distributor" value={item.distributor} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
//                           <option value="">Select</option>
//                           {distributors.map(d => <option key={d} value={d}>{d}</option>)}
//                         </select>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 shrink-0 border-t border-gray-200">
//               <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
//               <button onClick={handleSaveOrder} className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"><Save size={18} /><span>Save Changes</span></button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffOrders;

import React, { useState, useEffect } from 'react';
import {
  Edit, Filter, ChevronLeft, ChevronRight,
  Menu, ShoppingCart, Bell, AlertTriangle, Trash2,
  X, Save, Eye
} from 'lucide-react';
import StaffSidebar from './StaffSidebar';
import api from '../services/api'; // Assuming you have an api service file

const StaffOrders = () => {
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    date: '',
    phone: '',
    advance: '',
    status: 'Placed'
  });

  // Items State
  const [items, setItems] = useState([
    { itemName: '', quantity: '', distributor: '' }
  ]);
  const [isForReview, setIsForReview] = useState(false);

  // Distributors State
  const [distributors, setDistributors] = useState([
    'MedSupply Co.', 'PharmaCorp Ltd.', 'Apex Distributors',
    'Global Health Pharma', 'Sunway Medical Supplies',
    'Heritage Pharmaceuticals', 'Reliance Pharma'
  ]);

  // Orders Data
  const [orders, setOrders] = useState([]);

  // Fetch Orders on component mount
  useEffect(() => {
    fetchOrders();
    // Optionally fetch distributors from backend
    // fetchDistributors();
  }, []);

  // Fetch orders from backend
  const fetchOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
      setError('Failed to fetch orders. Please try again.');
      // Fallback to mock data if needed
      setOrders([
        {
          _id: 1, date: '2024-01-15', phone: '+91 98765 43210', status: 'Placed', advance: '₹2,500',
          items: [{ itemName: 'Paracetamol 500mg', quantity: 100, distributor: 'MedSupply Co.' }]
        },
        {
          _id: 2, date: '2024-01-14', phone: '+91 87654 32109', status: 'Needs Review', advance: '₹1,200',
          items: [{ itemName: 'Amoxicillin 250mg', quantity: 50, distributor: 'PharmaCorp Ltd.' }]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Main Form Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const handleAddItemRow = () => {
    setItems([...items, { itemName: '', quantity: '', distributor: '' }]);
  };

  const handleRemoveItemRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Add Order with backend integration
  const handleAddOrder = async () => {
    if (!formData.date || !formData.phone) {
      alert('Please fill in Date and Phone');
      return;
    }

    if (items.some(i => !i.itemName || !i.quantity || !i.distributor)) {
      alert('Please complete all item fields');
      return;
    }

    try {
      const payload = {
        date: formData.date,
        phone: formData.phone,
        advance: Number(formData.advance) || 0,
        status: isForReview ? 'Needs Review' : 'Placed',
        items: items.map(i => ({
          itemName: i.itemName,
          quantity: Number(i.quantity),
          distributor: i.distributor
        }))
      };
      
      const res = await api.post("/orders", payload);

      // Add the new order to the beginning of the list
      setOrders(prev => [res.data.order, ...prev]);

      // Reset form
      setFormData({ date: '', phone: '', advance: '', status: 'Placed' });
      setItems([{ itemName: '', quantity: '', distributor: '' }]);
      setIsForReview(false);

      alert('Order added successfully!');
    } catch (error) {
      console.error("Create Order Error:", error);
      alert("Failed to create order");
    }
  };

  // Send Reminder
  const handleSendReminder = async (id) => {
    const order = orders.find(o => o._id === id || o.id === id);
    if (order) {
      try {
        // In a real app, you might call an API endpoint to send SMS/email
        // await api.post(`/orders/${id}/reminder`);
        setReminderMessage(`Reminder sent to ${order.phone}`);
        setTimeout(() => setReminderMessage(''), 3000);
      } catch (error) {
        console.error("Error sending reminder:", error);
        alert("Failed to send reminder");
      }
    }
  };

  // Edit Handlers
  const handleEditClick = (order) => {
    setCurrentOrder({
      ...order,
      // Ensure date is in YYYY-MM-DD format for date input
      date: order.date.split('T')[0] || order.date
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (order) => {
    setCurrentOrder({
      ...order,
      date: order.date.split('T')[0] || order.date
    });
    setIsViewModalOpen(true);
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

  // Save Updated Order
  const handleSaveOrder = async () => {
    try {
      const res = await api.put(`/orders/${currentOrder._id}`, currentOrder);

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === currentOrder._id ? res.data : order
        )
      );

      setIsEditModalOpen(false);
      setCurrentOrder(null);
      alert('Order updated successfully!');
    } catch (error) {
      console.error("Update Order Error:", error);
      alert("Failed to update order");
    }
  };

  // Filtering & Pagination
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Placed': return 'bg-green-100 text-green-700';
      case 'Needs Review': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      <StaffSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Orders</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block">Welcome,</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white hidden sm:block">Sarah Johnson</span>
                <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                  SJ
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Reminder Message */}
          {reminderMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg">
              <p className="font-bold">Success</p>
              <p className="text-sm">{reminderMessage}</p>
            </div>
          )}

          {/* Add Order Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Add New Order</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Order</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                <input
                  type="text"
                  name="advance"
                  placeholder="Advance"
                  value={formData.advance}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h4>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-center border-b border-gray-100 pb-3 md:border-0 md:pb-0">
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      name="itemName"
                      placeholder="Item Name"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <select
                      name="distributor"
                      value={item.distributor}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
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
                  <div className="md:col-span-2 flex space-x-2">
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
              <button
                onClick={handleAddOrder}
                disabled={isLoading}
                className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-[#1a5256] transition-colors font-medium text-sm disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : '+ Add Order'}
              </button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="markForReview"
                  checked={isForReview}
                  onChange={(e) => setIsForReview(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#246e72] focus:ring-[#246e72]"
                />
                <label htmlFor="markForReview" className="text-sm font-medium text-gray-700">
                  Mark for Review
                </label>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Order List Table */}
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
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-[#1a5256] transition-colors font-medium flex items-center space-x-2 text-sm"
                  >
                    <Filter size={18} />
                    <span>Filter</span>
                  </button>
                </div>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                >
                  <option value={10}>Show 10</option>
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search item, distributor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">DATE</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">PHONE</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ITEMS & DISTRIBUTORS</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">STATUS</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : displayedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    displayedOrders.map(order => (
                      <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {order.date ? order.date.split('T')[0] : 'N/A'}
                        </td>
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
                                  <span className="text-gray-500">
                                    Qty: {item.quantity} | Adv: {order.advance ? `₹${order.advance}` : 'N/A'}
                                  </span>
                                </div>
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
                            <button
                              onClick={() => handleViewClick(order)}
                              title="View Order"
                              className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditClick(order)}
                              title="Edit Order"
                              className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleSendReminder(order._id || order.id)}
                              title="Send Reminder"
                              className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-[#1a5256] flex items-center justify-center"
                            >
                              <Bell size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">
                Showing {Math.min(displayedOrders.length, entriesPerPage)} of {filteredOrders.length} entries
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Order Modal */}
      {isEditModalOpen && currentOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-white">Edit Order #{currentOrder._id || currentOrder.id}</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white hover:bg-teal-700 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={currentOrder.date}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={currentOrder.phone}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                  <input
                    type="text"
                    name="advance"
                    value={currentOrder.advance}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={currentOrder.status}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Needs Review">Needs Review</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">Order Items</h4>
                <div className="space-y-4">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                        <input
                          type="text"
                          name="itemName"
                          value={item.itemName}
                          onChange={(e) => handleEditItemChange(idx, e)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleEditItemChange(idx, e)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Distributor</label>
                        <select
                          name="distributor"
                          value={item.distributor}
                          onChange={(e) => handleEditItemChange(idx, e)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                        >
                          <option value="">Select</option>
                          {distributors.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 shrink-0 border-t border-gray-200">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                className="px-4 py-2 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {isViewModalOpen && currentOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-white">View Order #{currentOrder._id || currentOrder.id}</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-white hover:bg-teal-700 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{currentOrder.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{currentOrder.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{currentOrder.advance || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(currentOrder.status)}`}>
                    {currentOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">Order Items</h4>
                <div className="space-y-3">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                          <p className="text-sm font-medium text-gray-800">{item.itemName}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                          <p className="text-sm text-gray-700">{item.quantity}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Distributor</label>
                          <span className="inline-block bg-teal-50 text-teal-700 px-2 py-1 rounded text-sm">
                            {item.distributor}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end shrink-0 border-t border-gray-200">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOrders;
// import React, { useState , useEffect } from 'react';
// import { 
//   Edit, Trash2, Filter, Download, 
//   ChevronLeft, ChevronRight, X, 
//   ShoppingCart, Truck, 
//   Bell, Menu 
// } from 'lucide-react';
// import AdminSidebar from './AdminSidebar';
// import api from '../services/api';

// const OrdersPage = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showExportDropdown, setShowExportDropdown] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [orderToDelete, setOrderToDelete] = useState(null);

//   const [orders, setOrders] = useState([]);

//   const distributors = [
//     'MedSupply Co.',
//     'PharmaCorp Ltd.',
//     'DiabetesCare Inc.',
//     'HealthPlus Dist.',
//     'Apex Distributors',
//     'Global Health Pharma'
//   ];

//   // ORDER FORM
//   const [formData, setFormData] = useState({
//     date: '',
//     phone: '',
//     advance: ''
//   });

//   const [items, setItems] = useState([
//     { itemName: '', quantity: '', distributor: '' }
//   ]);

//   // FETCH ORDERS
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await api.get("/orders");
//       setOrders(res.data);
//     } catch (err) {
//       console.error("Error fetching orders", err);
//     }
//   };

//   // FORM HANDLERS
//   const handleFormChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleItemChange = (index, e) => {
//     const updated = [...items];
//     updated[index][e.target.name] = e.target.value;
//     setItems(updated);
//   };

//   const handleAddItemRow = () => {
//     setItems([...items, { itemName: '', quantity: '', distributor: '' }]);
//   };

//   const handleRemoveItemRow = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   // DELETE ORDER
//   const handleDeleteOrder = async (id) => {
//     try {
//       await api.delete(`/orders/${id}`);
//       setOrders(prev => prev.filter(o => o._id !== id));
//     } catch (error) {
//       console.error("Delete Error:", error);
//       alert("Failed to delete order");
//     }
//   };

//   // ADD ORDER
//   const handleAddOrder = async () => {
//     if (!formData.date || !formData.phone) {
//       alert("Please fill Date and Phone");
//       return;
//     }

//     if (items.some(i => !i.itemName || !i.quantity || !i.distributor)) {
//       alert("Please fill all item fields");
//       return;
//     }

//     try {
//       const payload = {
//         date: formData.date,
//         phone: formData.phone,
//         advance: Number(formData.advance) || 0,
//         items: items.map(i => ({
//           itemName: i.itemName,
//           quantity: Number(i.quantity),
//           distributor: i.distributor
//         }))
//       };

//       const res = await api.post("/orders", payload);

//       setOrders(prev => [res.data.order, ...prev]);

//       setFormData({ date: "", phone: "", advance: "" });
//       setItems([{ itemName: "", quantity: "", distributor: "" }]);

//       alert("Order added successfully!");
//     } catch (error) {
//       console.error("Create Order Error:", error);
//       alert("Failed to create order");
//     }
//   };

//   // SEARCH
//   const filteredOrders = orders.filter(order =>
//     order.phone.includes(searchQuery) ||
//     order.items.some(item =>
//       item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.distributor.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
//   const displayedOrders = filteredOrders.slice(
//     (currentPage - 1) * entriesPerPage,
//     currentPage * entriesPerPage
//   );

//   const toggleOrderSelection = (orderId) => {
//     setSelectedOrders(prev =>
//       prev.includes(orderId)
//         ? prev.filter(id => id !== orderId)
//         : [...prev, orderId]
//     );
//   };


//   return (
//     <div className="flex h-screen bg-[#D2EAF4]">
      
//       {/* Replaced Manual Sidebar with Component */}
//       <AdminSidebar 
//         isSidebarOpen={isSidebarOpen} 
//         setIsSidebarOpen={setIsSidebarOpen} 
//       />

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
//           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
//             <div className="flex items-center space-x-4">
//               <button
//                 className="lg:hidden text-white"
//                 onClick={() => setIsSidebarOpen(true)}
//               >
//                 <Menu size={24} />
//               </button>
//               <h2 className="text-2xl font-bold text-white">Orders</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-white hidden sm:block">Welcome back,</span>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-white hidden sm:block">Dr. Admin</span>
//                 <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
//                   DA
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Orders Content */}
//         <main className="p-4 lg:p-8 space-y-6">
          
//           {/* --- UPDATED ADD ORDER FORM --- */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Order</h2>
            
//             {/* Order-Level Fields: Grid changed to 4 columns to accommodate Advance */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Date of Order</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="+91 XXXXX XXXXX"
//                   value={formData.phone}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                 />
//               </div>
//               {/* --- MOVED ADVANCE HERE (Matches StaffOrders) --- */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
//                 <input
//                   type="text"
//                   name="advance"
//                   placeholder="Advance"
//                   value={formData.advance}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
//                 />
//               </div>
//             </div>

//             {/* Item-Level Dynamic Fields */}
//             <div className="mb-4">
//               <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h4>
//               {items.map((item, index) => (
//                 // Changed grid to 12 cols
//                 <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-center border-b border-gray-100 pb-3 md:border-0 md:pb-0">
                  
//                   {/* Item Name (Expanded from 3 to 4 cols) */}
//                   <div className="md:col-span-4">
//                     <input
//                       type="text"
//                       name="itemName"
//                       placeholder="Item Name"
//                       value={item.itemName}
//                       onChange={(e) => handleItemChange(index, e)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                     />
//                   </div>

//                   {/* Distributor (Expanded from 3 to 4 cols) */}
//                   <div className="md:col-span-4">
//                     <select 
//                       name="distributor" 
//                       value={item.distributor} 
//                       onChange={(e) => handleItemChange(index, e)} 
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                     >
//                       <option value="">Select Distributor</option>
//                       {distributors.map(d => <option key={d} value={d}>{d}</option>)}
//                     </select>
//                   </div>

//                   {/* Quantity (2 cols) */}
//                   <div className="md:col-span-2">
//                     <input
//                       type="number"
//                       name="quantity"
//                       placeholder="Qty"
//                       value={item.quantity}
//                       onChange={(e) => handleItemChange(index, e)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
//                     />
//                   </div>

//                   {/* ADVANCE REMOVED FROM HERE */}

//                   {/* Actions (2 cols) */}
//                   <div className="md:col-span-2 flex space-x-2">
//                     <button
//                       onClick={handleAddItemRow}
//                       className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 flex items-center justify-center font-bold"
//                       title="Add Item"
//                     >
//                       +
//                     </button>
//                     {items.length > 1 && (
//                       <button
//                         onClick={() => handleDeleteOrder(order._id)}
//                         className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center font-bold"
//                         title="Remove Item"
//                       >
//                         <Trash2 size={16} /> 
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={handleAddOrder}
//               className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
//             >
//               + Add Order
//             </button>
//           </div>
//           {/* --- END UPDATED ADD ORDER FORM --- */}


//           {/* --- UPDATED ORDERS TABLE --- */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
//                 <ShoppingCart size={18} className="text-[#246e72]" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">Order List</h3>
//             </div>
            
//             {/* Table Controls */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                     className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
//                   >
//                     <Filter size={18} />
//                     <span>Filter</span>
//                   </button>
//                   {showFilterDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Daily</button>
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Weekly</button>
//                     </div>
//                   )}
//                 </div>

//                 <select
//                   value={entriesPerPage}
//                   onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium focus:ring-2 focus:ring-[#246e72] outline-none"
//                 >
//                   <option value={10}>10 entries</option>
//                   <option value={50}>50 entries</option>
//                   <option value={100}>100 entries</option>
//                 </select>

//                 <div className="relative">
//                   <button
//                     onClick={() => setShowExportDropdown(!showExportDropdown)}
//                     className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
//                   >
//                     <Download size={18} />
//                     <span>Export</span>
//                   </button>
//                   {showExportDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export as Excel</button>
//                       <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700">Export as PDF</button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="w-full sm:w-auto">
//                 <input
//                   type="text"
//                   placeholder="Search by item, distributor, phone..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none transition-all text-sm"
//                 />
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
//                       <input type="checkbox" className="w-4 h-4 text-[#246e72] border-gray-300 rounded" />
//                     </th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items & Distributors</th>
//                     <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedOrders.map(order => (
//                     <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-4 px-4">
//                         <input
//                           type="checkbox"
//                           checked={selectedOrders.includes(order.id)}
//                           onChange={() => toggleOrderSelection(order.id)}
//                           className="w-4 h-4 text-[#246e72] border-gray-300 rounded"
//                         />
//                       </td>
//                       <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
//                       <td className="py-4 px-4 text-sm text-gray-700">{order.phone}</td>
//                       <td className="py-4 px-4 text-sm text-gray-700">
//                         <ul className="space-y-2">
//                           {order.items.map((item, idx) => (
//                             <li key={idx} className="flex flex-col">
//                               <span className="font-medium text-gray-800">{item.itemName}</span>
//                               <div className="flex items-center gap-2 text-xs">
//                                 <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">
//                                     {item.distributor}
//                                 </span>
//                                 <span className="text-gray-500">Qty: {item.quantity} | Adv: {item.advance}</span>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="flex space-x-2">
//                           <button className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
//                             <Edit size={16} />
//                           </button>
//                           <button onClick={() => {
//                             setShowDeleteModal(true)
//                           }
//                           } className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
//                             <Trash2 size={16} />
//                           </button>
//                           {showDeleteModal && (
//                             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

//                               <div className="bg-white rounded-lg shadow-xl p-6 w-80">
//                                 <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                                   Confirm Delete
//                                 </h3>

//                                 <p className="text-sm text-gray-600 mb-6">
//                                   Are you sure you want to delete this order? This action cannot be undone.
//                                 </p>

//                                 <div className="flex justify-end space-x-3">
//                                   <button
//                                     onClick={() => setShowDeleteModal(false)}
//                                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
//                                   >
//                                     Cancel
//                                   </button>

//                                   <button
//                                     onClick={async () => {
//                                       await handleDeleteOrder(orderToDelete);
//                                       setShowDeleteModal(false);
//                                       setOrderToDelete(null);
//                                     }}
//                                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                                   >
//                                     Delete
//                                   </button>
//                                 </div>
//                               </div>

//                             </div>
//                           )}

//                           <button className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center">
//                             <Bell size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
//               <span>Showing {displayedOrders.length} of {filteredOrders.length} entries</span>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-1 rounded-md bg-gray-100 disabled:opacity-50"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <span>Page {currentPage} of {totalPages}</span>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="p-1 rounded-md bg-gray-100 disabled:opacity-50"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

//           <div className="bg-white rounded-lg shadow-xl p-6 w-80">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Confirm Delete
//             </h3>

//             <p className="text-sm text-gray-600 mb-6">
//               Are you sure you want to delete this order? This action cannot be undone.
//             </p>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={async () => {
//                   await handleDeleteOrder(orderToDelete);
//                   setShowDeleteModal(false);
//                   setOrderToDelete(null);
//                 }}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>

//         </div>
//       )}

//     </div>
//   );
// };

// export default OrdersPage;

import React, { useState, useEffect } from 'react';
import {
  Edit, Trash2, Filter, Download,
  ChevronLeft, ChevronRight, X,
  ShoppingCart, Truck,
  Bell, Menu, Plus // Added Plus icon
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import api from '../services/api';

const OrdersPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [newDistributorName, setNewDistributorName] = useState(''); // New state for distributor
  const [IsEditModal, setIsEditModal] = useState(false); // State for Edit Modal
  const [editOrderData, setEditOrderData] = useState(null); // State for order being edited
  const [orders, setOrders] = useState([]);

  // Initialize distributors state
  const [distributors, setDistributors] = useState([
    'MedSupply Co.',
    'PharmaCorp Ltd.',
    'DiabetesCare Inc.',
    'HealthPlus Dist.',
    'Apex Distributors',
    'Global Health Pharma'
  ]);


  
  // ORDER FORM
  const [formData, setFormData] = useState({
    date: '',
    phone: '',
    advance: ''
  });

  const [items, setItems] = useState([
    { itemName: '', quantity: '', distributor: '' }
  ]);

  // FETCH ORDERS
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // FORM HANDLERS
  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, e) => {
    const updated = [...items];
    updated[index][e.target.name] = e.target.value;
    setItems(updated);
  };

  const handleAddItemRow = () => {
    setItems([...items, { itemName: '', quantity: '', distributor: '' }]);
  };

  const handleRemoveItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // DELETE ORDER
  const handleDeleteOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete order");
    }
  };

  // ADD ORDER
  const handleAddOrder = async () => {
    if (!formData.date || !formData.phone) {
      alert("Please fill Date and Phone");
      return;
    }

    if (items.some(i => !i.itemName || !i.quantity || !i.distributor)) {
      alert("Please fill all item fields");
      return;
    }

    try {
      const payload = {
        date: formData.date,
        phone: formData.phone,
        advance: Number(formData.advance) || 0,
        items: items.map(i => ({
          itemName: i.itemName,
          quantity: Number(i.quantity),
          distributor: i.distributor
        }))
      };

      const res = await api.post("/orders", payload);

      setOrders(prev => [res.data.order, ...prev]);

      setFormData({ date: "", phone: "", advance: "" });
      setItems([{ itemName: "", quantity: "", distributor: "" }]);

      alert("Order added successfully!");
    } catch (error) {
      console.error("Create Order Error:", error);
      alert("Failed to create order");
    }
  };

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  // ADD NEW DISTRIBUTOR
  const handleAddDistributor = () => {
    if (!newDistributorName.trim()) {
      alert("Please enter a distributor name");
      return;
    }

    // Check if distributor already exists
    if (distributors.includes(newDistributorName.trim())) {
      alert("Distributor already exists!");
      return;
    }

    // Add new distributor to the list
    setDistributors(prev => [...prev, newDistributorName.trim()]);
    setNewDistributorName('');
    alert(`Distributor "${newDistributorName.trim()}" added successfully!`);
  };

  // SEARCH
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

  const handleEditItemChange = (index, field, value) => {
    const updatedItems = [...editOrderData.items];
    updatedItems[index][field] = value;
    setEditOrderData({ ...editOrderData, items: updatedItems });
  };

  const handleAddEditItemRow = () => {
    setEditOrderData({
      ...editOrderData,
      items: [...editOrderData.items, { itemName: "", distributor: "", quantity: "" }]
    });
  };

  const handleRemoveEditItemRow = (index) => {
    const updatedItems = editOrderData.items.filter((_, i) => i !== index);
    setEditOrderData({ ...editOrderData, items: updatedItems });
  };

  const handleUpdateOrder = async () => {
    try {
      // await axios.put(`/api/orders/${editOrderData._id}`, editOrderData);
      console.log("Updated Order:", editOrderData);

      setIsEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

// function to return date dd-mm-yyyy
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

  return (
    <div className="flex h-screen bg-[#D2EAF4]">

      {/* Replaced Manual Sidebar with Component */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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

            {/* Order-Level Fields: Grid changed to 4 columns to accommodate Advance */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              {/* --- MOVED ADVANCE HERE (Matches StaffOrders) --- */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                <input
                  type="text"
                  name="advance"
                  placeholder="Advance"
                  value={formData.advance}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none"
                />
              </div>
            </div>

            {/* Item-Level Dynamic Fields */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h4>
              {items.map((item, index) => (
                // Changed grid to 12 cols
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-center border-b border-gray-100 pb-3 md:border-0 md:pb-0">

                  {/* Item Name (Expanded from 3 to 4 cols) */}
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

                  {/* Distributor (Expanded from 3 to 4 cols) */}
                  <div className="md:col-span-4">
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
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4 text-[#246e72] border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{formatDate(order.date)}</td>
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
                                <span className="text-gray-500">Qty: {item.quantity} | Adv: {order.advance}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                          onClick={()=>{
                            setIsEditModal(true);
                            setEditOrderData(JSON.parse(JSON.stringify(order)));}}
                          >
                            <Edit size={16} />
                          </button>
                          <button onClick={() => {
                            setShowDeleteModal(true);
                            setOrderToDelete(order._id);
                          }}
                            className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
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

          {/* --- ADD NEW DISTRIBUTOR SECTION (Added at the bottom) --- */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <Truck size={18} className="text-[#246e72]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Manage Distributors</h3>
            </div>

            {/* Distributor List */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Available Distributors</h4>
              <div className="flex flex-wrap gap-2">
                {distributors.map((distributor, index) => (
                  <div
                    key={index}
                    className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-100 text-sm font-medium flex items-center gap-2"
                  >
                    <span>{distributor}</span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${distributor} from distributors list?`)) {
                          setDistributors(prev => prev.filter(d => d !== distributor));
                        }
                      }}
                      className="text-teal-500 hover:text-teal-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Distributor Form */}
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add New Distributor</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter distributor name (e.g. Wellness Pharma)"
                    value={newDistributorName}
                    onChange={(e) => setNewDistributorName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                  />
                  <button
                    onClick={handleAddDistributor}
                    className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add new distributors that will appear in the dropdown when creating orders.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteOrder(orderToDelete);
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {IsEditModal && editOrderData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Order</h2>
              <button onClick={() => setIsEditModal(false)}>
                <X />
              </button>
            </div>

            {/* Order Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={formatDateForInput(editOrderData.date)}
                  onChange={(e) =>
                    setEditOrderData({
                      ...editOrderData,
                      date: e.target.value, // becomes YYYY-MM-DD
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

              </div>


              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={editOrderData.phone}
                  onChange={(e) =>
                    setEditOrderData({ ...editOrderData, phone: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Advance</label>
                <input
                  type="number"
                  value={editOrderData.advance}
                  onChange={(e) =>
                    setEditOrderData({ ...editOrderData, advance: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Items */}
            <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>

            {editOrderData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3"
              >
                <div className="md:col-span-4">
                  <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) => handleEditItemChange(index, "itemName", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div className="md:col-span-4">
                  <select
                    value={item.distributor}
                    onChange={(e) => handleEditItemChange(index, "distributor", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
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
                    value={item.quantity}
                    onChange={(e) => handleEditItemChange(index, "quantity", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={handleAddEditItemRow}
                    className="w-8 h-8 bg-[#246e72] text-white rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>

                  {editOrderData.items.length > 1 && (
                    <button
                      onClick={() => handleRemoveEditItemRow(index)}
                      className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

              </div>
            ))}

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateOrder}
                className="px-4 py-2 bg-[#246e72] text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
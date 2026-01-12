<<<<<<< HEAD
// import React, { useState, useEffect } from 'react';
// import {
//   CheckSquare, Package, X, Menu,
//   AlertCircle, Save, ArrowRight, History
// } from 'lucide-react';
// import AdminSidebar from './AdminSidebar';
// import api from '../services/api';

// const InventoryChecklist = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("pending");

//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [currentReceipts, setCurrentReceipts] = useState({});
//   const [loading, setLoading] = useState(false);

//   /* ============================
//      FETCH ORDERS (LEFT PANEL)
//      ============================ */
//   const fetchOrders = async () => {
//     try {
//       const res = await api.get("/inventory/orders");
//       setOrders(res.data);
//     } catch (err) {
//       alert("Failed to load inventory orders");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   /* ============================
//      SELECT ORDER → LOAD CHECKLIST
//      ============================ */
//   const handleSelectOrder = async (order) => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/inventory/orders/${order.orderId}`);
//       setSelectedOrder(res.data);
//       setCurrentReceipts({});
//     } catch (err) {
//       alert("Failed to load order checklist");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ============================
//      HANDLE INPUT
//      ============================ */
//   const handleInputChange = (itemName, val, maxLimit) => {
//     const numVal = parseInt(val) || 0;
//     if (numVal < 0) return;
//     if (numVal > maxLimit) {
//       alert(`Cannot receive more than pending quantity (${maxLimit})`);
//       return;
//     }
//     setCurrentReceipts(prev => ({ ...prev, [itemName]: numVal }));
//   };

//   /* ============================
//      SUBMIT INVENTORY UPDATE
//      ============================ */
//   const handleSubmitReceipt = async () => {
//     if (!selectedOrder) return;

//     const payloadItems = selectedOrder.items
//       .filter(item => currentReceipts[item.itemName] > 0)
//       .map(item => ({
//         itemName: item.itemName,
//         receivedNow: currentReceipts[item.itemName]
//       }));

//     if (payloadItems.length === 0) {
//       alert("Please enter at least one received quantity");
//       return;
//     }

//     try {
//       await api.post("/inventory/update", {
//         orderId: selectedOrder.orderId,
//         items: payloadItems
//       });

//       alert("Inventory updated successfully!");
//       setSelectedOrder(null);
//       setCurrentReceipts({});
//       fetchOrders();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update inventory");
//     }
//   };

//   /* ============================
//      HELPERS
//      ============================ */
//   const getStatusColor = (status) => {
//     if (status === "Completed") return "bg-green-100 text-green-700 border-green-200";
//     if (status === "Partial") return "bg-orange-100 text-orange-700 border-orange-200";
//     return "bg-blue-100 text-blue-700 border-blue-200";
//   };

//   const filteredOrders = orders.filter(o =>
//     activeTab === "pending"
//       ? o.status !== "Completed"
//       : o.status === "Completed"
//   );

//   return (
//     <div className="flex h-screen bg-[#D2EAF4]">
//       <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

//       <div className="flex-1 overflow-auto flex flex-col">
//         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
//           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
//             <div className="flex items-center space-x-4">
//               <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
//               <h2 className="text-2xl font-bold text-white">Inventory Checklist</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">DA</div>
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 flex-1">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

//             {/* LEFT COLUMN: Toggled List */}
//             <div className="lg:col-span-1 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
//               <div className="flex border-b border-gray-100">
//                 <button
//                   onClick={() => { setActiveTab('pending'); setSelectedOrder(null); }}
//                   className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tl-xl ${activeTab === 'pending' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
//                 >
//                   <Package className="mr-2" size={18} /> Pending
//                 </button>
//                 <button
//                   onClick={() => { setActiveTab('past'); setSelectedOrder(null); }}
//                   className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tr-xl ${activeTab === 'past' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
//                 >
//                   <History className="mr-2" size={18} /> Past
//                 </button>
//               </div>

//               <div className="p-4 overflow-y-auto flex-1 space-y-3">
//                 {filteredOrders.length === 0 && (
//                   <p className="text-center text-gray-500 mt-10">No {activeTab} orders found.</p>
//                 )}

//                 {filteredOrders.map(order => (
//                   <div
//                     key={order.id}
//                     onClick={() => handleSelectOrder(order)}
//                     className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'border-[#246e72] bg-teal-50 ring-1 ring-[#246e72]' : 'border-gray-200 bg-white'}`}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="font-bold text-gray-700">Order #{order.items.itemName}</span>
//                       <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(order.status)}`}>
//                         {order.status}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-1">{order.distributor}</p>
//                     <div className="mt-3 flex items-center text-[#246e72] text-sm font-medium">
//                       {activeTab === 'pending' ? 'Check Items' : 'View Summary'} <ArrowRight size={14} className="ml-1" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT COLUMN: Checklist or Summary Area */}
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
//               {!selectedOrder ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
//                   <CheckSquare size={64} className="mb-4 opacity-20" />
//                   <p className="text-lg font-medium">Select an order from the {activeTab} list to view details.</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">
//                         {selectedOrder.status === 'Completed' ? 'Delivery Summary' : 'Checklist'}: Order #{selectedOrder.id}
//                       </h3>
//                       <p className="text-sm text-gray-500">{selectedOrder.distributor}</p>
//                     </div>
//                     <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
//                       <X size={24} />
//                     </button>
//                   </div>

//                   <div className="p-6 flex-1 overflow-y-auto">
//                     {selectedOrder.status !== 'Completed' ? (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start">
//                         <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={18} />
//                         <p className="text-sm text-yellow-700">
//                           Enter the quantity received <strong>today</strong>.
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-start">
//                         <CheckSquare className="text-green-600 mt-0.5 mr-2" size={18} />
//                         <p className="text-sm text-green-700">
//                           This order was fully received on <strong>{selectedOrder.date}</strong>.
//                         </p>
//                       </div>
//                     )}

//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b-2 border-gray-100">
//                           <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">ITEM NAME</th>
//                           <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">ORDERED</th>
//                           <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">
//                             {selectedOrder.status === 'Completed' ? 'TOTAL RECEIVED' : 'PREV. REC.'}
//                           </th>
//                           {selectedOrder.status !== 'Completed' && (
//                             <>
//                               <th className="text-center py-3 px-2 text-sm font-semibold text-[#246e72]">RECEIVED NOW</th>
//                               <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">PENDING</th>
//                             </>
//                           )}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedOrder.items.map(item => (
//                           <tr key={item.id} className="border-b border-gray-50">
//                             <td className="py-4 px-2 font-medium text-gray-800">{item.name}</td>
//                             <td className="py-4 px-2 text-center text-gray-600">{item.orderedQty}</td>
//                             <td className="py-4 px-2 text-center text-gray-600">{item.receivedQty}</td>
//                             {selectedOrder.status !== 'Completed' && (
//                               <>
//                                 <td className="py-4 px-2 text-center">
//                                   {item.receivedQty < item.orderedQty ? (
//                                     <input
//                                       type="number"
//                                       className="w-20 px-2 py-1 border-2 border-teal-100 rounded text-center font-bold text-[#246e72]"
//                                       onChange={(e) => handleInputChange(item.id, e.target.value, item.orderedQty - item.receivedQty)}
//                                       value={currentReceipts[item.id] || ''}
//                                       placeholder="0"
//                                     />
//                                   ) : <span className="text-green-600 font-bold text-xs">Full</span>}
//                                 </td>
//                                 <td className="py-4 px-2 text-center font-bold text-red-500">
//                                   {item.orderedQty - (item.receivedQty + (currentReceipts[item.id] || 0))}
//                                 </td>
//                               </>
//                             )}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {selectedOrder.status !== 'Completed' && (
//                     <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
//                       <button onClick={handleSubmitReceipt} className="flex items-center space-x-2 bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-[#1a5256] font-medium">
//                         <Save size={18} /> <span>Update Inventory</span>
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default InventoryChecklist;




// import React, { useState, useEffect } from 'react';
// import {
//   CheckSquare, Package, X, Menu,
//   AlertCircle, Save, ArrowRight, History
// } from 'lucide-react';
// import AdminSidebar from './AdminSidebar';
// import api from '../services/api'; // Your axios instance

// const InventoryChecklist = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('pending');
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [currentReceipts, setCurrentReceipts] = useState({});
//   const [pastReceipts, setPastReceipts] = useState([]);
//   const [loading, setLoading] = useState({
//     orders: false,
//     checklist: false,
//     pastReceipts: false
//   });

//   // Fetch inventory orders on component mount
//   useEffect(() => {
//     fetchInventoryOrders();
//   }, []);

//   // Fetch past receipts when 'past' tab is active
//   useEffect(() => {
//     if (activeTab === 'past') {
//       fetchPastReceipts();
//     }
//   }, [activeTab]);

//   // Fetch inventory orders (for pending/past tabs)
//   const fetchInventoryOrders = async () => {
//     try {
//       setLoading(prev => ({ ...prev, orders: true }));
//       const response = await api.get('/inventory/orders');

//       // Transform backend response to include item information
//       const transformedOrders = await Promise.all(response.data.map(async (order) => {
//         try {
//           // Fetch order details to get items
//           const orderDetails = await api.get(`/inventory/orders/${order.orderId}`);

//           const items = orderDetails.data.items || [];
//           const firstItemName = items.length > 0 ? items[0].itemName : 'No Items';
//           const itemCount = items.length;

//           return {
//             id: order.orderId,
//             distributor: order.distributor || 'Unknown Distributor',
//             date: order.date ? new Date(order.date).toISOString().split('T')[0] : 'N/A',
//             status: order.status,
//             firstItemName: firstItemName,
//             itemCount: itemCount,
//             items: items // Store items for later use
//           };
//         } catch (error) {
//           console.error(`Error fetching details for order ${order.orderId}:`, error);
//           return {
//             id: order.orderId,
//             distributor: order.distributor || 'Unknown Distributor',
//             date: order.date ? new Date(order.date).toISOString().split('T')[0] : 'N/A',
//             status: order.status,
//             firstItemName: 'Error loading items',
//             itemCount: 0,
//             items: []
//           };
//         }
//       }));

//       setOrders(transformedOrders);
//     } catch (error) {
//       console.error('Error fetching inventory orders:', error);
//       alert('Failed to load inventory orders');
//     } finally {
//       setLoading(prev => ({ ...prev, orders: false }));
//     }
//   };

//   // Fetch past receipts
//   const fetchPastReceipts = async () => {
//     try {
//       setLoading(prev => ({ ...prev, pastReceipts: true }));
//       const response = await api.get('/inventory/receipts');

//       // Group receipts by order to get item information
//       const ordersMap = new Map();

//       // First, fetch all unique orders
//       const uniqueOrderIds = [...new Set(response.data.map(receipt => receipt.orderId))];

//       const orderPromises = uniqueOrderIds.map(async (orderId) => {
//         try {
//           const orderRes = await api.get(`/orders/${orderId}`);
//           return { orderId, items: orderRes.data.items };
//         } catch (error) {
//           console.error(`Error fetching order ${orderId}:`, error);
//           return { orderId, items: [] };
//         }
//       });

//       const ordersData = await Promise.all(orderPromises);
//       ordersData.forEach(data => {
//         ordersMap.set(data.orderId, data.items);
//       });

//       // Transform receipt data
//       const transformedReceipts = response.data.map(receipt => {
//         const orderItems = ordersMap.get(receipt.orderId) || [];
//         const firstItemName = orderItems.length > 0 ? orderItems[0].itemName : 'No Items';
//         const itemCount = orderItems.length;

//         return {
//           id: receipt.orderId || `receipt-${receipt._id}`,
//           distributor: orderItems[0]?.distributor || 'Unknown Distributor',
//           date: receipt.createdAt ? new Date(receipt.createdAt).toISOString().split('T')[0] : 'N/A',
//           status: 'Completed',
//           firstItemName: firstItemName,
//           itemCount: itemCount,
//           items: receipt.items.map(item => ({
//             id: `item-${receipt._id}-${item.itemName}`,
//             name: item.itemName,
//             orderedQty: 0,
//             receivedQty: item.receivedQty
//           }))
//         };
//       });

//       setPastReceipts(transformedReceipts);
//     } catch (error) {
//       console.error('Error fetching past receipts:', error);
//       alert('Failed to load past receipts');
//     } finally {
//       setLoading(prev => ({ ...prev, pastReceipts: false }));
//     }
//   };

//   // Handle order selection
//   const handleSelectOrder = async (order) => {
//     try {
//       setLoading(prev => ({ ...prev, checklist: true }));

//       if (activeTab === 'pending') {
//         // Fetch inventory details for pending order
//         const response = await api.get(`/inventory/orders/${order.id}`);
//         const inventoryData = response.data;

//         // Transform to your frontend structure
//         const transformedOrder = {
//           id: order.id,
//           distributor: inventoryData.distributor || order.distributor,
//           date: order.date,
//           status: inventoryData.status,
//           firstItemName: order.firstItemName,
//           itemCount: order.itemCount,
//           items: inventoryData.items.map((item, index) => ({
//             id: `item-${order.id}-${index}`,
//             name: item.itemName,
//             orderedQty: item.orderedQty,
//             receivedQty: item.receivedQty || 0
//           }))
//         };

//         setSelectedOrder(transformedOrder);
//         setCurrentReceipts({});
//       } else if (activeTab === 'past') {
//         // For past tab, find the receipt
//         const receipt = pastReceipts.find(r => r.id === order.id);
//         if (receipt) {
//           setSelectedOrder(receipt);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//       alert('Failed to load order details');
//     } finally {
//       setLoading(prev => ({ ...prev, checklist: false }));
//     }
//   };

//   const handleInputChange = (itemId, val, maxLimit) => {
//     const numVal = parseInt(val) || 0;
//     if (numVal < 0) return;
//     if (numVal > maxLimit) {
//       alert(`Cannot receive more than pending amount (${maxLimit})`);
//       return;
//     }
//     setCurrentReceipts(prev => ({ ...prev, [itemId]: numVal }));
//   };

//   const handleSubmitReceipt = async () => {
//     if (!selectedOrder) return;

//     try {
//       // Prepare payload for backend
//       const itemsPayload = selectedOrder.items
//         .filter(item => currentReceipts[item.id] > 0)
//         .map(item => ({
//           itemName: item.name,
//           receivedNow: currentReceipts[item.id] || 0
//         }));

//       if (itemsPayload.length === 0) {
//         alert('Please enter at least one quantity to receive');
//         return;
//       }

//       await api.post('/inventory/update', {
//         orderId: selectedOrder.id,
//         items: itemsPayload
//       });

//       // Refresh data
//       fetchInventoryOrders();
//       setSelectedOrder(null);
//       setCurrentReceipts({});
//       alert('Inventory updated successfully!');
//     } catch (error) {
//       console.error('Error updating inventory:', error);
//       alert(error.response?.data?.message || 'Failed to update inventory');
//     }
//   };

//   const getStatusColor = (status) => {
//     if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
//     if (status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
//     return 'bg-blue-100 text-blue-700 border-blue-200';
//   };

//   // Filter orders based on active tab
//   const filteredOrders = activeTab === 'pending'
//     ? orders.filter(o => o.status !== 'Completed')
//     : pastReceipts;

//   // Calculate total received including current input
//   const calculateTotalReceived = (item) => {
//     const currentReceipt = currentReceipts[item.id] || 0;
//     return item.receivedQty + currentReceipt;
//   };

//   // Format item display text
//   const getItemDisplayText = (order) => {
//     if (order.itemCount === 0) {
//       return 'No items';
//     } else if (order.itemCount === 1) {
//       return order.firstItemName;
//     } else {
//       return `${order.firstItemName} + ${order.itemCount - 1} more`;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#D2EAF4]">
//       <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

//       <div className="flex-1 overflow-auto flex flex-col">
//         <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
//           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
//             <div className="flex items-center space-x-4">
//               <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
//                 <Menu size={24} />
//               </button>
//               <h2 className="text-2xl font-bold text-white">Inventory Checklist</h2>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
//                 DA
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8 flex-1">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
//             {/* LEFT COLUMN: Toggled List */}
//             <div className="lg:col-span-1 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
//               <div className="flex border-b border-gray-100">
//                 <button
//                   onClick={() => { setActiveTab('pending'); setSelectedOrder(null); }}
//                   className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tl-xl ${activeTab === 'pending' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
//                 >
//                   <Package className="mr-2" size={18} /> Pending
//                 </button>
//                 <button
//                   onClick={() => { setActiveTab('past'); setSelectedOrder(null); }}
//                   className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tr-xl ${activeTab === 'past' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
//                 >
//                   <History className="mr-2" size={18} /> Past
//                 </button>
//               </div>

//               <div className="p-4 overflow-y-auto flex-1 space-y-3">
//                 {loading.orders || loading.pastReceipts ? (
//                   <div className="flex justify-center items-center h-32">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
//                   </div>
//                 ) : filteredOrders.length === 0 ? (
//                   <p className="text-center text-gray-500 mt-10">
//                     No {activeTab} orders found.
//                   </p>
//                 ) : (
//                   filteredOrders.map(order => (
//                     <div
//                       key={order.id}
//                       onClick={() => handleSelectOrder(order)}
//                       className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'border-[#246e72] bg-teal-50 ring-1 ring-[#246e72]' : 'border-gray-200 bg-white'}`}
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <p className="font-bold text-gray-700 text-sm mb-1">
//                             {getItemDisplayText(order)}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             Items: {order.itemCount}
//                           </p>
//                         </div>
//                         <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 mb-1">{order.distributor}</p>
//                       <p className="text-xs text-gray-500 mb-1">Date: {order.date}</p>
//                       <div className="mt-3 flex items-center text-[#246e72] text-sm font-medium">
//                         {activeTab === 'pending' ? 'Check Items' : 'View Summary'} <ArrowRight size={14} className="ml-1" />
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* RIGHT COLUMN: Checklist or Summary Area */}
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
//               {loading.checklist ? (
//                 <div className="flex-1 flex flex-col items-center justify-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#246e72] mb-4"></div>
//                   <p className="text-gray-600">Loading order details...</p>
//                 </div>
//               ) : !selectedOrder ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
//                   <CheckSquare size={64} className="mb-4 opacity-20" />
//                   <p className="text-lg font-medium">
//                     Select an order from the {activeTab} list to view details.
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">
//                         {selectedOrder.status === 'Completed' ? 'Delivery Summary' : 'Checklist'}
//                       </h3>
//                       <div className="flex items-center gap-4 mt-1">
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">Distributor:</span> {selectedOrder.distributor}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">Items:</span> {selectedOrder.itemCount}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">First Item:</span> {selectedOrder.firstItemName}
//                         </p>
//                       </div>
//                     </div>
//                     <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
//                       <X size={24} />
//                     </button>
//                   </div>

//                   <div className="p-6 flex-1 overflow-y-auto">
//                     {selectedOrder.status !== 'Completed' ? (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start">
//                         <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={18} />
//                         <p className="text-sm text-yellow-700">
//                           Enter the quantity received <strong>today</strong>.
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-start">
//                         <CheckSquare className="text-green-600 mt-0.5 mr-2" size={18} />
//                         <p className="text-sm text-green-700">
//                           This order was fully received on <strong>{selectedOrder.date}</strong>.
//                         </p>
//                       </div>
//                     )}

//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b-2 border-gray-100">
//                           <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">ITEM NAME</th>
//                           <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">ORDERED</th>
//                           <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">
//                             {selectedOrder.status === 'Completed' ? 'TOTAL RECEIVED' : 'RECEIVED TILL'}
//                           </th>
//                           {selectedOrder.status !== 'Completed' && (
//                             <>
//                               <th className="text-center py-3 px-2 text-sm font-semibold text-[#246e72]">RECEIVED NOW</th>
//                               <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">PENDING</th>
//                             </>
//                           )}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedOrder.items.map(item => (
//                           <tr key={item.id} className="border-b border-gray-50">
//                             <td className="py-4 px-2 font-medium text-gray-800">{item.name}</td>
//                             <td className="py-4 px-2 text-center text-gray-600">
//                               {activeTab === 'past' && selectedOrder.status === 'Completed' ? 'N/A' : item.orderedQty}
//                             </td>
//                             <td className="py-4 px-2 text-center font-medium text-gray-700">
//                               {selectedOrder.status === 'Completed'
//                                 ? item.receivedQty
//                                 : calculateTotalReceived(item)
//                               }
//                             </td>
//                             {selectedOrder.status !== 'Completed' && (
//                               <>
//                                 <td className="py-4 px-2 text-center">
//                                   {item.receivedQty < item.orderedQty ? (
//                                     <input
//                                       type="number"
//                                       className="w-20 px-2 py-1 border-2 border-teal-100 rounded text-center font-bold text-[#246e72]"
//                                       onChange={(e) => handleInputChange(
//                                         item.id,
//                                         e.target.value,
//                                         item.orderedQty - item.receivedQty
//                                       )}
//                                       value={currentReceipts[item.id] || ''}
//                                       placeholder="0"
//                                       min="0"
//                                       max={item.orderedQty - item.receivedQty}
//                                     />
//                                   ) : (
//                                     <span className="text-green-600 font-bold text-xs">Full</span>
//                                   )}
//                                 </td>
//                                 <td className="py-4 px-2 text-center font-bold text-red-500">
//                                   {item.orderedQty - calculateTotalReceived(item)}
//                                 </td>
//                               </>
//                             )}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {selectedOrder.status !== 'Completed' && (
//                     <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
//                       <button
//                         onClick={handleSubmitReceipt}
//                         className="flex items-center space-x-2 bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-[#1a5256] font-medium"
//                       >
//                         <Save size={18} /> <span>Update Inventory</span>
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default InventoryChecklist;

import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Package, X, Menu,
  AlertCircle, Save, ArrowRight, History
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import api from '../services/api'; // Your axios instance

const InventoryChecklist = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentReceipts, setCurrentReceipts] = useState({});
  const [pastReceipts, setPastReceipts] = useState([]);
  const [loading, setLoading] = useState({
    orders: false,
    checklist: false,
    pastReceipts: false
  });

  // Fetch inventory orders on component mount
  useEffect(() => {
    fetchInventoryOrders();
  }, []);

  // Fetch past receipts when 'past' tab is active
  useEffect(() => {
    if (activeTab === 'past') {
      fetchPastReceipts();
    }
  }, [activeTab]);

  // Fetch inventory orders (for pending/past tabs)
  const fetchInventoryOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await api.get('/inventory/orders');

      // Transform backend response to include item information
      const transformedOrders = await Promise.all(response.data.map(async (order) => {
        try {
          // Fetch order details to get items
          const orderDetails = await api.get(`/inventory/orders/${order.orderId}`);

          const items = orderDetails.data.items || [];
          const firstItemName = items.length > 0 ? items[0].itemName : 'Loading items...';
          const itemCount = items.length;

          return {
            id: order.orderId,
            distributor: order.distributor || 'Loading distributor...',
            date: order.date ? new Date(order.date).toISOString().split('T')[0] : 'N/A',
            status: order.status,
            firstItemName: firstItemName,
            itemCount: itemCount,
            items: items
          };
        } catch (error) {
          console.error(`Error fetching details for order ${order.orderId}:`, error);
          return {
            id: order.orderId,
            distributor: order.distributor || 'Unknown Distributor',
            date: order.date ? new Date(order.date).toISOString().split('T')[0] : 'N/A',
            status: order.status,
            firstItemName: 'Could not load items',
            itemCount: 0,
            items: []
          };
        }
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching inventory orders:', error);
      alert('Failed to load inventory orders');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Fetch past receipts with better data handling
  const fetchPastReceipts = async () => {
    try {
      setLoading(prev => ({ ...prev, pastReceipts: true }));

      // First, get all completed orders from inventory
      const inventoryResponse = await api.get('/inventory/orders');
      const completedOrders = inventoryResponse.data.filter(order => order.status === 'Completed');

      // Transform completed orders with their items
      const transformedReceipts = await Promise.all(completedOrders.map(async (order) => {
        try {
          // Fetch inventory details for the order
          const inventoryDetails = await api.get(`/inventory/orders/${order.orderId}`);

          // Fetch original order details for distributor and date
          const orderDetails = await api.get(`/orders/${order.orderId}`).catch(() => null);

          const items = inventoryDetails.data.items || [];
          const firstItemName = items.length > 0 ? items[0].itemName : 'Completed items';
          const itemCount = items.length;

          return {
            id: order.orderId,
            distributor: orderDetails?.data?.items?.[0]?.distributor || order.distributor || 'Completed Order',
            date: orderDetails?.data?.date ? new Date(orderDetails.data.date).toISOString().split('T')[0] : order.date || 'N/A',
            status: 'Completed',
            firstItemName: firstItemName,
            itemCount: itemCount,
            items: items.map((item, index) => ({
              id: `item-${order.orderId}-${index}`,
              name: item.itemName,
              orderedQty: item.orderedQty || 0,
              receivedQty: item.receivedQty || 0
            }))
          };
        } catch (error) {
          console.error(`Error processing completed order ${order.orderId}:`, error);
          return {
            id: order.orderId,
            distributor: order.distributor || 'Completed Order',
            date: order.date || 'N/A',
            status: 'Completed',
            firstItemName: 'Items received',
            itemCount: 0,
            items: []
          };
        }
      }));

      // Filter out null/undefined results
      const validReceipts = transformedReceipts.filter(receipt => receipt !== null);

      setPastReceipts(validReceipts);

      if (validReceipts.length === 0) {
        console.log('No completed orders found in inventory');
      }
    } catch (error) {
      console.error('Error fetching past receipts:', error);
      alert('Failed to load past receipts');
    } finally {
      setLoading(prev => ({ ...prev, pastReceipts: false }));
    }
  };

  // Handle order selection
  const handleSelectOrder = async (order) => {
    try {
      setLoading(prev => ({ ...prev, checklist: true }));

      if (activeTab === 'pending') {
        // Fetch inventory details for pending order
        const response = await api.get(`/inventory/orders/${order.id}`);
        const inventoryData = response.data;

        // Transform to your frontend structure
        const transformedOrder = {
          id: order.id,
          distributor: inventoryData.distributor || order.distributor,
          date: order.date,
          status: inventoryData.status,
          firstItemName: order.firstItemName,
          itemCount: order.itemCount,
          items: inventoryData.items.map((item, index) => ({
            id: `item-${order.id}-${index}`,
            name: item.itemName,
            orderedQty: item.orderedQty,
            receivedQty: item.receivedQty || 0
          }))
        };

        setSelectedOrder(transformedOrder);
        setCurrentReceipts({});
      } else if (activeTab === 'past') {
        // For past tab, use the order data we already have
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(prev => ({ ...prev, checklist: false }));
    }
=======
import React, { useState } from 'react';
import { 
  CheckSquare, Package, X, Menu, 
  AlertCircle, Save, ArrowRight, History
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const InventoryChecklist = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // New state to toggle between 'pending' and 'past' views in the left column
  const [activeTab, setActiveTab] = useState('pending'); 
  
  const [orders, setOrders] = useState([
    { 
      id: 101, 
      distributor: 'MedSupply Co.', 
      date: '2024-01-20',
      status: 'Partial',
      items: [
        { id: 'i1', name: 'Paracetamol 500mg', orderedQty: 100, receivedQty: 50 },
        { id: 'i2', name: 'Cetirizine 10mg', orderedQty: 200, receivedQty: 200 }
      ]
    },
    { 
      id: 102, 
      distributor: 'PharmaCorp Ltd.', 
      date: '2024-01-22',
      status: 'Pending',
      items: [
        { id: 'i3', name: 'Amoxicillin 250mg', orderedQty: 50, receivedQty: 0 },
        { id: 'i4', name: 'Vitamin C Sheets', orderedQty: 30, receivedQty: 0 }
      ] 
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentReceipts, setCurrentReceipts] = useState({});

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setCurrentReceipts({});
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
  };

  const handleInputChange = (itemId, val, maxLimit) => {
    const numVal = parseInt(val) || 0;
    if (numVal < 0) return;
    if (numVal > maxLimit) {
      alert(`Cannot receive more than pending amount (${maxLimit})`);
      return;
    }
    setCurrentReceipts(prev => ({ ...prev, [itemId]: numVal }));
  };

<<<<<<< HEAD
  const handleSubmitReceipt = async () => {
    if (!selectedOrder) return;

    try {
      // Prepare payload for backend
      const itemsPayload = selectedOrder.items
        .filter(item => currentReceipts[item.id] > 0)
        .map(item => ({
          itemName: item.name,
          receivedNow: currentReceipts[item.id] || 0
        }));

      if (itemsPayload.length === 0) {
        alert('Please enter at least one quantity to receive');
        return;
      }

      await api.post('/inventory/update', {
        orderId: selectedOrder.id,
        items: itemsPayload
      });

      // Refresh data
      fetchInventoryOrders();
      setSelectedOrder(null);
      setCurrentReceipts({});
      alert('Inventory updated successfully!');
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert(error.response?.data?.message || 'Failed to update inventory');
    }
=======
  const handleSubmitReceipt = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(order => {
      if (order.id !== selectedOrder.id) return order;

      const updatedItems = order.items.map(item => ({
        ...item,
        receivedQty: item.receivedQty + (currentReceipts[item.id] || 0)
      }));

      const isFullyComplete = updatedItems.every(i => i.receivedQty >= i.orderedQty);
      const isPartiallyStarted = updatedItems.some(i => i.receivedQty > 0);

      return {
        ...order,
        items: updatedItems,
        status: isFullyComplete ? 'Completed' : (isPartiallyStarted ? 'Partial' : 'Pending')
      };
    });

    setOrders(updatedOrders);
    setSelectedOrder(null);
    setCurrentReceipts({});
    alert("Inventory updated successfully!");
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

<<<<<<< HEAD
  // Filter orders based on active tab
  const filteredOrders = activeTab === 'pending'
    ? orders.filter(o => o.status !== 'Completed')
    : pastReceipts;

  // Calculate total received including current input
  const calculateTotalReceived = (item) => {
    const currentReceipt = currentReceipts[item.id] || 0;
    return item.receivedQty + currentReceipt;
  };

  // Format item display text
  const getItemDisplayText = (order) => {
    if (order.itemCount === 0) {
      return 'Loading items...';
    } else if (order.itemCount === 1) {
      return order.firstItemName || 'Item';
    } else {
      return `${order.firstItemName || 'Items'} + ${order.itemCount - 1} more`;
    }
  };
=======
  // Filter orders based on the active tab
  const filteredOrders = orders.filter(o => 
    activeTab === 'pending' ? o.status !== 'Completed' : o.status === 'Completed'
  );
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto flex flex-col">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
<<<<<<< HEAD
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white">Inventory Checklist</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">
                DA
              </div>
=======
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-white">Inventory Checklist</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">DA</div>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
<<<<<<< HEAD
            {/* LEFT COLUMN: Toggled List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
              <div className="flex border-b border-gray-100">
                <button
=======
            
            {/* LEFT COLUMN: Toggled List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
              <div className="flex border-b border-gray-100">
                <button 
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                  onClick={() => { setActiveTab('pending'); setSelectedOrder(null); }}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tl-xl ${activeTab === 'pending' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Package className="mr-2" size={18} /> Pending
                </button>
<<<<<<< HEAD
                <button
=======
                <button 
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                  onClick={() => { setActiveTab('past'); setSelectedOrder(null); }}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tr-xl ${activeTab === 'past' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <History className="mr-2" size={18} /> Past
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-3">
<<<<<<< HEAD
                {loading.orders || (activeTab === 'past' && loading.pastReceipts) ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#246e72]"></div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10 p-4">
                    <Package className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="font-medium">No {activeTab} orders found.</p>
                    {activeTab === 'past' && (
                      <p className="text-sm mt-1">Complete an order to see it here.</p>
                    )}
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'border-[#246e72] bg-teal-50 ring-1 ring-[#246e72]' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-700 text-sm mb-1">
                            {getItemDisplayText(order)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Items: {order.itemCount}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{order.distributor}</p>
                      <p className="text-xs text-gray-500 mb-1">Date: {order.date}</p>
                      <div className="mt-3 flex items-center text-[#246e72] text-sm font-medium">
                        {activeTab === 'pending' ? 'Check Items' : 'View Summary'} <ArrowRight size={14} className="ml-1" />
                      </div>
                    </div>
                  ))
                )}
=======
                {filteredOrders.length === 0 && (
                   <p className="text-center text-gray-500 mt-10">No {activeTab} orders found.</p>
                )}

                {filteredOrders.map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => handleSelectOrder(order)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'border-[#246e72] bg-teal-50 ring-1 ring-[#246e72]' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-700">Order #{order.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{order.distributor}</p>
                    <div className="mt-3 flex items-center text-[#246e72] text-sm font-medium">
                      {activeTab === 'pending' ? 'Check Items' : 'View Summary'} <ArrowRight size={14} className="ml-1" />
                    </div>
                  </div>
                ))}
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
              </div>
            </div>

            {/* RIGHT COLUMN: Checklist or Summary Area */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
<<<<<<< HEAD
              {loading.checklist ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#246e72] mb-4"></div>
                  <p className="text-gray-600">Loading order details...</p>
                </div>
              ) : !selectedOrder ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                  <CheckSquare size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">
                    Select an order from the {activeTab} list to view details.
                  </p>
                  {activeTab === 'past' && pastReceipts.length === 0 && (
                    <p className="text-sm mt-2 text-gray-500">
                      Complete some orders first to see past receipts.
                    </p>
                  )}
=======
              {!selectedOrder ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                  <CheckSquare size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">Select an order from the {activeTab} list to view details.</p>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
<<<<<<< HEAD
                        {selectedOrder.status === 'Completed' ? 'Delivery Summary' : 'Checklist'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Distributor:</span> {selectedOrder.distributor}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Items:</span> {selectedOrder.itemCount}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">First Item:</span> {selectedOrder.firstItemName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span> {selectedOrder.date}
                        </p>
                      </div>
=======
                        {selectedOrder.status === 'Completed' ? 'Delivery Summary' : 'Checklist'}: Order #{selectedOrder.id}
                      </h3>
                      <p className="text-sm text-gray-500">{selectedOrder.distributor}</p>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto">
                    {selectedOrder.status !== 'Completed' ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start">
                        <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={18} />
                        <p className="text-sm text-yellow-700">
                          Enter the quantity received <strong>today</strong>.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-start">
                        <CheckSquare className="text-green-600 mt-0.5 mr-2" size={18} />
                        <p className="text-sm text-green-700">
                          This order was fully received on <strong>{selectedOrder.date}</strong>.
                        </p>
                      </div>
                    )}

<<<<<<< HEAD
                    {selectedOrder.items.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="mx-auto mb-3 opacity-50" size={32} />
                        <p>No items found for this order.</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-100">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">ITEM NAME</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">ORDERED</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">
                              {selectedOrder.status === 'Completed' ? 'TOTAL RECEIVED' : 'RECEIVED TILL'}
                            </th>
                            {selectedOrder.status !== 'Completed' && (
                              <>
                                <th className="text-center py-3 px-2 text-sm font-semibold text-[#246e72]">RECEIVED NOW</th>
                                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">PENDING</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map(item => (
                            <tr key={item.id} className="border-b border-gray-50">
                              <td className="py-4 px-2 font-medium text-gray-800">{item.name}</td>
                              <td className="py-4 px-2 text-center text-gray-600">
                                {item.orderedQty || 0}
                              </td>
                              <td className="py-4 px-2 text-center font-medium text-gray-700">
                                {item.receivedQty || 0}
                              </td>
                              {selectedOrder.status !== 'Completed' && (
                                <>
                                  <td className="py-4 px-2 text-center">
                                    {(item.receivedQty || 0) < (item.orderedQty || 0) ? (
                                      <input
                                        type="number"
                                        className="w-20 px-2 py-1 border-2 border-teal-100 rounded text-center font-bold text-[#246e72]"
                                        onChange={(e) => handleInputChange(
                                          item.id,
                                          e.target.value,
                                          (item.orderedQty || 0) - (item.receivedQty || 0)
                                        )}
                                        value={currentReceipts[item.id] || ''}
                                        placeholder="0"
                                        min="0"
                                        max={(item.orderedQty || 0) - (item.receivedQty || 0)}
                                      />
                                    ) : (
                                      <span className="text-green-600 font-bold text-xs">Full</span>
                                    )}
                                  </td>
                                  <td className="py-4 px-2 text-center font-bold text-red-500">
                                    {(item.orderedQty || 0) - ((item.receivedQty || 0) + (currentReceipts[item.id] || 0))}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {selectedOrder.status !== 'Completed' && selectedOrder.items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
                      <button
                        onClick={handleSubmitReceipt}
                        className="flex items-center space-x-2 bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-[#1a5256] font-medium"
                      >
=======
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">ITEM NAME</th>
                          <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">ORDERED</th>
                          <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">
                            {selectedOrder.status === 'Completed' ? 'TOTAL RECEIVED' : 'PREV. REC.'}
                          </th>
                          {selectedOrder.status !== 'Completed' && (
                            <>
                              <th className="text-center py-3 px-2 text-sm font-semibold text-[#246e72]">RECEIVED NOW</th>
                              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">PENDING</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item.id} className="border-b border-gray-50">
                            <td className="py-4 px-2 font-medium text-gray-800">{item.name}</td>
                            <td className="py-4 px-2 text-center text-gray-600">{item.orderedQty}</td>
                            <td className="py-4 px-2 text-center text-gray-600">{item.receivedQty}</td>
                            {selectedOrder.status !== 'Completed' && (
                              <>
                                <td className="py-4 px-2 text-center">
                                  {item.receivedQty < item.orderedQty ? (
                                    <input
                                      type="number"
                                      className="w-20 px-2 py-1 border-2 border-teal-100 rounded text-center font-bold text-[#246e72]"
                                      onChange={(e) => handleInputChange(item.id, e.target.value, item.orderedQty - item.receivedQty)}
                                      value={currentReceipts[item.id] || ''}
                                      placeholder="0"
                                    />
                                  ) : <span className="text-green-600 font-bold text-xs">Full</span>}
                                </td>
                                <td className="py-4 px-2 text-center font-bold text-red-500">
                                  {item.orderedQty - (item.receivedQty + (currentReceipts[item.id] || 0))}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {selectedOrder.status !== 'Completed' && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
                      <button onClick={handleSubmitReceipt} className="flex items-center space-x-2 bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-[#1a5256] font-medium">
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
                        <Save size={18} /> <span>Update Inventory</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryChecklist;
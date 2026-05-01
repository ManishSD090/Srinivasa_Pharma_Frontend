import React, { useState, useEffect, useCallback } from 'react';
import {
   Edit, Filter, ChevronLeft, ChevronRight,
   Menu, ShoppingCart, AlertTriangle, Trash2,
   X, Save, Eye, CheckSquare, Loader2, Phone, History as HistoryIcon
} from 'lucide-react';
import api from '../services/api';

const StaffOrders = () => {
   // UI State
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
   const [entriesPerPage, setEntriesPerPage] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [searchQuery, setSearchQuery] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [newDistributor, setNewDistributor] = useState('');
   const [addingDistributor, setAddingDistributor] = useState(false);

   // Call History States
   const [showHistoryModal, setShowHistoryModal] = useState(false);
   const [currentOrderLogs, setCurrentOrderLogs] = useState([]);
   const [historyLoading, setHistoryLoading] = useState(false);

   // Edit Modal States
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
   const [currentOrder, setCurrentOrder] = useState(null);

   // --- Delivered Popup States ---
   const [showDeliveredModal, setShowDeliveredModal] = useState(false);
   const [currentOrderForDelivery, setCurrentOrderForDelivery] = useState(null);
   const [deliveryItems, setDeliveryItems] = useState([]);
   const [pickedQuantities, setPickedQuantities] = useState({});
   const [deliveryDate, setDeliveryDate] = useState("");

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

   // Distributors State (Dynamic)
   const [distributors, setDistributors] = useState([]);

   // Orders Data
   const [orders, setOrders] = useState([]);
   const [inventoryStatusMap, setInventoryStatusMap] = useState({});

   // Fetch Distributors from backend
   const fetchDistributors = useCallback(async () => {
      try {
         const res = await api.get("/distributors");
         setDistributors(res.data);
      } catch (err) {
         console.error("Error fetching distributors", err);
      }
   }, []);

   // Fetch Orders on component mount
   useEffect(() => {
      fetchOrders();
      fetchDistributors();
   }, [fetchDistributors]);

   // Fetch orders from backend
   const fetchOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
         const res = await api.get("/orders");
         setOrders(res.data);

         // Fetch inventory status for each order
         const statusMap = {};
         for (const order of res.data) {
            try {
               const inventoryRes = await api.get(`/inventory/orders/${order._id || order.id}`);
               statusMap[order._id || order.id] = inventoryRes.data.status || 'Pending';
            } catch {
               statusMap[order._id || order.id] = 'Pending';
            }
         }
         setInventoryStatusMap(statusMap);
      } catch (err) {
         console.error("Error fetching orders", err);
         setError('Failed to fetch orders. Please try again.');
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

         setOrders(prev => [res.data.order, ...prev]);

         setFormData({ date: '', phone: '', advance: '', status: 'Placed' });
         setItems([{ itemName: '', quantity: '', distributor: '' }]);
         setIsForReview(false);

         alert('Order added successfully!');
      } catch (error) {
         console.error("Create Order Error:", error);
         alert("Failed to create order");
      }
   };

   const handleAddDistributor = async () => {
      if (!newDistributor.trim()) {
         alert("Enter distributor name");
         return;
      }

      try {
         setAddingDistributor(true);

         const res = await api.post("/distributors", {
            name: newDistributor
         });

         // Update dropdown instantly
         setDistributors(prev => [...prev, res.data]);

         setNewDistributor('');
         alert("Distributor added successfully 🚀");

      } catch (err) {
         console.error(err);
         alert("Failed to add distributor");
      } finally {
         setAddingDistributor(false);
      }
   };

   const handleDeleteDistributor = async (id) => {
      if (!window.confirm("Are you sure you want to delete this distributor?")) return;

      try {
         await api.delete(`/distributors/${id}`);

         // Remove from UI instantly
         setDistributors(prev => prev.filter(d => d._id !== id));

         alert("Distributor deleted ✅");
      } catch (err) {
         console.error(err);
         alert("Failed to delete distributor");
      }
   };

   // --- Call/History Logic ---
   const handleCallClick = async (order) => {
      try {
         await api.post('/orders/log-call', { orderId: order._id || order.id, phone: order.phone });
         window.location.href = `tel:${order.phone}`;
      } catch (err) {
         console.error("Failed to log call", err);
         window.location.href = `tel:${order.phone}`;
      }
   };

   const handleShowHistory = async (orderId) => {
      try {
         setHistoryLoading(true);
         setShowHistoryModal(true);
         const res = await api.get(`/orders/logs/${orderId}`);
         setCurrentOrderLogs(res.data);
      } catch (err) {
         console.error("Failed to fetch history", err);
      } finally {
         setHistoryLoading(false);
      }
   };

   // --- Delivery Logic ---
   const handleOpenDeliveryModal = (order) => {
      setCurrentOrderForDelivery(order);

      const initialDeliveryItems = order.items.map(item => {
         const alreadyDelivered = item.deliveredQuantity || 0;
         const remaining = item.quantity - alreadyDelivered;

         return {
            ...item,
            remainingQuantity: remaining
         };
      });

      setDeliveryItems(initialDeliveryItems);
      setPickedQuantities({});

      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setDeliveryDate(now.toISOString().slice(0, 16));

      setShowDeliveredModal(true);
   };

   const handleDeliveryQtyChange = (itemId, value) => {
      setPickedQuantities(prev => ({ ...prev, [itemId]: Number(value) }));
   };

   const handleSaveDelivery = async () => {
      try {
         const payload = {
            deliveryDate: deliveryDate,
            items: deliveryItems
               .filter(item => pickedQuantities[item._id] > 0)
               .map(item => ({
                  itemId: item._id,
                  pickedQuantity: pickedQuantities[item._id]
               }))
         };

         await api.post(`/orders/delivered/${currentOrderForDelivery._id || currentOrderForDelivery.id}`, payload);

         alert("Order pickup recorded!");
         setShowDeliveredModal(false);
         fetchOrders();
      } catch (err) {
         console.error(err);
         alert("Failed to save delivery. Check backend console for details.");
      }
   };

   // Edit Handlers
   const handleEditClick = (order) => {
      setCurrentOrder({
         ...order,
         date: order.date?.split('T')[0] || order.date
      });
      setIsEditModalOpen(true);
   };

   const handleViewClick = (order) => {
      setCurrentOrder({
         ...order,
         date: order.date?.split('T')[0] || order.date
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
         const res = await api.put(`/orders/${currentOrder._id || currentOrder.id}`, currentOrder);

         setOrders(prevOrders =>
            prevOrders.map(order =>
               (order._id || order.id) === (currentOrder._id || currentOrder.id) ? res.data : order
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
      (order.phone || "").includes(searchQuery) ||
      (order.items || []).some(item =>
         item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.distributor.toLowerCase().includes(searchQuery.toLowerCase())
      )
   );

   const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
   const displayedOrders = filteredOrders.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
   );

   const getInventoryStatusColor = (status) => {
      if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
      if (status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
      return 'bg-blue-100 text-blue-700 border-blue-200';
   };

   return (
      <div className="flex h-screen bg-[#D2EAF4]">

         <div className="flex-1 overflow-auto">
            <main className="p-4 lg:p-8 space-y-6">
               {/* Error Message */}
               {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
                     <p className="font-bold">Error</p>
                     <p className="text-sm">{error}</p>
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
                                    <option key={d._id} value={d.name}>{d.name}</option>
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
                              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">DELIVERED</th>
                              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">DATE</th>
                              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">PHONE</th>
                              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ITEMS & DISTRIBUTORS</th>
                              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">INV STATUS</th>
                              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-left">ACTIONS</th>
                           </tr>
                        </thead>
                        <tbody>
                           {isLoading ? (
                              <tr>
                                 <td colSpan="6" className="py-8 text-center text-gray-500">
                                    <Loader2 className="animate-spin mx-auto text-[#246e72]" />
                                 </td>
                              </tr>
                           ) : displayedOrders.length === 0 ? (
                              <tr>
                                 <td colSpan="6" className="py-8 text-center text-gray-500">
                                    No orders found
                                 </td>
                              </tr>
                           ) : (
                              displayedOrders.map(order => (
                                 <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 text-center">
                                       <input
                                          type="checkbox"
                                          checked={order.isDeliveredToCustomer || false}
                                          readOnly
                                          onClick={() => {
                                             // 1. Check the Inventory Status first
                                             const orderId = order._id || order.id;
                                             const invStatus = inventoryStatusMap[orderId] || 'Pending';

                                             if (invStatus !== 'Completed') {
                                                alert(`Cannot mark as delivered. Inventory status is currently '${invStatus}'. Please wait until the distributor has delivered all items.`);
                                                return; // Stop execution here, do not open the modal
                                             }

                                             // 2. If inventory IS completed, check if customer delivery is already completed
                                             if (order.status === "Completed") {
                                                alert(`All orders for customer ${order.phone} delivered`);
                                             } else {
                                                // 3. If inventory is ready and customer hasn't received everything yet, open modal
                                                handleOpenDeliveryModal(order);
                                             }
                                          }}
                                          className={`w-4 h-4 border-gray-300 rounded !cursor-pointer ${order.status === "Partial"
                                             ? "accent-yellow-500"
                                             : order.status === "Completed"
                                                ? "accent-green-500"
                                                : "accent-[#246e72]"
                                             }`}
                                       />
                                    </td>
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
                                       <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getInventoryStatusColor(inventoryStatusMap[order._id || order.id])}`}>
                                          {inventoryStatusMap[order._id || order.id] || 'Pending'}
                                       </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
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
                                             onClick={() => handleCallClick(order)}
                                             title="Call Customer"
                                             className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                                          >
                                             <Phone size={16} />
                                          </button>
                                          <button
                                             onClick={() => handleShowHistory(order._id || order.id)}
                                             title="View Call History"
                                             className="w-8 h-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center"
                                          >
                                             <HistoryIcon size={16} />
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

               {/* Add Distributor Section */}
               <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-2 mb-6">
                     <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                        <ShoppingCart size={18} className="text-[#246e72]" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-800">
                        Manage Distributors
                     </h3>
                  </div>

                  {/* Add Distributor Input */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                     <input
                        type="text"
                        placeholder="Enter distributor name"
                        value={newDistributor}
                        onChange={(e) => setNewDistributor(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm"
                     />

                     <button
                        onClick={handleAddDistributor}
                        disabled={addingDistributor}
                        className="bg-[#246e72] text-white px-6 py-2 rounded-lg hover:bg-[#1a5256] transition-colors font-medium text-sm disabled:opacity-50"
                     >
                        {addingDistributor ? "Adding..." : "+ Add"}
                     </button>
                  </div>

                  {/* Distributor List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                     {distributors.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center">
                           No distributors added yet
                        </p>
                     ) : (
                        distributors.map((d) => (
                           <div
                              key={d._id}
                              className="flex items-center justify-between bg-[#D2EAF4] px-4 py-2 rounded-lg"
                           >
                              <span className="text-sm font-medium text-gray-800">
                                 {d.name}
                              </span>

                              <button
                                 onClick={() => handleDeleteDistributor(d._id)}
                                 className="text-red-500 hover:text-red-700"
                                 title="Delete"
                              >
                                 <X size={16} />
                              </button>
                           </div>
                        ))
                     )}
                  </div>
               </div>

            </main>
         </div>

         {/* --- Delivered Modal --- */}
         {showDeliveredModal && currentOrderForDelivery && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="bg-[#21696d] p-4 flex justify-between items-center text-white font-bold">
                     <span className="flex items-center gap-2"><CheckSquare size={18} /> Mark as Delivered</span>
                     <button onClick={() => setShowDeliveredModal(false)}><X size={20} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                     <div className="flex justify-between border-b pb-2">
                        <p className="text-sm"><strong>Phone:</strong> {currentOrderForDelivery.phone}</p>
                        <p className="text-sm"><strong>Order Date:</strong> {currentOrderForDelivery.date?.split('T')[0]}</p>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date & Time</label>
                        <input
                           type="datetime-local"
                           value={deliveryDate}
                           onChange={(e) => setDeliveryDate(e.target.value)}
                           className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#246e72]"
                        />
                     </div>
                     <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {deliveryItems.map((item) => (
                           <div key={item._id} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg bg-gray-50">
                              <div className="col-span-7">
                                 <p className="text-sm font-semibold text-gray-800">{item.itemName}</p>
                                 <p className="text-xs text-gray-500 italic">{item.distributor}</p>
                              </div>
                              <div className="col-span-2 text-xs text-center font-medium">
                                 Ordered: {item.quantity} <br />
                                 <span className="text-gray-500">Left: {item.remainingQuantity - (pickedQuantities[item._id] || 0)}</span>
                              </div>
                              <div className="col-span-3">
                                 <label className="text-[10px] text-gray-400 block mb-0.5">Picked Qty</label>
                                 <input
                                    type="number"
                                    min="0"
                                    max={item.remainingQuantity}
                                    value={pickedQuantities[item._id] || ''}
                                    onChange={(e) => handleDeliveryQtyChange(item._id, e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm text-center outline-none focus:ring-1 focus:ring-[#246e72]"
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-4 bg-gray-50 text-right space-x-3">
                     <button onClick={() => setShowDeliveredModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
                     <button onClick={handleSaveDelivery} className="px-4 py-2 bg-[#21696d] text-white rounded-lg text-sm font-medium hover:bg-teal-800">Save Delivery Details</button>
                  </div>
               </div>
            </div>
         )}

         {/* Call History Modal */}
         {showHistoryModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                  <div className="bg-[#21696d] p-4 flex justify-between items-center text-white font-bold">
                     <span><HistoryIcon size={18} className="inline mr-2" /> Reminder History</span>
                     <button onClick={() => setShowHistoryModal(false)}><X size={20} /></button>
                  </div>
                  <div className="p-6 max-h-[400px] overflow-y-auto">
                     {historyLoading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#246e72]" /></div>
                     ) : currentOrderLogs.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No call history found for this order.</p>
                     ) : (
                        <div className="space-y-4">
                           {currentOrderLogs.map((log, index) => (
                              <div key={log._id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0">
                                 <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{currentOrderLogs.length - index}</div>
                                 <div>
                                    <p className="text-sm font-medium text-gray-800">Call Dialed</p>
                                    <p className="text-xs text-gray-500">{new Date(log.dialedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
                  <div className="p-4 bg-gray-50 text-right"><button onClick={() => setShowHistoryModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300">Close</button></div>
               </div>
            </div>
         )}

         {/* Edit Order Modal */}
         {isEditModalOpen && currentOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="bg-[#246e72] px-6 py-4 flex justify-between items-center shrink-0">
                     <h3 className="text-lg font-bold text-white">Edit Order</h3>
                     <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-teal-700 p-1 rounded-full"><X size={20} /></button>
                  </div>
                  <div className="p-6 space-y-6 overflow-y-auto">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="date" name="date" value={currentOrder.date} onChange={handleEditChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                        <input type="tel" name="phone" value={currentOrder.phone} onChange={handleEditChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
                        <input type="text" name="advance" value={currentOrder.advance} onChange={handleEditChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none md:col-span-2" />
                        <select name="status" value={currentOrder.status} onChange={handleEditChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none md:col-span-2">
                           <option value="Placed">Placed</option>
                           <option value="Needs Review">Needs Review</option>
                        </select>
                     </div>
                     <div className="space-y-4">
                        {currentOrder.items.map((item, idx) => (
                           <div key={idx} className="bg-gray-50 p-3 rounded-lg border grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input type="text" name="itemName" value={item.itemName} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 rounded-lg border sm:col-span-2" />
                              <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 rounded-lg border" />
                              <select name="distributor" value={item.distributor} onChange={(e) => handleEditItemChange(idx, e)} className="w-full px-3 py-2 rounded-lg border">
                                 {distributors.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                              </select>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                     <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                     <button onClick={handleSaveOrder} className="px-4 py-2 bg-[#246e72] text-white rounded-lg flex items-center space-x-2"><Save size={18} /><span>Save</span></button>
                  </div>
               </div>
            </div>
         )}

         {/* View Modal */}
         {isViewModalOpen && currentOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-gray-800">
               <div className="bg-white rounded-xl w-full max-w-md p-6">
                  <h3 className="text-lg font-bold mb-4">Order Details</h3>
                  <div className="space-y-2 mb-6">
                     <p><strong>Phone:</strong> {currentOrder.phone}</p>
                     <p><strong>Advance:</strong> ₹{currentOrder.advance}</p>
                     <p><strong>Items:</strong></p>
                     <ul className="list-disc pl-5">
                        {currentOrder.items.map((it, i) => <li key={i}>{it.itemName} - {it.quantity} ({it.distributor})</li>)}
                     </ul>
                  </div>
                  <button onClick={() => setIsViewModalOpen(false)} className="w-full py-2 bg-[#246e72] text-white rounded-lg">Close</button>
               </div>
            </div>
         )}
      </div>
   );
};

export default StaffOrders;
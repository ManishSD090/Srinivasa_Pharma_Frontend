import React, { useState, useEffect, useCallback } from 'react';
import {
  Edit, Trash2, Filter, Download,
  ChevronLeft, ChevronRight, X,
  ShoppingCart, History as HistoryIcon, Phone,
  Plus, Loader2, CheckSquare, AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrdersPage = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [IsEditModal, setIsEditModal] = useState(false);
  const [editOrderData, setEditOrderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentOrderLogs, setCurrentOrderLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // --- Distributor Management States (Matched with StaffOrders) ---
  const [newDistributor, setNewDistributor] = useState('');
  const [addingDistributor, setAddingDistributor] = useState(false);
  const [distributors, setDistributors] = useState([]);

  // --- Delivered Popup States ---
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [currentOrderForDelivery, setCurrentOrderForDelivery] = useState(null);
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");

  // New states for filters
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('all');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('all');
  const [distributorFilter, setDistributorFilter] = useState('');
  const [inventoryStatusMap, setInventoryStatusMap] = useState({});
  const [showInventoryStatusDropdown, setShowInventoryStatusDropdown] = useState(false);
  const [showDeliveryStatusDropdown, setShowDeliveryStatusDropdown] = useState(false);

  // Available inventory status filters
  const inventoryStatusFilters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'partial', label: 'Partial' },
    { id: 'completed', label: 'Completed' }
  ];

  // Available delivery status filters
  const deliveryStatusFilters = [
    { id: 'all', label: 'All' },
    { id: 'not_delivered', label: 'Not Delivered' },
    { id: 'partial', label: 'Partially Delivered' },
    { id: 'completed', label: 'Completed' }
  ];

  // ORDER FORM
  const [formData, setFormData] = useState({
    date: '',
    phone: '',
    advance: ''
  });

  const [items, setItems] = useState([
    { itemName: '', quantity: '', distributor: '' }
  ]);

  // Fetch Distributors from Backend
  const fetchDistributors = useCallback(async () => {
    try {
      const res = await api.get("/distributors");
      setDistributors(res.data);
    } catch (err) {
      console.error("Error fetching distributors", err);
    }
  }, []);

  // FETCH ORDERS
  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);

      const statusMap = {};
      for (const order of res.data) {
        try {
          const inventoryRes = await api.get(`/inventory/orders/${order._id}`);
          statusMap[order._id] = inventoryRes.data.status || 'Pending';
        } catch (err) {
          statusMap[order._id] = 'Pending';
        }
      }
      setInventoryStatusMap(statusMap);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchDistributors();
  }, [fetchOrders, fetchDistributors]);

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
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete order");
    }
  };

  const handleApproveOrder = async (orderId) => {
    if (!window.confirm("Approve this order and add it to the active list?")) return;

    try {
      const res = await api.put(`/orders/${orderId}/approve`);
      setOrders(prev => prev.map(o => o._id === orderId ? res.data.order : o));
      alert("Order Approved!");
    } catch (err) {
      console.error("Failed to approve", err);
      alert("Failed to approve order");
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

  // --- Distributor Management Handlers (Matched with StaffOrders) ---
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

  // SEARCH AND FILTER
  const getFilteredOrders = () => {
    let filtered = orders
      .filter(Boolean)
      .filter(order =>
        (order?.phone || "").includes(searchQuery) ||
        (order?.items || []).some(item =>
          (item?.itemName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item?.distributor || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

    // Filter by Inventory Status
    if (inventoryStatusFilter !== 'all') {
      filtered = filtered.filter(order => {
        const status = inventoryStatusMap[order._id] || 'Pending';
        return status.toLowerCase() === inventoryStatusFilter.toLowerCase();
      });
    }

    // Filter by Delivery Status
    if (deliveryStatusFilter !== 'all') {
      filtered = filtered.filter(order => {
        const status = order.status || 'Placed';
        if (deliveryStatusFilter === 'not_delivered') {
          return !['Partial', 'Completed'].includes(status);
        } else if (deliveryStatusFilter === 'partial') {
          return status === 'Partial';
        } else if (deliveryStatusFilter === 'completed') {
          return status === 'Completed';
        }
        return true;
      });
    }

    if (distributorFilter.trim() !== '') {
      const searchTerm = distributorFilter.toLowerCase();
      filtered = filtered.filter(order =>
        (order.items || []).some(item =>
          (item?.distributor || "").toLowerCase().includes(searchTerm)
        )
      );
    }
    return filtered;
  };

  const clearFilters = () => {
    setInventoryStatusFilter('all');
    setDeliveryStatusFilter('all');
    setDistributorFilter('');
    setSearchQuery('');
  };

  const getInventoryStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const filteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage) || 1;
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleEditItemChange = (index, field, value) => {
    const updatedItems = [...editOrderData.items];
    updatedItems[index][field] = value;
    setEditOrderData({ ...editOrderData, items: updatedItems });
  };

  // --- Call/History Logic ---
  const handleCallClick = async (order) => {
    try {
      await api.post('/orders/log-call', { orderId: order._id, phone: order.phone });
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

  const handleOpenDeliveryModal = (order) => {
    setCurrentOrderForDelivery(order);

    const initialDeliveryItems = order.items.map((item, idx) => {
      const alreadyDelivered = item.deliveredQuantity || 0;
      const remaining = item.quantity - alreadyDelivered;

      return {
        ...item,
        id: idx,
        pickedQuantity: 0,
        remainingQuantity: remaining
      };
    });

    setDeliveryItems(initialDeliveryItems);

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDeliveryDate(now.toISOString().slice(0, 16));

    setShowDeliveredModal(true);
  };

  const handleDeliveryQtyChange = (idx, value) => {
    const updated = [...deliveryItems];
    updated[idx].pickedQuantity = Number(value);
    setDeliveryItems(updated);
  };

  const handleSaveDelivery = async () => {
    try {
      const payload = {
        deliveryDate: deliveryDate,
        items: deliveryItems.map(item => ({
          itemName: item.itemName,
          pickedQuantity: item.pickedQuantity
        }))
      };

      await api.post(`/orders/delivered/${currentOrderForDelivery._id}`, payload);

      alert("Order pickup recorded!");
      setShowDeliveredModal(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to save delivery. Check backend console for 500 error details.");
    }
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
      if (!editOrderData.date || !editOrderData?.phone) {
        alert("Date and phone are required");
        return;
      }
      if (editOrderData.items.some(i => !i.itemName || !i.quantity || !i.distributor)) {
        alert("Please fill all item fields");
        return;
      }
      const payload = {
        date: new Date(editOrderData.date),
        phone: editOrderData?.phone,
        advance: Number(editOrderData.advance) || 0,
        items: editOrderData.items.map(i => ({
          itemName: i.itemName,
          quantity: Number(i.quantity),
          distributor: i.distributor
        }))
      };
      const res = await api.put(`/orders/${editOrderData._id}`, payload);
      setOrders(prev => prev.map(o => o._id === editOrderData._id ? (res.data.order ?? o) : o));
      setIsEditModal(false);
    } catch (err) {
      console.error("Update order failed:", err);
      alert("Failed to update order");
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateStr || '—';
    }
  };

  const formatOrdersForExport = (ordersArray) => {
    const formattedData = [];
    ordersArray.forEach(order => {
      if (order.items.length === 1) {
        formattedData.push({
          Date: formatDate(order.date),
          Phone: order.phone,
          Items: `${order.items[0].itemName} (${order.items[0].distributor})`,
          Quantity: order.items[0].quantity,
          Advance: order.advance || '—',
          'Inventory Status': inventoryStatusMap[order._id] || 'Pending'
        });
      } else {
        order.items.forEach((item, index) => {
          formattedData.push({
            Date: index === 0 ? formatDate(order.date) : '',
            Phone: index === 0 ? order.phone : '',
            Items: `${item.itemName} (${item.distributor})`,
            Quantity: item.quantity,
            Advance: index === 0 ? order.advance || '—' : '',
            'Inventory Status': index === 0 ? (inventoryStatusMap[order._id] || 'Pending') : ''
          });
        });
      }
    });
    return formattedData;
  };

  const exportOrdersToExcel = () => {
    try {
      const data = formatOrdersForExport(filteredOrders);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      XLSX.writeFile(workbook, `Orders_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
      setShowExportDropdown(false);
    } catch (err) {
      alert("Failed to export Excel");
    }
  };

  const exportOrdersToPDF = () => {
    try {
      const doc = new jsPDF("landscape");
      const tableColumn = ["Date", "Phone", "Items", "Quantity", "Advance", "Inventory Status"];
      const formattedData = formatOrdersForExport(filteredOrders);
      const tableRows = formattedData.map(row => [row.Date, row.Phone, row.Items, row.Quantity, row.Advance, row['Inventory Status']]);
      doc.text("Orders Report", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [36, 110, 114] }
      });
      doc.save(`Orders_List_${new Date().toISOString().slice(0, 10)}.pdf`);
      setShowExportDropdown(false);
    } catch (err) {
      alert("Failed to export PDF");
    }
  };

  return (
    <>
      <main className="p-4 lg:p-8 space-y-6">
        {/* Add Order Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Order</label>
              <input type="date" name="date" value={formData.date} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
              <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
              <input type="text" name="advance" placeholder="Advance" value={formData.advance} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none" />
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h4>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-center border-b border-gray-100 pb-3 md:border-0 md:pb-0">
                <div className="md:col-span-4"><input type="text" name="itemName" placeholder="Item Name" value={item.itemName} onChange={(e) => handleItemChange(index, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" /></div>
                <div className="md:col-span-4">
                  <select name="distributor" value={item.distributor} onChange={(e) => handleItemChange(index, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm">
                    <option value="">Select Distributor</option>
                    {distributors.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2"><input type="number" name="quantity" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none text-sm" /></div>
                <div className="md:col-span-2 flex space-x-2">
                  <button onClick={handleAddItemRow} className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 flex items-center justify-center font-bold" title="Add Item">+</button>
                  {items.length > 1 && <button onClick={() => handleRemoveItemRow(index)} className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center font-bold" title="Remove Item"><Trash2 size={16} /></button>}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddOrder} className="bg-[#246e72] text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium">+ Add Order</button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><ShoppingCart size={18} className="text-[#246e72]" /></div>
            <h3 className="text-xl font-bold text-gray-800">Order List</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => { setShowFilterDropdown(!showFilterDropdown); clearFilters(); }} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2">
                <Filter size={18} /><span>Clear Filters</span>
              </button>
              <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium focus:ring-2 focus:ring-[#246e72] outline-none">
                <option value={10}>10 entries</option><option value={50}>50 entries</option><option value={100}>100 entries</option>
              </select>
              <button onClick={() => setShowExportDropdown(!showExportDropdown)} className="bg-[#246e72] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 relative">
                <Download size={18} /><span>Export</span>
                {showExportDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div onClick={exportOrdersToExcel} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 cursor-pointer">Export as Excel</div>
                    <div onClick={exportOrdersToPDF} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 cursor-pointer">Export as PDF</div>
                  </div>
                )}
              </button>
            </div>
            <input type="text" placeholder="Search by item, distributor, phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246e72] outline-none transition-all text-sm" />
          </div>

          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 relative">
                    <div className="flex items-center justify-start gap-1">
                      <span>Delivered</span>
                      <div className="relative">
                        <button onClick={() => { setShowDeliveryStatusDropdown(!showDeliveryStatusDropdown); setShowInventoryStatusDropdown(false); }} className="p-1 hover:bg-gray-200 rounded transition-colors"><Filter size={16} className="text-gray-600" /></button>
                        {showDeliveryStatusDropdown && (
                          <div className="absolute left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            {deliveryStatusFilters.map(filter => (
                              <button key={filter.id} onClick={() => { setDeliveryStatusFilter(filter.id); setShowDeliveryStatusDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${deliveryStatusFilter === filter.id ? 'bg-[#246e72] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>{filter.label}</button>
                            ))}
                            {deliveryStatusFilter !== 'all' && (
                              <><div className="border-t border-gray-200"></div><button onClick={() => { setDeliveryStatusFilter('all'); setShowDeliveryStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50">Clear Filter</button></>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items & Distributors</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 relative">
                    <div className="flex items-center justify-between">
                      <span>Inventory Status</span>
                      <div className="relative">
                        <button onClick={() => { setShowInventoryStatusDropdown(!showInventoryStatusDropdown); setShowDeliveryStatusDropdown(false); }} className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"><Filter size={16} className="text-gray-600" /></button>
                        {showInventoryStatusDropdown && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            {inventoryStatusFilters.map(filter => (
                              <button key={filter.id} onClick={() => { setInventoryStatusFilter(filter.id); setShowInventoryStatusDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${inventoryStatusFilter === filter.id ? 'bg-[#246e72] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>{filter.label}</button>
                            ))}
                            {inventoryStatusFilter !== 'all' && (
                              <><div className="border-t border-gray-200"></div><button onClick={() => { setInventoryStatusFilter('all'); setShowInventoryStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50">Clear Filter</button></>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map(order => (
                  <tr key={order._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${order.status === 'Needs Review' ? 'bg-yellow-50/50' : ''}`}>
                    <td className="py-4 px-4 text-center">
                      {order.status === "Needs Review" ? (
                        <AlertTriangle size={16} className="text-yellow-500 mx-auto" title="Needs Review" />
                      ) : (
                        <input
                          type="checkbox"
                          checked={order.isDeliveredToCustomer || false}
                          readOnly
                          onClick={() => {
                            const invStatus = inventoryStatusMap[order._id] || 'Pending';
                            if (invStatus !== 'Completed') {
                              alert(`Cannot mark as delivered. Inventory status is currently '${invStatus}'. Please wait until the distributor has delivered all items.`);
                              return;
                            }
                            if (order.status === "Completed") {
                              alert(`All orders for customer ${order.phone} delivered`);
                            } else {
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
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{formatDate(order.date)}</td>
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
                      {order.status === "Needs Review" ? (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
                          NEEDS REVIEW
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getInventoryStatusColor(inventoryStatusMap[order._id] || 'Pending')}`}>
                          {inventoryStatusMap[order._id] || 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {order.status === "Needs Review" && (
                          <button
                            onClick={() => handleApproveOrder(order._id)}
                            title="Approve Order"
                            className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded hover:bg-yellow-600 transition-colors"
                          >
                            APPROVE
                          </button>
                        )}
                        <button className="w-8 h-8 bg-[#246e72] text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center" onClick={() => { setIsEditModal(true); setEditOrderData(JSON.parse(JSON.stringify(order))); }}><Edit size={16} /></button>
                        <button onClick={() => handleCallClick(order)} className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center" title="Call Customer"><Phone size={16} /></button>
                        <button onClick={() => handleShowHistory(order._id)} className="w-8 h-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center" title="View Call History"><HistoryIcon size={16} /></button>
                        <button onClick={() => { setShowDeleteModal(true); setOrderToDelete(order._id); }} className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
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

        {/* --- Add Distributor Section (Matched with StaffOrders) --- */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
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
                <p className="text-sm"><strong>Order Date:</strong> {formatDate(currentOrderForDelivery.date)}</p>
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
                {deliveryItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg bg-gray-50">
                    <div className="col-span-7">
                      <p className="text-sm font-semibold text-gray-800">{item.itemName}</p>
                      <p className="text-xs text-gray-500 italic">{item.distributor}</p>
                    </div>
                    <div className="col-span-2 text-xs text-center font-medium">
                      Ordered: {item.quantity} <br />
                      <span className="text-gray-500">Left: {item.remainingQuantity}</span>
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-gray-400 block mb-0.5">Picked Qty</label>
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={item.pickedQuantity}
                        onChange={(e) => handleDeliveryQtyChange(index, e.target.value)}
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

      {/* History Modal */}
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

      {/* Delete and Edit Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this order?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={async () => { await handleDeleteOrder(orderToDelete); setShowDeleteModal(false); setOrderToDelete(null); }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {IsEditModal && editOrderData && editOrderData.items && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Edit Order</h2><button onClick={() => setIsEditModal(false)}><X /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input type="date" value={formatDateForInput(editOrderData.date)} onChange={(e) => setEditOrderData({ ...editOrderData, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#246e72]" />
              <input type="text" value={editOrderData?.phone || ""} onChange={(e) => setEditOrderData({ ...editOrderData, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#246e72]" />
              <input type="number" value={editOrderData?.advance || ""} onChange={(e) => setEditOrderData({ ...editOrderData, advance: e.target.value })} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#246e72]" />
            </div>
            <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
            {editOrderData?.items?.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
                <div className="md:col-span-4"><input type="text" value={item.itemName} onChange={(e) => handleEditItemChange(index, "itemName", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#246e72]" /></div>
                <div className="md:col-span-4">
                  <select value={item.distributor} onChange={(e) => handleEditItemChange(index, "distributor", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#246e72]">
                    <option value="">Select Distributor</option>
                    {distributors.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2"><input type="number" value={item.quantity} onChange={(e) => handleEditItemChange(index, "quantity", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#246e72]" /></div>
                <div className="md:col-span-2 flex items-center justify-center gap-2"><button onClick={handleAddEditItemRow} className="w-8 h-8 bg-[#246e72] text-white rounded-lg flex items-center justify-center">+</button>{editOrderData.items.length > 1 && <button onClick={() => handleRemoveEditItemRow(index)} className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center"><Trash2 size={14} /></button>}</div>
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-6"><button onClick={() => setIsEditModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">Cancel</button><button onClick={handleUpdateOrder} className="px-4 py-2 bg-[#246e72] text-white rounded-lg text-sm hover:bg-teal-800">Save Changes</button></div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
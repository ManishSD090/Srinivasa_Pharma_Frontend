import React, { useState } from 'react';
import { 
  CheckSquare, Package, ChevronRight, X, Menu, 
  Search, AlertCircle, Save, ArrowRight
} from 'lucide-react';
import StaffSidebar from './StaffSidebar'; // Import the component

const StaffInventory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // --- MOCK DATA: Orders with Partial Receipt Tracking ---
  // receivedQty: Total amount received in previous shipments
  const [orders, setOrders] = useState([
    { 
      id: 101, 
      distributor: 'MedSupply Co.', 
      date: '2024-01-20',
      status: 'Partial', // Partial, Pending, Completed
      items: [
        { id: 'i1', name: 'Paracetamol 500mg', orderedQty: 100, receivedQty: 50 }, // 50 Pending
        { id: 'i2', name: 'Cetirizine 10mg', orderedQty: 200, receivedQty: 200 }   // 0 Pending (Completed)
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
  
  // State to track what is being received *right now* in this session
  // format: { itemId: quantityReceivedNow }
  const [currentReceipts, setCurrentReceipts] = useState({});

  // --- HANDLERS ---

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setCurrentReceipts({}); // Reset current inputs when switching orders
  };

  const handleInputChange = (itemId, val, maxLimit) => {
    const numVal = parseInt(val) || 0;
    
    // Validation: Don't allow receiving more than what is pending
    if (numVal < 0) return;
    if (numVal > maxLimit) {
      alert(`Cannot receive more than pending amount (${maxLimit})`);
      return;
    }

    setCurrentReceipts(prev => ({
      ...prev,
      [itemId]: numVal
    }));
  };

  const handleSubmitReceipt = () => {
    if (!selectedOrder) return;

    // Update the main orders state
    const updatedOrders = orders.map(order => {
      if (order.id !== selectedOrder.id) return order;

      // Update items inside the order
      const updatedItems = order.items.map(item => {
        const receivedNow = currentReceipts[item.id] || 0;
        return {
          ...item,
          receivedQty: item.receivedQty + receivedNow
        };
      });

      // Check if order is fully complete
      const isFullyComplete = updatedItems.every(i => i.receivedQty >= i.orderedQty);
      const isPartiallyStarted = updatedItems.some(i => i.receivedQty > 0);

      return {
        ...order,
        items: updatedItems,
        status: isFullyComplete ? 'Completed' : (isPartiallyStarted ? 'Partial' : 'Pending')
      };
    });

    setOrders(updatedOrders);
    setSelectedOrder(null); // Return to list view
    setCurrentReceipts({});
    alert("Inventory updated successfully!");
  };

  // Helper to calculate status color
  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      
      {/* Replaced Manual Sidebar with Component */}
      <StaffSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-white">Receive Items</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">SJ</div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* LEFT COLUMN: Pending Orders List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
              <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <Package className="mr-2 text-[#246e72]" size={20} />
                  Pending Deliveries
                </h3>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {orders.filter(o => o.status !== 'Completed').length === 0 && (
                   <p className="text-center text-gray-500 mt-10">No pending orders.</p>
                )}

                {orders.filter(o => o.status !== 'Completed').map(order => (
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
                    <p className="text-xs text-gray-500">Date: {order.date}</p>
                    <div className="mt-3 flex items-center text-[#246e72] text-sm font-medium">
                      Check Items <ArrowRight size={14} className="ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Checklist Area */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
              {!selectedOrder ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                  <CheckSquare size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">Select an order from the list to start checking items.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Checklist: Order #{selectedOrder.id}</h3>
                      <p className="text-sm text-gray-500">{selectedOrder.distributor}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start">
                      <AlertCircle className="text-yellow-600 mt-0.5 mr-2" size={18} />
                      <p className="text-sm text-yellow-700">
                        Enter the quantity received <strong>today</strong> in the input box. The pending amount will update automatically.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-100">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 w-1/3">ITEM NAME</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">ORDERED</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">PREV. REC.</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-[#246e72]">RECEIVED NOW</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">PENDING</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map(item => {
                            const receivedBefore = item.receivedQty;
                            const receivedNow = currentReceipts[item.id] || 0;
                            const totalReceived = receivedBefore + receivedNow;
                            const pending = item.orderedQty - totalReceived;
                            const isComplete = totalReceived >= item.orderedQty;

                            return (
                              <tr key={item.id} className={`border-b border-gray-50 ${isComplete ? 'bg-green-50/50' : ''}`}>
                                <td className="py-4 px-2">
                                  <p className="font-medium text-gray-800">{item.name}</p>
                                </td>
                                <td className="py-4 px-2 text-center text-gray-600">{item.orderedQty}</td>
                                <td className="py-4 px-2 text-center text-gray-600">{receivedBefore}</td>
                                <td className="py-4 px-2 text-center">
                                  {!isComplete || receivedBefore < item.orderedQty ? (
                                    <input
                                      type="number"
                                      min="0"
                                      max={item.orderedQty - receivedBefore}
                                      value={currentReceipts[item.id] || ''}
                                      onChange={(e) => handleInputChange(item.id, e.target.value, item.orderedQty - receivedBefore)}
                                      placeholder="0"
                                      className="w-20 px-2 py-1 border-2 border-teal-100 rounded focus:border-[#246e72] focus:ring-0 outline-none text-center font-bold text-[#246e72]"
                                    />
                                  ) : (
                                    <span className="text-green-600 font-bold text-xs">Full</span>
                                  )}
                                </td>
                                <td className="py-4 px-2 text-center">
                                  <span className={`font-bold ${pending > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {pending}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
                    <button 
                      onClick={handleSubmitReceipt}
                      className="flex items-center space-x-2 bg-[#246e72] text-white px-6 py-3 rounded-lg hover:bg-[#1a5256] transition-colors font-medium shadow-sm"
                    >
                      <Save size={18} />
                      <span>Update Inventory & Status</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffInventory;
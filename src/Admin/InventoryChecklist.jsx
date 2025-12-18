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
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Partial') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(o => 
    activeTab === 'pending' ? o.status !== 'Completed' : o.status === 'Completed'
  );

  return (
    <div className="flex h-screen bg-[#D2EAF4]">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-auto flex flex-col">
        <header className="bg-[#21696d] shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
              <h2 className="text-2xl font-bold text-white">Inventory Checklist</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#D2EAF4] rounded-full flex items-center justify-center text-[#246e72] font-semibold">DA</div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* LEFT COLUMN: Toggled List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
              <div className="flex border-b border-gray-100">
                <button 
                  onClick={() => { setActiveTab('pending'); setSelectedOrder(null); }}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tl-xl ${activeTab === 'pending' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Package className="mr-2" size={18} /> Pending
                </button>
                <button 
                  onClick={() => { setActiveTab('past'); setSelectedOrder(null); }}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors rounded-tr-xl ${activeTab === 'past' ? 'bg-white text-[#246e72] border-b-2 border-[#246e72]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <History className="mr-2" size={18} /> Past
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-3">
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
              </div>
            </div>

            {/* RIGHT COLUMN: Checklist or Summary Area */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-140px)]">
              {!selectedOrder ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                  <CheckSquare size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">Select an order from the {activeTab} list to view details.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {selectedOrder.status === 'Completed' ? 'Delivery Summary' : 'Checklist'}: Order #{selectedOrder.id}
                      </h3>
                      <p className="text-sm text-gray-500">{selectedOrder.distributor}</p>
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
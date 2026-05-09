import React from 'react';
import { X, Clock, User, Calendar, Activity } from 'lucide-react';

const TaskHistoryModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  // Sort history by date descending (newest first)
  const sortedHistory = [...(task.history || [])].sort((a, b) => 
    new Date(b.modifiedAt) - new Date(a.modifiedAt)
  );

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="text-[#246e72]" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Task History Timeline</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-100">
          <p className="text-sm font-semibold text-[#246e72] mb-1">Current Task</p>
          <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Activity size={48} className="mx-auto mb-4 opacity-20" />
              <p>No history records found for this task.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-teal-100 ml-3 pl-8 space-y-8 py-2">
              {sortedHistory.map((entry, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[41px] top-0 w-6 h-6 bg-white border-2 border-[#246e72] rounded-full flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-[#246e72] rounded-full" />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-teal-200 transition-colors shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-teal-100 text-[#246e72] text-xs font-bold rounded-full uppercase tracking-wider">
                        {entry.action}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(entry.modifiedAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {entry.previousValue && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Previous</p>
                          <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100 line-through decoration-red-300">
                            {entry.previousValue}
                          </p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{entry.previousValue ? 'New' : 'Value'}</p>
                        <p className="text-sm text-gray-800 bg-white p-2 rounded border border-teal-100 font-medium">
                          {entry.newValue}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-500">
                      <User size={12} className="mr-1" />
                      Modified by: <span className="font-semibold ml-1 text-gray-700">{entry.modifiedBy?.name || 'System'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryModal;

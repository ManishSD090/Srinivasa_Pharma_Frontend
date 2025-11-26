import React from 'react'
import { Routes, Route } from 'react-router-dom'
import StaffDashboard from './StaffDashboard'
import StaffAttendance from './StaffAttendance'
import StaffTask from './StaffTask'
import StaffLeaves from './StaffLeaves'
import StaffOrders from './StaffOrders'
import StaffInventory from './StaffInventory'

const Staff = () => {
  return (
    <Routes>
        <Route path="/dashboard" element={<StaffDashboard />} />
        <Route path="/orders" element={<StaffOrders />} />
        <Route path="/attendance" element={<StaffAttendance />} />
        <Route path="/tasks" element={<StaffTask />} />
        <Route path="/leaves" element={<StaffLeaves />} />
        <Route path="/inventory" element={<StaffInventory />} />
    </Routes>
  )
}

export default Staff

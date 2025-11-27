import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Login/Login'
import Admin from './Admin/Admin'
import Staff from './Staff/Staff'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/staff/*" element={<Staff />} />
      </Routes>
    </Router>
  )
}

export default App

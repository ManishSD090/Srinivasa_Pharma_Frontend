import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Login/Login'
import Admin from './Admin/Admin'
import Staff from './Staff/Staff'
import { AuthProvider } from './authContext'
import OAuthSuccess from './Login/OAuthSuccess'
const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/staff/*" element={<Staff />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App

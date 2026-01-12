import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Login/Login'
import Admin from './Admin/Admin'
import Staff from './Staff/Staff'
<<<<<<< HEAD
import { AuthProvider } from './authContext'
import OAuthSuccess from './Login/OAuthSuccess'
const App = () => {
  return (
    <AuthProvider>
=======

const App = () => {
  return (
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/staff/*" element={<Staff />} />
<<<<<<< HEAD
        <Route path="/oauth-success" element={<OAuthSuccess />} />

      </Routes>
    </Router>
    </AuthProvider>
=======
      </Routes>
    </Router>
>>>>>>> 3b6d491de2fbd85b00f5178fea7bd60b19a8d31f
  )
}

export default App

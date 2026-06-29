import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/home'
import Contact from './pages/contact'
import AgentLogin from './pages/agentLogin'
import AgentDashboard from './pages/agentDashboard'
import AllProperties from './pages/PropertiesPage'
import SingleProperty from './pages/singlePage'
import AdminDashboard from './pages/adminDashboard'
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AgentProtectedRoute from "./components/AgentProtectedRoutes";
import AdminLogin from './pages/adminLogin'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/agent/login" element={<AgentLogin />} />
        <Route path="/agent/dashboard" element={
          <AgentProtectedRoute>
            <AgentDashboard />
          </AgentProtectedRoute>
        } />
        <Route path="/allProperties" element={<AllProperties />} />
        <Route path="/property/:id" element={<SingleProperty />} />
        <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
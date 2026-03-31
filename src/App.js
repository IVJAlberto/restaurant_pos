import React from 'react';
import { Routes, Route } from "react-router-dom";

import FoodPage from './pages/FoodPage';
import DateTimePicker from './pages/Bills';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import ListOfOrders from './pages/ListOfOrders';
import TeamPage from './pages/TeamPage';
import CocinaPage from './pages/CocinaPage';

import { AuthProvider } from './app/helpers/AuthContext';
import { ProtectedRoute } from './app/helpers/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="bills" element={<DateTimePicker />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          <Route path="food_catalog" element={<FoodPage />} />
          <Route path="cocina" element={<CocinaPage />} />
          <Route path="dashboard/orders" element={<ListOfOrders />} />
          <Route path="team" element={<TeamPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
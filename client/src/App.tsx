import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './pages/Dashboard';
import PartnersPage from './pages/PartnersPage';
import OrdersPage from './pages/OrdersPage';
import AssignmentsPage from './pages/AssignmentsPage';
import PartnerForm from './pages/PartnerForm';
import PartnerOrdersPage from './pages/PartnerOrdersPage';
import OrderForm from './pages/OrderForm';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/partners/new" element={<PartnerForm />} />
        <Route path="/partners/:id/edit" element={<PartnerForm />} />
        <Route path="/partners/:id/orders" element={<PartnerOrdersPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<OrderForm />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
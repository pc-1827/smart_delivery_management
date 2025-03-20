import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PartnersPage from './pages/PartnersPage';
import OrdersPage from './pages/OrdersPage';
import AssignmentsPage from './pages/AssignmentsPage';
import PartnerForm from './pages/PartnerForm';
import PartnerAssignmentsPage from './pages/PartnerAssignmentsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/partners/new" element={<PartnerForm />} />
        <Route path="/partners/:id/edit" element={<PartnerForm />} />
        <Route path="/partners/:id/assignments" element={<PartnerAssignmentsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliveryPartner } from '../types';

const PartnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [totalActive, setTotalActive] = useState(0);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      const data = await response.json();
      setPartners(data);
      setTotalActive(data.filter((p: DeliveryPartner) => p.status === 'active').length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateClick = () => {
    navigate('/partners/new');
  };

  const calcAvgRating = (partner: DeliveryPartner) => {
    const { completedOrders, cancelledOrders } = partner.metrics;
    const totalAssigned = completedOrders + cancelledOrders;
    if (totalAssigned === 0) return 0;
    return (completedOrders / totalAssigned).toFixed(2);
  };

  return (
    <div className="container">
      <h1>Partners</h1>
      <p>Total Active Partners: {totalActive}</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={handleCreateClick}>Create New Partner</button>
      </div>
      <div className="card">
        <h2>Partner List</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {partners.map((partner) => (
            <div
              key={partner._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                width: '250px'
              }}
            >
              <h3>{partner.name}</h3>
              <p>Status: {partner.status}</p>
              <p>Current Load: {partner.currentLoad}</p>
              <p>Avg Rating: {calcAvgRating(partner)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button onClick={() => navigate(`/partners/${partner._id}/edit`)}>Update Profile</button>
                <button onClick={() => navigate(`/partners/${partner._id}/orders`)}>View Orders</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<{ [key: string]: number }>({});
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);

  useEffect(() => {
    fetchMetrics();
    fetchRecentAssignments();
  }, []);

  const fetchMetrics = async () => {
    // Example: you might have an endpoint like /api/metrics
    // For demonstration, set placeholders:
    setMetrics({ totalDelivered: 20, totalPending: 5, totalPartners: 10 });
  };

  const fetchRecentAssignments = async () => {
    // Example: /api/assignments?limit=5
    setRecentAssignments([
      { orderId: 'ABC123', partner: 'John Doe', status: 'success' },
      { orderId: 'XYZ789', partner: 'Jane Smith', status: 'failed' }
    ]);
  };

  return (
    <>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ background: '#eee', padding: '1rem' }}>
          <h2>Key Metrics</h2>
          <p>Total Delivered: {metrics.totalDelivered}</p>
          <p>Total Pending: {metrics.totalPending}</p>
          <p>Total Partners: {metrics.totalPartners}</p>
        </div>
        <div style={{ background: '#eee', padding: '1rem' }}>
          <h2>Recent Assignments</h2>
          <ul>
            {recentAssignments.map((a, idx) => (
              <li key={idx}>
                Order: {a.orderId}, Partner: {a.partner}, Status: {a.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
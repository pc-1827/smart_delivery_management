import React, { useEffect, useState } from 'react';
import { Assignment, AssignmentMetrics } from '../types';

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
  const [partnersStatus, setPartnersStatus] = useState<{ available: number; busy: number; offline: number }>({
    available: 0,
    busy: 0,
    offline: 0
  });

  useEffect(() => {
    fetchAssignments();
    fetchMetrics();
    fetchPartnerAvailability();
  }, []);

  const fetchAssignments = async () => {
    // Suppose GET /api/assignments
    const response = await fetch('/api/assignments');
    const data = await response.json();
    setAssignments(data);
  };

  const fetchMetrics = async () => {
    // Suppose GET /api/assignments/metrics
    const response = await fetch('/api/assignments/metrics');
    const data = await response.json();
    setMetrics(data);
  };

  const fetchPartnerAvailability = async () => {
    // Example custom route or calculation
    // Hardcoding a sample set for demonstration
    setPartnersStatus({ available: 3, busy: 2, offline: 1 });
  };

  return (
    <>
      <h1>Assignment Dashboard</h1>
      <div style={{ marginBottom: '1rem' }}>
        <h2>Partner Availability</h2>
        <p>Available: {partnersStatus.available}</p>
        <p>Busy: {partnersStatus.busy}</p>
        <p>Offline: {partnersStatus.offline}</p>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h2>Assignment Metrics</h2>
        {metrics && (
          <>
            <p>Total Assigned: {metrics.totalAssigned}</p>
            <p>Success Rate: {metrics.successRate}%</p>
            <p>Average Time: {metrics.averageTime} mins</p>
            <p>Failure Reasons:</p>
            <ul>
              {metrics.failureReasons.map((fr, index) => (
                <li key={index}>
                  {fr.reason} – {fr.count}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <h2>Active Assignments</h2>
      <ul>
        {assignments.map((a, i) => (
          <li key={i}>
            Order: {a.orderId}, Partner: {a.partnerId}, Status: {a.status}, Time: {a.timestamp}
          </li>
        ))}
      </ul>
    </>
  );
};

export default AssignmentsPage;
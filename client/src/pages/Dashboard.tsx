import React, { useEffect, useState } from "react";
import { Assignment } from "../types";

const Dashboard: React.FC = () => {
  const [partnerStats, setPartnerStats] = useState({
    available: 0,
    busy: 0,
    offline: 0,
  });
  const [metrics, setMetrics] = useState<{
    totalAssignments: number;
    successRate: number;
  } | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    fetchPartnerAvailability();
    fetchAssignmentMetrics();
    fetchRecentAssignments();
  }, []);

  const fetchPartnerAvailability = async () => {
    const response = await fetch("/api/partners");
    const allPartners = await response.json();
    const available = allPartners.filter(
      (p: any) => p.currentLoad < 3 && p.status === "active"
    ).length;
    const busy = allPartners.filter(
      (p: any) => p.currentLoad >= 3 && p.status === "active"
    ).length;
    const offline = allPartners.filter(
      (p: any) => p.status === "inactive"
    ).length;
    setPartnerStats({ available, busy, offline });
  };

  const fetchAssignmentMetrics = async () => {
    const response = await fetch("/api/assignments/metrics");
    const data = await response.json();
    setMetrics(data);
  };

  const fetchRecentAssignments = async () => {
    const response = await fetch("/api/assignments?limit=5&sort=-createdAt");
    const data = await response.json();
    setRecentAssignments(data);
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <div className="card" style={{ flex: "1 1 250px" }}>
          <h2>Partner Availability</h2>
          <p>Available: {partnerStats.available}</p>
          <p>Busy: {partnerStats.busy}</p>
          <p>Offline: {partnerStats.offline}</p>
        </div>
        <div className="card" style={{ flex: "1 1 250px" }}>
          <h2>Assignment Metrics</h2>
          {metrics && (
            <>
              <p>Total Assignments: {metrics.totalAssignments}</p>
              <p>Success Rate: {metrics.successRate.toFixed(1)}%</p>
            </>
          )}
        </div>
        <div className="card" style={{ flex: "1 1 250px" }}>
          <h2>Recent Assignments</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recentAssignments.map((a, idx) => (
              <li key={idx} style={{ marginBottom: "0.5rem" }}>
                Order: {a.orderId}, Partner: {a.partnerId}, Status: {a.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

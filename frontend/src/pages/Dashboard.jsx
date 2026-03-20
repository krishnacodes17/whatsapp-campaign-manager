import React, { useEffect, useState } from 'react';
import { getCampaigns, getInvitationStats } from '../api';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCampaigns(), getInvitationStats()])
      .then(([campRes, statsRes]) => {
        setCampaigns(campRes.data);
        setStats(statsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Overview of your WhatsApp campaigns</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Campaigns</div>
          <div className="stat-value">{totalCampaigns}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Campaigns</div>
          <div className="stat-value">{activeCampaigns}</div>
        </div>
        {stats && (
          <>
            <div className="stat-card">
              <div className="stat-label">Total Invitations</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Sent</div>
              <div className="stat-value">{stats.sent}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Accepted</div>
              <div className="stat-value">{stats.accepted}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2>Recent Campaigns</h2>
        {campaigns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📢</div>
            <p>No campaigns yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Target</th>
                  <th>Sent</th>
                  <th>Accepted</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 5).map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                    </td>
                    <td>{c.targetCount}</td>
                    <td>{c.sentCount}</td>
                    <td>{c.acceptedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

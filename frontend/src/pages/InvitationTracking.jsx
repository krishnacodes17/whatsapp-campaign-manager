import React, { useEffect, useState } from 'react';
import { getAllInvitations, getInvitationStats, updateInvitationStatus, getCampaigns } from '../api';

const STATUSES = ['pending', 'sent', 'accepted', 'declined', 'failed'];

export default function InvitationTracking() {
  const [invitations, setInvitations] = useState([]);
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState({ status: '', campaign: '' });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.campaign) params.campaign = filter.campaign;

      const [invRes, statsRes, campRes] = await Promise.all([
        getAllInvitations(params),
        getInvitationStats(),
        getCampaigns(),
      ]);
      setInvitations(invRes.data);
      setStats(statsRes.data);
      setCampaigns(campRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [filter]);

  const handleStatusChange = async (invId, newStatus) => {
    try {
      await updateInvitationStatus(invId, newStatus);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Invitation Tracking</h1>
          <p className="subtitle">Monitor the status of all WhatsApp group invitations</p>
        </div>
      </div>

      {stats && (
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total', value: stats.total },
            { label: 'Pending', value: stats.pending },
            { label: 'Sent', value: stats.sent },
            { label: 'Accepted', value: stats.accepted },
            { label: 'Declined', value: stats.declined },
            { label: 'Failed', value: stats.failed },
          ].map(({ label, value }) => (
            <div className="stat-card" key={label}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 160 }}>
            <select
              className="status-select"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 200 }}>
            <select
              className="status-select"
              value={filter.campaign}
              onChange={(e) => setFilter({ ...filter, campaign: e.target.value })}
            >
              <option value="">All campaigns</option>
              {campaigns.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setFilter({ status: '', campaign: '' })}
          >
            Clear filters
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading…</div>
        ) : invitations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✉️</div>
            <p>No invitations found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Sent At</th>
                  <th>Responded At</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.contact?.name || '—'}</td>
                    <td>{inv.contact?.phone || '—'}</td>
                    <td>{inv.campaign?.name || '—'}</td>
                    <td>
                      <span className={`badge badge-${inv.status}`}>{inv.status}</span>
                    </td>
                    <td style={{ fontSize: '.82rem', color: '#888' }}>
                      {inv.sentAt ? new Date(inv.sentAt).toLocaleString() : '—'}
                    </td>
                    <td style={{ fontSize: '.82rem', color: '#888' }}>
                      {inv.respondedAt ? new Date(inv.respondedAt).toLocaleString() : '—'}
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
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

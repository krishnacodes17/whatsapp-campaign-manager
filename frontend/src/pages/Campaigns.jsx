import React, { useEffect, useState } from 'react';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../api';

const EMPTY_FORM = {
  name: '',
  description: '',
  groupLink: '',
  status: 'draft',
};

function CampaignModal({ campaign, onClose, onSave }) {
  const [form, setForm] = useState(campaign ? { ...campaign } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Campaign name is required.');
      return;
    }
    setSaving(true);
    try {
      if (campaign) {
        await updateCampaign(campaign._id, form);
      } else {
        await createCampaign(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{campaign ? 'Edit Campaign' : 'New Campaign'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Campaign Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Summer Sale 2024"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the campaign"
            />
          </div>
          <div className="form-group">
            <label>WhatsApp Group Link</label>
            <input
              value={form.groupLink}
              onChange={(e) => setForm({ ...form, groupLink: e.target.value })}
              placeholder="https://chat.whatsapp.com/…"
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Campaigns</h1>
          <p className="subtitle">Manage your WhatsApp group campaigns</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          + New Campaign
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading…</div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📢</div>
            <p>No campaigns yet. Click "New Campaign" to get started.</p>
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
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong>{c.name}</strong>
                      {c.description && (
                        <div style={{ fontSize: '.8rem', color: '#888' }}>{c.description}</div>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                    </td>
                    <td>{c.targetCount}</td>
                    <td>{c.sentCount}</td>
                    <td>{c.acceptedCount}</td>
                    <td style={{ fontSize: '.82rem', color: '#888' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginRight: 8 }}
                        onClick={() => { setEditing(c); setModalOpen(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(c)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <CampaignModal
          campaign={editing}
          onClose={() => setModalOpen(false)}
          onSave={() => { setModalOpen(false); load(); }}
        />
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Campaign</h2>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteTarget._id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

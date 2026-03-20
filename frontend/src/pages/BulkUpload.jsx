import React, { useEffect, useRef, useState } from 'react';
import { getCampaigns, getContactsByCampaign, bulkUploadContacts } from '../api';

export default function BulkUpload() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [contacts, setContacts] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [alert, setAlert] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    getCampaigns()
      .then((res) => setCampaigns(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCampaign) { setContacts([]); return; }
    setLoadingContacts(true);
    getContactsByCampaign(selectedCampaign)
      .then((res) => setContacts(res.data))
      .catch(console.error)
      .finally(() => setLoadingContacts(false));
  }, [selectedCampaign]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!selectedCampaign) {
      setAlert({ type: 'error', msg: 'Please select a campaign first.' });
      return;
    }
    if (!file) {
      setAlert({ type: 'error', msg: 'Please select a CSV file.' });
      return;
    }
    setUploading(true);
    setAlert(null);
    try {
      const res = await bulkUploadContacts(selectedCampaign, file);
      setAlert({ type: 'success', msg: `Successfully imported ${res.data.imported} contacts!` });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      // Refresh contacts list
      const updated = await getContactsByCampaign(selectedCampaign);
      setContacts(updated.data);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Bulk Upload</h1>
          <p className="subtitle">Import members via CSV and assign them to a campaign</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Upload CSV</h2>

        <div className="form-group">
          <label>Select Campaign *</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            <option value="">— Choose a campaign —</option>
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>
            {alert.msg}
          </div>
        )}

        <div
          className="upload-zone"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <div className="upload-icon">📁</div>
          {file ? (
            <p>
              <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
            </p>
          ) : (
            <p>Drag &amp; drop a CSV file here, or click to browse</p>
          )}
          <p className="upload-hint">
            Required column: <code>phone</code>. Optional: <code>name</code>, <code>email</code>
          </p>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading || !file || !selectedCampaign}
          >
            {uploading ? 'Uploading…' : '⬆ Upload Contacts'}
          </button>
          {file && (
            <button
              className="btn btn-outline"
              onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ marginTop: 16, color: '#888', fontSize: '.83rem' }}>
          <strong>CSV format example:</strong><br />
          <code>name,phone,email</code><br />
          <code>Alice,+1234567890,alice@example.com</code>
        </div>
      </div>

      {selectedCampaign && (
        <div className="card">
          <h2>
            Contacts for selected campaign{' '}
            <span style={{ fontWeight: 400, color: '#888' }}>({contacts.length})</span>
          </h2>
          {loadingContacts ? (
            <div className="loading">Loading contacts…</div>
          ) : contacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>No contacts uploaded yet for this campaign.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr key={c._id}>
                      <td style={{ color: '#888' }}>{i + 1}</td>
                      <td>{c.name || '—'}</td>
                      <td>{c.phone}</td>
                      <td>{c.email || '—'}</td>
                      <td style={{ fontSize: '.82rem', color: '#888' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

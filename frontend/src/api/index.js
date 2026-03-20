import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// ── Campaigns ────────────────────────────────────────────────────────────────
export const getCampaigns = () => api.get('/campaigns');
export const getCampaign = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (data) => api.post('/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);

// ── Contacts (bulk upload) ────────────────────────────────────────────────────
export const getContactsByCampaign = (campaignId) =>
  api.get(`/campaigns/${campaignId}/contacts`);

export const bulkUploadContacts = (campaignId, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/campaigns/${campaignId}/contacts/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// ── Invitations ───────────────────────────────────────────────────────────────
export const getAllInvitations = (params) => api.get('/invitations', { params });
export const getInvitationStats = () => api.get('/invitations/stats');
export const updateInvitationStatus = (id, status) =>
  api.patch(`/invitations/${id}`, { status });

export default api;

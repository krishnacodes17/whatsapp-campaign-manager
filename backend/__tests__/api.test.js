/**
 * Unit tests for campaign, contact, and invitation API routes.
 * Uses an in-memory mock instead of a real MongoDB connection.
 */

const request = require('supertest');

// ── Mock mongoose before any app module is loaded ──────────────────────────
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(true),
    connection: { readyState: 1 },
  };
});

// ── Mock models ─────────────────────────────────────────────────────────────
const mockCampaignData = {
  _id: 'camp1',
  name: 'Test Campaign',
  description: 'desc',
  groupLink: 'https://chat.whatsapp.com/test',
  status: 'draft',
  targetCount: 0,
  sentCount: 0,
  acceptedCount: 0,
};

const mockContactData = {
  _id: 'cont1',
  name: 'Alice',
  phone: '+1234567890',
  email: 'alice@example.com',
  campaign: 'camp1',
};

const mockInvitationData = {
  _id: 'inv1',
  campaign: 'camp1',
  contact: 'cont1',
  status: 'pending',
  sentAt: null,
  respondedAt: null,
};

// Campaign model mock
jest.mock('../models/Campaign', () => {
  const mockSave = jest.fn().mockResolvedValue(mockCampaignData);
  function MockCampaign(data) {
    Object.assign(this, data);
    this.save = mockSave;
  }
  MockCampaign.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockResolvedValue([mockCampaignData]),
  });
  MockCampaign.findById = jest.fn().mockResolvedValue(mockCampaignData);
  MockCampaign.findByIdAndUpdate = jest.fn().mockResolvedValue(mockCampaignData);
  MockCampaign.findByIdAndDelete = jest.fn().mockResolvedValue(mockCampaignData);
  return MockCampaign;
});

// Contact model mock
jest.mock('../models/Contact', () => {
  function MockContact(data) {
    Object.assign(this, data);
  }
  MockContact.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockResolvedValue([mockContactData]),
  });
  MockContact.insertMany = jest.fn().mockResolvedValue([mockContactData]);
  MockContact.findByIdAndDelete = jest.fn().mockResolvedValue(mockContactData);
  return MockContact;
});

// Invitation model mock
jest.mock('../models/Invitation', () => {
  // Chain: find().populate().populate().sort() → resolves to array
  const sortMock = jest.fn().mockResolvedValue([mockInvitationData]);
  const secondPopulate = jest.fn().mockReturnValue({ sort: sortMock });
  const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

  function MockInvitation(data) {
    Object.assign(this, data);
  }
  MockInvitation.find = jest.fn().mockReturnValue({ populate: firstPopulate });
  MockInvitation.insertMany = jest.fn().mockResolvedValue([mockInvitationData]);
  MockInvitation.countDocuments = jest.fn().mockResolvedValue(1);
  MockInvitation.findByIdAndUpdate = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue({ ...mockInvitationData, status: 'sent', campaign: 'camp1' }),
  });
  return MockInvitation;
});

// Load app after mocks are in place
const app = require('../server');

// ── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Campaigns API', () => {
  it('GET /api/campaigns returns list', async () => {
    const res = await request(app).get('/api/campaigns');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/campaigns/:id returns a campaign', async () => {
    const res = await request(app).get('/api/campaigns/camp1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Campaign');
  });

  it('POST /api/campaigns creates a campaign', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .send({ name: 'New Campaign', description: 'test', status: 'draft' });
    expect(res.status).toBe(201);
  });

  it('PUT /api/campaigns/:id updates a campaign', async () => {
    const res = await request(app)
      .put('/api/campaigns/camp1')
      .send({ name: 'Updated', status: 'active' });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/campaigns/:id deletes a campaign', async () => {
    const res = await request(app).delete('/api/campaigns/camp1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Campaign deleted');
  });
});

describe('Invitations API', () => {
  it('GET /api/invitations returns list', async () => {
    const res = await request(app).get('/api/invitations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/invitations/stats returns counts', async () => {
    const res = await request(app).get('/api/invitations/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('pending');
    expect(res.body).toHaveProperty('sent');
    expect(res.body).toHaveProperty('accepted');
  });

  it('PATCH /api/invitations/:id updates status to sent', async () => {
    const res = await request(app)
      .patch('/api/invitations/inv1')
      .send({ status: 'sent' });
    expect(res.status).toBe(200);
  });

  it('PATCH /api/invitations/:id rejects invalid status', async () => {
    const res = await request(app)
      .patch('/api/invitations/inv1')
      .send({ status: 'invalid' });
    expect(res.status).toBe(400);
  });
});

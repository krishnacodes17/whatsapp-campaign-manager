import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import BulkUpload from './pages/BulkUpload';
import InvitationTracking from './pages/InvitationTracking';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/upload" element={<BulkUpload />} />
            <Route path="/invitations" element={<InvitationTracking />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

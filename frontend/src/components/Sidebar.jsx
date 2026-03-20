import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', icon: '🏠', label: 'Dashboard', end: true },
  { to: '/campaigns', icon: '📢', label: 'Campaigns' },
  { to: '/upload', icon: '📤', label: 'Bulk Upload' },
  { to: '/invitations', icon: '✉️', label: 'Invitations' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="icon">💬</span>
        <span>WA Campaign Mgr</span>
      </div>
      <nav>
        {links.map(({ to, icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

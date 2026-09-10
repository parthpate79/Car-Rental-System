import React from 'react';
import { Button, Dropdown } from 'antd';
import { CarOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ChatWidget from './ChatWidget';
import ScrollToTop from './ScrollToTop';

export default function DefaultLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch { /* Guest view */ }
  const links = [{ path: '/', label: 'Explore cars' }, { path: '/list-your-car', label: 'Become a host' }];
  const accountLinks = user?.isAdmin
    ? [{ path: '/admin', label: 'Admin dashboard' }]
    : [{ path: '/userbookings', label: 'My bookings' }, { path: '/my-car-listings', label: 'My listings' }, { path: '/owner-earnings', label: 'My earnings' }];
  const logout = () => { localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/'); };
  const accountItems = [...accountLinks.map(item => ({ key: item.path, label: <Link to={item.path}>{item.label}</Link> })), { type: 'divider' }, { key: 'logout', label: 'Sign out', onClick: logout }];
  return <div className="application-layout">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="modern-header">
      <div className="site-container navbar-container">
        <Link to="/" className="brand-link" aria-label="DriveEase home"><div className="brand-icon"><CarOutlined /></div><div className="brand-text"><h2>DriveEase<span className="brand-dot">.</span></h2><span>More than a destination</span></div></Link>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {links.map(item => <Link key={item.path} to={item.path} className={`navigation-link ${location.pathname === item.path ? 'active' : ''}`}>{item.label}</Link>)}
          <a href="/#rental-guide" className="navigation-link">How it works</a>
        </nav>
        <div className="user-navigation">
          {user ? <Dropdown menu={{ items: accountItems }} trigger={['click']}><Button icon={<UserOutlined />}>{user.username}</Button></Dropdown> : <Link to="/login"><Button type="primary">Sign in ↗</Button></Link>}
          <Dropdown menu={{ items: links.map(item => ({ key: item.path, label: <Link to={item.path}>{item.label}</Link> })) }} trigger={['click']}><Button className="mobile-menu-button" aria-label="Open navigation" icon={<MenuOutlined />} /></Dropdown>
        </div>
      </div>
    </header>
    <main id="main-content" className="main-content"><div className="site-container">{children}</div></main>
    <footer className="modern-footer"><div className="site-container">
      <div className="footer-grid">
        <div><Link className="footer-brand" to="/"><CarOutlined /><h2>DriveEase.</h2></Link><p className="footer-description">A little freedom. A new route. Find your next rental and make the journey your own.</p></div>
        <div><h3>On the road</h3><Link to="/">Explore the fleet</Link><Link to="/userbookings">Manage bookings</Link><a href="/#rental-guide">Your rental guide</a></div>
        <div><h3>For car owners</h3><Link to="/list-your-car">List your car</Link><Link to="/my-car-listings">Track your listings</Link><Link to="/owner-earnings">View earnings</Link></div>
        <div><h3>Before you book</h3><p>Check your dates, review the hourly rate and service fee, then confirm your reservation.</p><a href="/#rental-faq">Questions? Start here ↗</a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} DriveEase</span><span>Built for the journey.</span><button className="footer-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div>
    </div></footer>
    <ScrollToTop /><ChatWidget />
  </div>;
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BookOpen, ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(10px)',
            borderBottom: 'var(--glass-border)',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h1 style={{ margin: 0, background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NeuroLearn</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/dashboard" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/topics" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={18} /> Topics
                    </Link>
                    <Link to="/shop" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={18} /> Shop
                    </Link>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,215,0,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(255,215,0,0.3)' }}>
                    <span style={{ color: 'gold', fontWeight: 'bold' }}>💰 {user.coins || 0}</span>
                </div>
                <span>Welcome, {user.username}</span>
                <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

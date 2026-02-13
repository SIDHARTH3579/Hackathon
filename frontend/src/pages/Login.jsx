import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await api.login(username, password);
            login(user);
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{
            position: 'fixed', // Break out of the container
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Animated Background Particles */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
                animation: 'pulse 10s infinite'
            }}></div>

            {/* Floating Shapes for more "whole page" feel */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #ff00cc, #333399)',
                filter: 'blur(100px)',
                opacity: 0.4,
                animation: 'float 8s infinite ease-in-out'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                filter: 'blur(80px)',
                opacity: 0.4,
                animation: 'float 10s infinite ease-in-out reverse'
            }}></div>

            {/* Login Card */}
            <div className="login-card" style={{
                position: 'relative',
                width: '90%',
                maxWidth: '420px',
                padding: '3rem',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                transform: 'translateY(0)',
                animation: 'slideUp 0.6s ease-out'
            }}>
                {/* Logo / Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        margin: '0 auto 1rem',
                        background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 25px rgba(0, 210, 255, 0.6)'
                    }}>
                        <span style={{ fontSize: '35px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🧠</span>
                    </div>
                    <h2 style={{
                        color: 'white',
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        margin: 0,
                        letterSpacing: '1px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        fontFamily: 'var(--font-pixel)' // Keeping the brand font for Title
                    }}>NeuroLearn</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem', fontSize: '1rem' }}>Level up your knowledge</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        color: '#fca5a5',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.95rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginBottom: '0.8rem', fontSize: '0.95rem', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3a7bd5';
                                e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                                e.target.style.boxShadow = '0 0 15px rgba(58, 123, 213, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginBottom: '0.8rem', fontSize: '0.95rem', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3a7bd5';
                                e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                                e.target.style.boxShadow = '0 0 15px rgba(58, 123, 213, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 15px rgba(58, 123, 213, 0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(58, 123, 213, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(58, 123, 213, 0.4)';
                        }}
                    >
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    Need an account? <Link to="/register" style={{ color: '#00d2ff', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }}>Create one here</Link>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 0.5; }
                }
                @keyframes float {
                    0% { transform: translate(0, 0); }
                    50% { transform: translate(20px, 20px); }
                    100% { transform: translate(0, 0); }
                }
            `}</style>
        </div>
    );
};

export default Login;

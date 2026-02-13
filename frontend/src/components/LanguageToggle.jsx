import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            style={{
                position: 'fixed',
                top: '90px', // Below the Navbar
                right: '2rem',
                zIndex: 1000,
                padding: '8px 16px',
                borderRadius: '25px',
                border: '2px solid rgba(255,255,255,0.2)',
                background: '#FF9933', // Saffron/Orange
                color: 'white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(255,153,51,0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Switch Language / भाषा बदलें"
        >
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
            {language === 'en' ? 'हिंदी' : 'English'}
        </button>
    );
};

export default LanguageToggle;

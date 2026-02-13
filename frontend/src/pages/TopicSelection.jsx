import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, ArrowRight } from 'lucide-react';

const TopicSelection = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubject, setActiveSubject] = useState(null);

    useEffect(() => {
        api.getTopics().then(data => {
            console.log("User:", user);
            const filtered = user?.gradeLevel
                ? data.filter(t => t.gradeLevels?.includes(Number(user.gradeLevel)))
                : data;
            setTopics(filtered);
            setLoading(false);
        });
    }, [user]);

    // Group topics by subject
    const subjects = topics.reduce((acc, topic) => {
        if (!acc[topic.subject]) acc[topic.subject] = [];
        acc[topic.subject].push(topic);
        return acc;
    }, {});

    const toggleSubject = (subject) => {
        if (activeSubject === subject) {
            setActiveSubject(null);
        } else {
            setActiveSubject(subject);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center' }}>{t('loadingTopics')}</div>;

    if (topics.length === 0) return (
        <div className="container" style={{ textAlign: 'center' }}>
            <h2>No topics found for Class {user?.gradeLevel}</h2>
            <p>Please check back later!</p>
        </div>
    );

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>Class {user?.gradeLevel} {t('subjects')}</h2>
            <div className="grid">
                {Object.keys(subjects).map(subject => (
                    <div key={subject} className="glass-panel" style={{
                        gridColumn: activeSubject === subject ? '1 / -1' : 'auto',
                        transition: 'all 0.3s ease'
                    }}>
                        <div
                            onClick={() => toggleSubject(subject)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                paddingBottom: activeSubject === subject ? '1rem' : '0',
                                borderBottom: activeSubject === subject ? '1px solid rgba(255,255,255,0.1)' : 'none'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{
                                    padding: '0.8rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: 'var(--accent)'
                                }}>
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{subject}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {subjects[subject].length} {t('chapters')}
                                    </p>
                                </div>
                            </div>
                            <div style={{
                                transform: activeSubject === subject ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s'
                            }}>
                                <ArrowRight size={20} />
                            </div>
                        </div>

                        {activeSubject === subject && (
                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', animation: 'fadeIn 0.3s' }}>
                                {subjects[subject].map(topic => (
                                    <div key={topic.id} style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem'
                                    }}>
                                        <h4 style={{ margin: 0 }}>{topic.name}</h4>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <Link to={`/quiz/${topic.id}`} className="btn" style={{
                                                fontSize: '0.8rem',
                                                padding: '0.5rem',
                                                flex: 1,
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                            }}>
                                                Practice
                                            </Link>
                                            <Link to={`/quiz/${topic.id}?mode=battle`} className="btn" style={{
                                                fontSize: '0.8rem',
                                                padding: '0.5rem',
                                                flex: 1,
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                background: 'linear-gradient(45deg, #ef4444, #f59e0b)',
                                                border: 'none'
                                            }}>
                                                Battle ⚔️
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default TopicSelection;

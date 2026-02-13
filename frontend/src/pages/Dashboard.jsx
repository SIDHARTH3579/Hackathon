import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BarChart, Activity, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null);

    useEffect(() => {
        if (user) {
            Promise.all([
                api.getStudent(user.id),
                api.getTopics()
            ]).then(([student, topicsData]) => {
                setStudentData(student);
                // Filter topics by user's grade level
                const filtered = user.gradeLevel
                    ? topicsData.filter(t => t.gradeLevels?.includes(Number(user.gradeLevel)))
                    : topicsData;
                setTopics(filtered);
                setLoading(false);
            }).catch(err => {
                console.error("Failed to load dashboard data", err);
                setLoading(false);
            });
        }
    }, [user]);

    if (loading) return <div className="container">{t('loading')}</div>;

    // Calculate stats
    const masteryScores = studentData?.masteryScores || {};
    const attempts = studentData?.attempts || [];
    const recentActivity = [...attempts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

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

    const AVATARS = {
        'default': '😐',
        'nerd': '🤓',
        'robot': '🤖',
        'alien': '👽',
        'wizard': '🧙‍♂️',
        'ninja': '🥷',
        'king': '👑',
        'astronaut': '👨‍🚀'
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    fontSize: '3rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px solid var(--primary)'
                }}>
                    {AVATARS[studentData?.equippedAvatar || 'default']}
                </div>
                <h2 style={{ margin: 0 }}>{t('welcome')}, {studentData?.username}!</h2>
            </div>

            <div className="grid">
                {/* Mastery Overview Grouped by Subject */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                        <Star size={24} />
                        <h3>{t('progressTitle')}</h3>
                    </div>

                    {Object.keys(subjects).map(subject => {
                        const subjectTopics = subjects[subject];
                        const totalTopics = subjectTopics.length;
                        const masteredCount = subjectTopics.filter(t => (masteryScores[t.id] || 0) >= 80).length;
                        const avgScore = subjectTopics.reduce((sum, t) => sum + (masteryScores[t.id] || 0), 0) / (totalTopics || 1);

                        return (
                            <div key={subject} className="glass-panel">
                                <div
                                    onClick={() => toggleSubject(subject)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{subject}</h4>
                                            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{Math.round(avgScore)}% {t('avgScore')}</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                            <div style={{
                                                height: '100%',
                                                background: 'var(--primary)',
                                                width: `${avgScore}%`,
                                                borderRadius: '4px',
                                                transition: 'width 0.5s'
                                            }}></div>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: '1rem', transform: activeSubject === subject ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>

                                {activeSubject === subject && (
                                    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem', animation: 'fadeIn 0.3s' }}>
                                        {subjectTopics.map(topic => {
                                            const score = masteryScores[topic.id] || 0;
                                            return (
                                                <div key={topic.id} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                                        <span>{topic.name}</span>
                                                        <span style={{ color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}>{Math.round(score)}%</span>
                                                    </div>
                                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                                        <div style={{
                                                            height: '100%',
                                                            background: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
                                                            width: `${score}%`,
                                                            borderRadius: '3px'
                                                        }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Quick Stats & Recent Activity Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Quick Stats */}
                    <div className="glass-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                            <Activity size={24} />
                            <h3>{t('quickStats')}</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)' }}>
                                <span>{t('totalQuizzes')}</span>
                                <span style={{ fontWeight: 'bold' }}>{attempts.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)' }}>
                                <span>{t('masteredTopics')}</span>
                                <span style={{ fontWeight: 'bold' }}>
                                    {Object.values(masteryScores).filter(s => s >= 80).length}
                                </span>
                            </div>
                            <Link to="/topics" className="btn" style={{ textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>
                                {t('startQuizBtn')}
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#38bdf8' }}>
                            <Clock size={24} />
                            <h3>{t('recentActivity')}</h3>
                        </div>
                        {recentActivity.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>{t('noActivity')}</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {recentActivity.map(attempt => {
                                    const topic = topics.find(t => t.id === attempt.topicId);
                                    return (
                                        <div key={attempt.id} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>{topic?.name || 'Unknown Topic'}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                                <span>{new Date(attempt.timestamp).toLocaleDateString()}</span>
                                                <span style={{ color: attempt.score >= 50 ? '#10b981' : '#ef4444' }}>{Math.round(attempt.score)}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

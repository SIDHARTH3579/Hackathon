import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sword, Shield, Zap, User } from 'lucide-react';
import { api } from '../services/api';

const BattleMode = ({ topicId, questions, onComplete }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [userProgress, setUserProgress] = useState(0); // 0 to 100
    const [opponentProgress, setOpponentProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isAnswered, setIsAnswered] = useState(false);
    const [result, setResult] = useState(null);
    const [statusEffect, setStatusEffect] = useState(null);

    // Opponent Logic (Simulated)
    useEffect(() => {
        if (result || isAnswered) return;

        // Opponent answers randomly between 4-10 seconds
        const opponentTime = 4000 + Math.random() * 6000;
        const timer = setTimeout(() => {
            const isCorrect = Math.random() > 0.3; // 70% chance to be correct
            if (isCorrect) setOpponentScore(prev => prev + 1);

            setOpponentProgress(((currentIndex + 1) / questions.length) * 100);

            // If opponent finishes or we move on
            if (currentIndex < questions.length - 1) {
                // Opponent moves conceptually but stays on sync with us for simplicity
            }
        }, opponentTime);

        return () => clearTimeout(timer);
    }, [currentIndex, isAnswered, result]);

    // User Timer
    useEffect(() => {
        if (isAnswered || result) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAnswer(null, false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, isAnswered, result]);

    const handleAnswer = (optionIdx, isCorrect) => {
        if (isAnswered) return;
        setIsAnswered(true);

        if (isCorrect) {
            setUserScore(prev => prev + 1);
            setStatusEffect("CRITICAL HIT! 💥");
        } else {
            setStatusEffect("MISSED! 💨");
        }

        setUserProgress(((currentIndex + 1) / questions.length) * 100);

        setTimeout(() => {
            setStatusEffect(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setTimeLeft(15);
                setIsAnswered(false);
            } else {
                setResult(userScore >= opponentScore ? 'WIN' : 'LOSS');
            }
        }, 1500);
    };

    if (result) {
        return (
            <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <div className="glass-panel" style={{ padding: '3rem', border: result === 'WIN' ? '4px solid gold' : '4px solid red' }}>
                    <h1 style={{ fontSize: '4rem', color: result === 'WIN' ? 'gold' : 'red' }}>{result === 'WIN' ? 'VICTORY' : 'DEFEAT'}</h1>
                    <div style={{ fontSize: '2rem', margin: '1rem 0' }}>Score: {userScore} - {opponentScore}</div>
                    <button className="btn" onClick={() => navigate('/dashboard')} style={{ marginTop: '2rem' }}>Back to Menu</button>
                </div>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div style={{ height: '100vh', padding: '2rem', background: '#0f172a', color: 'white' }}>
            {/* Header / HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px solid #3b82f6' }}>
                        <User size={24} color="#3b82f6" />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                            <div style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{userScore} PTS</div>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: timeLeft <= 5 ? 'red' : 'white' }}>{timeLeft}s</div>
                    <div style={{ color: 'var(--text-muted)' }}>Question {currentIndex + 1}/{questions.length}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px solid #ef4444', textAlign: 'right' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>BotMaster 🤖</div>
                            <div style={{ fontSize: '1.2rem', color: '#ef4444' }}>{opponentScore} PTS</div>
                        </div>
                        <Sword size={24} color="#ef4444" />
                    </div>
                </div>
            </div>

            {/* Battle Progress Bar */}
            <div style={{ position: 'relative', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', marginBottom: '3rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                {/* User Progress */}
                <div style={{
                    position: 'absolute', height: '50%', top: 0, left: 0, width: `${userProgress}%`,
                    background: 'linear-gradient(to right, #3b82f6, #60a5fa)', transition: 'width 0.5s',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px'
                }}>🏃‍♂️</div>
                {/* Opponent Progress */}
                <div style={{
                    position: 'absolute', height: '50%', bottom: 0, left: 0, width: `${opponentProgress}%`,
                    background: 'linear-gradient(to right, #ef4444, #f87171)', transition: 'width 0.5s',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px'
                }}>🤖</div>
            </div>

            {/* Effect Popup */}
            {statusEffect && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    fontSize: '4rem', fontWeight: 'bold', textShadow: '0 0 20px rgba(0,0,0,0.5)',
                    zIndex: 1000, animation: 'popup 0.5s ease-out'
                }}>
                    {statusEffect}
                </div>
            )}

            {/* Question Card */}
            <div className="glass-panel" style={{
                margin: '0 auto', maxWidth: '800px', padding: '3rem', textAlign: 'center',
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '20px'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{q.text}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {q.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx, idx === q.correctOptionIndex)}
                            disabled={isAnswered}
                            className="btn"
                            style={{
                                padding: '1.5rem', fontSize: '1.2rem',
                                background: isAnswered ? (idx === q.correctOptionIndex ? '#10b981' : '#334155') : 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                opacity: isAnswered && idx !== q.correctOptionIndex ? 0.5 : 1
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes popup {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default BattleMode;

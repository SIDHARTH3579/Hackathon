import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Zap, Timer, Flame } from 'lucide-react';

const RapidFire = ({ questions, onComplete }) => {
    const { t, language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const currentQuestion = questions[currentIndex];

    // Helper to get text based on language
    const getQuestionText = () => {
        if (!currentQuestion) return '';
        return language === 'hi' ? (currentQuestion.textHi || currentQuestion.text) : currentQuestion.text;
    };

    const getOptions = () => {
        if (!currentQuestion) return [];
        return language === 'hi' ? (currentQuestion.optionsHi || currentQuestion.options) : currentQuestion.options;
    };

    useEffect(() => {
        if (gameOver || feedback) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, gameOver, feedback]);

    const handleTimeUp = () => {
        setFeedback('wrong');
        setCombo(0);
        setTimeout(nextQuestion, 1500);
    };

    const handleAnswer = (idx) => {
        if (feedback) return;

        const isCorrect = idx === currentQuestion.correctOptionIndex;

        if (isCorrect) {
            const timeBonus = Math.floor(timeLeft * 2);
            const comboBonus = combo * 10;
            setScore(prev => prev + 100 + timeBonus + comboBonus);
            setCombo(prev => prev + 1);
            setFeedback('correct');
        } else {
            setCombo(0);
            setFeedback('wrong');
        }

        setTimeout(nextQuestion, 1000);
    };

    const nextQuestion = () => {
        setFeedback(null);
        setTimeLeft(15);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(score);
        }
    };

    if (!currentQuestion) return <div>Loading Fire...</div>;

    return (
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
                padding: '1rem',
                borderRadius: '15px',
                color: 'white',
                boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                    <Timer size={24} />
                    <span style={{ fontSize: '1.5rem' }}>{timeLeft}s</span>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Score: {score}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffd700' }}>
                    <Flame size={24} fill={combo > 1 ? "#ffd700" : "none"} />
                    <span>x{combo}</span>
                </div>
            </div>

            <div className="glass-panel" style={{
                border: feedback === 'correct' ? '3px solid #00ff00' : feedback === 'wrong' ? '3px solid #ff0000' : 'none',
                transition: 'all 0.3s',
                transform: feedback ? 'scale(1.02)' : 'scale(1)'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>
                    {getQuestionText()}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                    {getOptions().map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="btn"
                            disabled={!!feedback}
                            style={{
                                background: feedback && idx === currentQuestion.correctOptionIndex ? '#00ff00' :
                                    feedback === 'wrong' && idx !== currentQuestion.correctOptionIndex ? '#333' :
                                        'rgba(255,255,255,0.1)',
                                color: feedback && idx === currentQuestion.correctOptionIndex ? '#000' : '#fff',
                                borderColor: 'rgba(255,255,255,0.2)',
                                transition: 'transform 0.1s',
                                fontSize: '1.1rem',
                                padding: '1rem'
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '1rem', color: '#ff4b2b', fontStyle: 'italic', fontWeight: 'bold' }}>
                RAPID FIRE MODE ACTIVE
            </div>
        </div>
    );
};

export default RapidFire;

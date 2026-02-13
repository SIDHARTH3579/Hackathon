import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, XCircle } from 'lucide-react';
import SpellingBee from './SpellingBee';
import SurvivalGame from './SurvivalGame';
import SentenceBuilder from './SentenceBuilder';
import MemoryMatch from './MemoryMatch';
import CodeBreaker from './CodeBreaker';
import RapidFire from './RapidFire';
import BattleMode from './BattleMode';
import { useLocation } from 'react-router-dom';

const Quiz = () => {
    const { topicId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');

    const { user } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    // Kahoot Gamification State
    const [timeLeft, setTimeLeft] = useState(15);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [pointsEarned, setPointsEarned] = useState(0); // For popup
    const [comboText, setComboText] = useState(null);

    // Instant Feedback State
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    // Timer Effect
    useEffect(() => {
        if (!isAnswered && !loading && !result && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isAnswered) {
            // Time's up!
            handleOptionSelect(-1); // -1 indicates timeout
        }
    }, [timeLeft, isAnswered, loading, result]);

    useEffect(() => {
        if (user && topicId) {
            api.generateQuiz(topicId, user.id)
                .then(data => {
                    setQuestions(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load quiz", err);
                    setLoading(false);
                });
        }
    }, [topicId, user]);

    const handleOptionSelect = (optionIndex) => {
        if (isAnswered) return;

        const currentQ = questions[currentIndex];
        const correct = optionIndex !== -1 && currentQ.correctOptionIndex === optionIndex;

        setSelectedOption(optionIndex);
        setIsAnswered(true);
        setIsCorrect(correct);
        setAnswers({ ...answers, [currentQ.id]: optionIndex });

        if (correct) {
            // Kahoot Scoring: up to 1000 pts based on speed
            // Formula: (1 - (timeElapsed / timeTotal) / 2) * 1000
            // Simplified: Base 500 + (timeLeft * 30)
            const pts = 500 + (timeLeft * 30) + (streak * 100);
            setScore(prev => prev + pts);
            setPointsEarned(pts);
            setStreak(prev => prev + 1);

            if (streak + 1 > 2) {
                setComboText(`${streak + 1}x STREAK! 🔥`);
            }
        } else {
            setStreak(0);
            setPointsEarned(0);
            setComboText("Streak Lost 😢");
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            // Reset for next question
            setIsAnswered(false);
            setSelectedOption(null);
            setIsCorrect(null);
            setTimeLeft(15);
            setPointsEarned(0);
            setComboText(null);
        } else {
            submitQuiz();
        }
    };

    const submitQuizWithScore = async (finalScore) => {
        try {
            const payload = {
                studentId: user.id,
                topicId: topicId,
                answers: { 'game': 'spelling-bee' } // Dummy
            };
            // Manually override score in mock backend or handle result display
            // For now, let's just show result screen
            setResult({ finalScore: finalScore, score: 100 });
        } catch (e) {
            console.error("Submission failed", e);
        }
    };

    const submitQuiz = async () => {
        try {
            const payload = {
                studentId: user.id,
                topicId: topicId,
                answers: answers
            };
            const attempt = await api.submitQuiz(payload);
            setResult({ ...attempt, finalScore: score }); // Use our calculated score for display

            // Sync with local user state immediately
            if (attempt.earnedCoins) {
                updateUser({ coins: (user.coins || 0) + attempt.earnedCoins });
            }
        } catch (e) {
            console.error("Submission failed", e);
        }
    };

    if (loading) return <div className="container">{t('loading')}</div>;

    if (mode === 'battle' && questions.length > 0) {
        return <BattleMode topicId={topicId} questions={questions} onComplete={(finalScore) => {
            setScore(finalScore);
            submitQuizWithScore(finalScore);
        }} />;
    }

    // Check for Survival Mode (Science & SST)
    if (questions.length > 0 && (questions[0].subject === 'Science' || questions[0].subject === 'SST')) {
        return <SurvivalGame questions={questions} onComplete={(finalScore) => {
            setScore(finalScore);
            submitQuizWithScore(finalScore);
        }} />;
    }

    // Check for Sentence Builder (Hindi & Punjabi)
    if (questions.length > 0 && (questions[0].subject === 'Hindi' || questions[0].subject === 'Punjabi')) {
        return <SentenceBuilder questions={questions} onComplete={(finalScore) => {
            setScore(finalScore);
            submitQuizWithScore(finalScore);
        }} />;
    }

    // Check for Memory Match (Computer Science - Class 6)
    if (questions.length > 0 && questions[0].subject === 'ComputerScience' && user.gradeLevel <= 6) {
        return <MemoryMatch questions={questions} onComplete={(finalScore) => {
            setScore(finalScore);
            submitQuizWithScore(finalScore);
        }} />;
    }

    // Check for Code Breaker (Computer Science - Class 7-10)
    if (questions.length > 0 && questions[0].subject === 'ComputerScience' && user.gradeLevel > 6) {
        return <CodeBreaker questions={questions} onComplete={(finalScore) => {
            setScore(finalScore);
            submitQuizWithScore(finalScore);
        }} />;
    }

    // Check if subject is English for Special Game Mode
    if (questions.length > 0 && questions[0].subject === 'English') {
        if (user.gradeLevel <= 6) {
            return <SpellingBee questions={questions} onComplete={(finalScore) => {
                setScore(finalScore);
                submitQuizWithScore(finalScore);
            }} />;
        } else {
            return <RapidFire questions={questions} onComplete={(finalScore) => {
                setScore(finalScore);
                submitQuizWithScore(finalScore);
            }} />;
        }
    }

    if (questions.length === 0) return <div className="container">{t('noQuestions')}</div>;

    if (result) {
        return (
            <div className="container" style={{ textAlign: 'center' }}>
                <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', background: '#333' }}>
                    <h2 style={{ fontSize: '3rem', color: 'white' }}>{t('podium')}</h2>

                    <div style={{ fontSize: '6rem', margin: '2rem 0', animation: 'bounce 1s infinite' }}>
                        🏆
                    </div>

                    <div style={{ fontSize: '2rem', color: '#ffd700' }}>
                        {t('totalScore')}: {result.finalScore}
                    </div>

                    <div style={{ fontSize: '1.2rem', color: '#fff', marginTop: '1rem' }}>
                        {t('accuracy')}: {Math.round(result.score)}%
                    </div>

                    <div style={{ fontSize: '1.5rem', color: 'gold', marginTop: '1rem', fontWeight: 'bold' }}>
                        + {result.earnedCoins || 0} NeuroCoins 💰
                    </div>

                    <button className="btn" onClick={() => navigate('/dashboard')} style={{ marginTop: '2rem', background: '#46178f' }}>
                        {t('backToMenu')}
                    </button>
                    <style>{`
                        @keyframes bounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-20px); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    // Kahoot Shapes/Colors
    const shapeStyles = [
        { color: '#e21b3c', shape: '▲' }, // Red Triangle
        { color: '#1368ce', shape: '◆' }, // Blue Diamond
        { color: '#d89e00', shape: '●' }, // Yellow Circle
        { color: '#26890c', shape: '■' }  // Green Square
    ];

    return (
        <div className="container" style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', height: '90vh' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '1.5rem', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '10px' }}>
                <div style={{ background: '#333', padding: '5px 15px', borderRadius: '20px' }}>
                    {currentIndex + 1} / {questions.length}
                </div>
                {comboText && <div style={{ color: '#ffd700', fontWeight: 'bold', animation: 'pulse 0.5s infinite' }}>{comboText}</div>}
                <div style={{ background: '#333', padding: '5px 15px', borderRadius: '20px' }}>
                    {t('score')}: {score}
                </div>
            </div>

            {/* Question Area */}
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '2.5rem', background: '#fff', color: '#333', marginBottom: '1rem', position: 'relative' }}>
                {language === 'hi' && currentQuestion.textHi ? currentQuestion.textHi : currentQuestion.text}

                <button
                    onClick={() => {
                        const text = language === 'hi' && currentQuestion.textHi ? currentQuestion.textHi : currentQuestion.text;
                        const opts = (language === 'hi' && currentQuestion.optionsHi ? currentQuestion.optionsHi : currentQuestion.options);
                        const utterance = new SpeechSynthesisUtterance(`${text}. Options are: ${opts.join(', ')}`);
                        if (language === 'hi') utterance.lang = 'hi-IN';
                        window.speechSynthesis.speak(utterance);
                    }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        opacity: 0.7
                    }}
                    title="Read Aloud"
                >
                    🔊
                </button>
            </div>

            {/* Timer Bar */}
            <div style={{ height: '10px', width: '100%', background: '#333', borderRadius: '5px', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    background: timeLeft > 5 ? '#864cbf' : '#ff0000',
                    width: `${(timeLeft / 15) * 100}%`,
                    transition: 'width 1s linear'
                }}></div>
            </div>

            {/* Answer Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '40vh' }}>
                {(language === 'hi' && currentQuestion.optionsHi ? currentQuestion.optionsHi : currentQuestion.options).map((opt, idx) => {
                    const style = shapeStyles[idx % 4];
                    let opacity = 1;

                    if (isAnswered) {
                        if (idx !== currentQuestion.correctOptionIndex && idx !== selectedOption) {
                            opacity = 0.3; // Dim irrelevant options
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswered}
                            style={{
                                background: style.color,
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                opacity: opacity,
                                transition: 'transform 0.1s',
                                boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
                                position: 'relative'
                            }}
                            onMouseDown={(e) => !isAnswered && (e.currentTarget.style.transform = 'translateY(4px)')}
                            onMouseUp={(e) => !isAnswered && (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            <span style={{ fontSize: '3rem', marginRight: '1rem' }}>{style.shape}</span>
                            <span style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>{opt}</span>
                            {isAnswered && idx === currentQuestion.correctOptionIndex && (
                                <span style={{ position: 'absolute', right: '20px', fontSize: '2rem' }}>✔</span>
                            )}
                            {isAnswered && idx === selectedOption && idx !== currentQuestion.correctOptionIndex && (
                                <span style={{ position: 'absolute', right: '20px', fontSize: '2rem' }}>✖</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Action Bar (Next Button) */}
            {isAnswered && (
                <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.8)', padding: '1rem', display: 'flex', justifyContent: 'center', animation: 'slideUp 0.3s ease-out' }}>
                    <div style={{ color: 'white', marginRight: '2rem', fontSize: '2rem' }}>
                        {isCorrect ? `+${pointsEarned}` : 'Wrong!'}
                    </div>
                    <button className="btn" onClick={handleNext} style={{ background: 'white', color: '#333', fontSize: '1.2rem' }}>
                        {currentIndex === questions.length - 1 ? t('finish') : t('next')}
                    </button>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Quiz;

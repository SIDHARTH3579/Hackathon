import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Skull, Trophy } from 'lucide-react';

const SurvivalGame = ({ questions, onComplete }) => {
    const { t, language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'

    const currentQuestion = questions[currentIndex];

    // Speak function (same as Quiz)
    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        if (language === 'hi') utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
    };

    const handleAnswer = (optionIndex) => {
        if (gameOver || feedback) return;

        const isCorrect = optionIndex === currentQuestion.correctOptionIndex;

        if (isCorrect) {
            setScore(prev => prev + 100);
            setFeedback('correct');
            // Sound effect placeholders
        } else {
            setLives(prev => prev - 1);
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            if (!isCorrect && lives - 1 === 0) {
                setGameOver(true);
            } else if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Completed all questions
                onComplete(score + (isCorrect ? 100 : 0));
            }
        }, 1000);
    };

    if (gameOver) {
        return (
            <div className="container" style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                <div className="glass-panel" style={{ background: '#333', border: '2px solid red' }}>
                    <Skull size={64} color="red" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ color: 'red', fontSize: '3rem' }}>GAME OVER</h2>
                    <p style={{ fontSize: '1.5rem', color: 'white' }}>Score: {score}</p>
                    <button className="btn" onClick={() => onComplete(score)} style={{ marginTop: '2rem' }}>
                        {t('finish')}
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            {/* Header: Hearts & Level */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '15px' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[...Array(3)].map((_, i) => (
                        <Heart
                            key={i}
                            fill={i < lives ? "#ff3333" : "none"}
                            color={i < lives ? "#ff3333" : "#555"}
                            style={{ transition: 'all 0.3s' }}
                        />
                    ))}
                </div>
                <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Score: {score}
                </div>
            </div>

            {/* Question Area */}
            <div className="glass-panel" style={{ position: 'relative', textAlign: 'center', marginBottom: '2rem', border: feedback === 'correct' ? '2px solid green' : feedback === 'wrong' ? '2px solid red' : 'none' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                    {language === 'hi' && currentQuestion.textHi ? currentQuestion.textHi : currentQuestion.text}
                </h2>
                <button
                    onClick={() => speakText(language === 'hi' && currentQuestion.textHi ? currentQuestion.textHi : currentQuestion.text)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                >
                    🔊
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {(language === 'hi' && currentQuestion.optionsHi ? currentQuestion.optionsHi : currentQuestion.options).map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="btn"
                            style={{
                                background: feedback && idx === currentQuestion.correctOptionIndex ? 'green' :
                                    feedback === 'wrong' && idx !== currentQuestion.correctOptionIndex ? '#333' :
                                        'linear-gradient(45deg, #444, #555)',
                                opacity: feedback && idx !== currentQuestion.correctOptionIndex ? 0.5 : 1,
                                transform: 'none'
                            }}
                            disabled={!!feedback}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '5px', width: '100%', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((currentIndex) / questions.length) * 100}%`, background: '#00ff00', transition: 'width 0.5s' }}></div>
            </div>
        </div>
    );
};

export default SurvivalGame;

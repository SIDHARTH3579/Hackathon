import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Terminal, Code, Cpu } from 'lucide-react';

const CodeBreaker = ({ questions, onComplete }) => {
    const { t, language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [logs, setLogs] = useState(['> System Initialized...', '> Target: Crack the Code logic...']);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const currentQuestion = questions[currentIndex];

    // Helper to get text based on language
    const getQuestionText = () => {
        if (!currentQuestion) return '';
        return language === 'hi' ? (currentQuestion.textHi || currentQuestion.text) : currentQuestion.text;
    };

    // ... (rest of the component logic)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (feedback) return;

        // Check against correct answer (from option index or explicit answer field)
        // For flexibility, let's assume 'correctAnswer' holds the expected output string
        const correctAnswer = currentQuestion.correctAnswer || currentQuestion.options[currentQuestion.correctOptionIndex];

        const isCorrect = userInput.trim().toLowerCase() === correctAnswer.toString().toLowerCase();

        if (isCorrect) {
            setFeedback('correct');
            setLogs(prev => [...prev, `> Input: ${userInput}`, `> ACCESS GRANTED [${correctAnswer}]`, '> Moving to next encryption layer...']);
            setScore(prev => prev + 100);
        } else {
            setFeedback('wrong');
            setLogs(prev => [...prev, `> Input: ${userInput}`, `> ACCESS DENIED. Expected: [${correctAnswer}]`, '> Security Breach Detected...']);
        }

        setTimeout(() => {
            setFeedback(null);
            setUserInput('');
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete(score + (isCorrect ? 100 : 0));
            }
        }, 2000);
    };

    if (!currentQuestion) return <div className="p-4 font-mono text-green-400">Loading Module...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', fontFamily: '"Courier New", Courier, monospace' }}>
            {/* Terminal Window */}
            <div style={{
                background: '#1e1e1e',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                border: '1px solid #333'
            }}>
                {/* Title Bar */}
                <div style={{
                    background: '#333',
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid #444'
                }}>
                    <Terminal size={18} color="#00ff00" />
                    <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Secure Shell - logical_node_{currentIndex + 1}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '1.5rem', color: '#00ff00', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    {/* Log History */}
                    <div style={{ marginBottom: '1.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
                        {logs.slice(-3).map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>

                    {/* Problem Statement */}
                    <div style={{
                        background: 'rgba(0,255,0,0.1)',
                        borderLeft: '4px solid #00ff00',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ color: '#fff', marginBottom: '0.5rem', fontWeight: 'bold' }}>// CHALLENGE:</div>
                        <div style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>{getQuestionText()}</div>
                        {currentQuestion.codeSnippet && (
                            <div style={{
                                background: '#111',
                                padding: '1rem',
                                marginTop: '1rem',
                                borderRadius: '4px',
                                border: '1px solid #444',
                                color: '#d4d4d4'
                            }}>
                                {currentQuestion.codeSnippet}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: '#00ff00', fontWeight: 'bold' }}>$ root@user:~</span>
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="terminal-input"
                            autoFocus
                            placeholder="Type command/answer..."
                            disabled={!!feedback}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '2px solid #555',
                                color: '#fff',
                                flex: 1,
                                fontSize: '1.1rem',
                                padding: '0.5rem',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: '#00ff00',
                                color: '#000',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            EXECUTE
                        </button>
                    </form>
                </div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'right', color: '#00ff00', fontFamily: 'monospace' }}>
                SCORE: {score} | LOG_LEVEL: {currentIndex + 1}/{questions.length}
            </div>
        </div>
    );
};

export default CodeBreaker;

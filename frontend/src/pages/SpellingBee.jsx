import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Volume2 } from 'lucide-react';

const SpellingBee = ({ questions, onComplete }) => {
    const { t } = useLanguage();

    // Parse questions to words: Expecting text=Hint, correctAnswer=Word
    const [words, setWords] = useState([]);

    useEffect(() => {
        if (questions && questions.length > 0) {
            const mappedWords = questions.map(q => ({
                word: (q.correctAnswer || q.options[q.correctOptionIndex] || "").toUpperCase(),
                hint: q.text
            }));
            setWords(mappedWords);
        }
    }, [questions]);

    // Fallback if no questions
    if (words.length === 0) return <div>Loading Words...</div>;

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const currentWord = words[currentWordIndex];

    const speakWord = () => {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        speakWord();
    }, [currentWordIndex]);

    const checkSpelling = () => {
        if (userInput.toUpperCase() === currentWord.word) {
            setScore(prev => prev + 10);
            setFeedback('CORRECT! 🎉');
            setTimeout(() => {
                setFeedback(null);
                setUserInput('');
                if (currentWordIndex < words.length - 1) {
                    setCurrentWordIndex(prev => prev + 1);
                } else {
                    onComplete(score + 10);
                }
            }, 1000);
        } else {
            setFeedback('Try Again ❌');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2>Spelling Bee 🐝</h2>
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <button onClick={speakWord} className="btn" style={{ borderRadius: '50%', padding: '1rem' }}>
                        <Volume2 size={32} />
                    </button>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>Hint: {currentWord.hint}</p>
                </div>

                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type the word..."
                    style={{
                        padding: '1rem',
                        fontSize: '1.5rem',
                        borderRadius: '10px',
                        border: '2px solid #333',
                        width: '80%',
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}
                />

                <div style={{ marginTop: '2rem' }}>
                    <button className="btn" onClick={checkSpelling}>Check</button>
                </div>

                {feedback && (
                    <div style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: feedback.includes('CORRECT') ? 'green' : 'red' }}>
                        {feedback}
                    </div>
                )}

                <div style={{ marginTop: '2rem' }}>Score: {score}</div>
            </div>
        </div>
    );
};

export default SpellingBee;

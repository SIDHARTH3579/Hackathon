import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RefreshCw, Check, ArrowRight } from 'lucide-react';

const SentenceBuilder = ({ questions, onComplete }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState([]);
    const [availableWords, setAvailableWords] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentIndex];

    // Helper to shuffle array
    const shuffle = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        if (currentQuestion) {
            // Assume options contain the words + potentially distractors, 
            // OR for this game mode, we might expect 'correctSentence' in data.
            // fallback: use 'text' as instruction and 'options' as the words.
            // Let's assume options ARE the words to be arranged.
            setAvailableWords(shuffle(currentQuestion.options));
            setSelectedWords([]);
            setFeedback(null);
        }
    }, [currentQuestion]);

    const handleWordClick = (word, index) => {
        if (feedback) return;

        // Move from available to selected
        const newAvailable = [...availableWords];
        newAvailable.splice(index, 1);
        setAvailableWords(newAvailable);
        setSelectedWords([...selectedWords, word]);
    };

    const handleSelectedClick = (word, index) => {
        if (feedback) return;

        // Move back from selected to available
        const newSelected = [...selectedWords];
        newSelected.splice(index, 1);
        setSelectedWords(newSelected);
        setAvailableWords([...availableWords, word]);
    };

    const checkAnswer = () => {
        const formedSentence = selectedWords.join(' ');
        // For validation: formatted sentence should match the "answer" field we will add to api
        // or check if it matches the correctOptionIndex content if we restructure.
        // Let's assume currentQuestion.answer holds the correct string.

        const isCorrect = formedSentence === currentQuestion.answer;

        if (isCorrect) {
            setFeedback('correct');
            setScore(prev => prev + 100);
            // specific sound
        } else {
            setFeedback('wrong');
            // specific sound
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete(score + (isCorrect ? 100 : 0));
            }
        }, 1500);
    };

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', color: '#ffd700' }}>
                {t('sentenceBuilder') || "Sentence Builder"}
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                {currentQuestion.textHi || currentQuestion.text}
            </p>

            {/* Answer Box */}
            <div style={{
                minHeight: '80px',
                background: 'rgba(255,255,255,0.1)',
                border: feedback === 'correct' ? '2px solid #00ff00' : feedback === 'wrong' ? '2px solid #ff0000' : '2px dashed #aaa',
                borderRadius: '15px',
                padding: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
                marginBottom: '2rem',
                transition: 'all 0.3s'
            }}>
                {selectedWords.length === 0 && !feedback && (
                    <span style={{ color: '#aaa', alignSelf: 'center' }}>Tap words below to build the sentence...</span>
                )}
                {selectedWords.map((word, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSelectedClick(word, idx)}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '1rem',
                            background: '#007bff',
                            animation: 'popIn 0.2s'
                        }}
                    >
                        {word}
                    </button>
                ))}
            </div>

            {/* Word Bank */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center', marginBottom: '3rem' }}>
                {availableWords.map((word, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleWordClick(word, idx)}
                        className="btn"
                        style={{
                            padding: '0.8rem 1.5rem',
                            fontSize: '1.1rem',
                            background: '#ffffff',
                            color: '#333',
                            border: '1px solid #ccc',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {word}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                    onClick={() => { setSelectedWords([]); setAvailableWords(shuffle(currentQuestion.options)); }}
                    className="btn"
                    style={{ background: '#555' }}
                >
                    <RefreshCw size={20} style={{ marginRight: '5px' }} /> Reset
                </button>
                <button
                    onClick={checkAnswer}
                    className="btn"
                    style={{ background: '#28a745', fontSize: '1.2rem', padding: '0.8rem 2rem' }}
                    disabled={selectedWords.length === 0 || !!feedback}
                >
                    Check <Check size={20} style={{ marginLeft: '5px' }} />
                </button>
            </div>

            <div style={{ marginTop: '2rem', color: '#ffd700', fontSize: '1.2rem' }}>
                Score: {score}
            </div>

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SentenceBuilder;

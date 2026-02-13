import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const MemoryMatch = ({ questions, onComplete }) => {
    const { t } = useLanguage();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Initialize Game
    useEffect(() => {
        if (questions && questions.length > 0) {
            // Create pairs: Question Text <-> Correct Answer (Option)
            // We'll take up to 6 questions to make a 12-card grid (3x4 or 4x3)
            const selectedQuestions = questions.slice(0, 6);
            let deck = [];

            selectedQuestions.forEach((q, index) => {
                const answerEn = q.correctAnswer || (q.options ? q.options[q.correctOptionIndex] : "---");
                const answerHi = q.correctAnswerHi || (q.optionsHi ? q.optionsHi[q.correctOptionIndex] : answerEn);
                const textHi = q.textHi || q.text;

                // Card 1: The Term/Question
                deck.push({
                    id: `q-${index}`,
                    contentEn: q.text,
                    contentHi: textHi,
                    type: 'question',
                    pairId: index
                });

                // Card 2: The Definition/Answer
                deck.push({
                    id: `a-${index}`,
                    contentEn: answerEn,
                    contentHi: answerHi,
                    type: 'answer',
                    pairId: index
                });
            });

            // Shuffle
            deck.sort(() => Math.random() - 0.5);
            setCards(deck);
        }
    }, [questions]);

    const handleCardClick = (index) => {
        if (gameOver) return;
        // Prevent clicking same card or matched cards or if 2 are already flipped
        if (flipped.length === 2 || matched.includes(cards[index].pairId) || flipped.includes(index)) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const card1 = cards[newFlipped[0]];
            const card2 = cards[newFlipped[1]];

            if (card1.pairId === card2.pairId) {
                // Match!
                setMatched([...matched, card1.pairId]);
                setScore(prev => prev + 100);
                setFlipped([]);

                // Check Win
                if (matched.length + 1 === cards.length / 2) {
                    setTimeout(() => {
                        onComplete(score + 100 + 500); // Bonus for completion
                    }, 1000);
                }
            } else {
                // No Match - Flip back after delay
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#00d2ff', marginBottom: '1rem' }}>Memory Match 🧠</h2>
            <div style={{ color: '#aaa', marginBottom: '2rem' }}>Match the terms with their definitions!</div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || matched.includes(card.pairId);
                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            style={{
                                aspectRatio: '1/1',
                                perspective: '1000px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                textAlign: 'center',
                                transition: 'transform 0.6s',
                                transformStyle: 'preserve-3d',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}>
                                {/* Front (Hidden) */}
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    background: 'linear-gradient(135deg, #2b32b2, #1488cc)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    color: 'rgba(255,255,255,0.2)',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                }}>
                                    ?
                                </div>

                                {/* Back (Revealed) */}
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    background: matched.includes(card.pairId) ? '#28a745' : '#fff',
                                    color: matched.includes(card.pairId) ? '#fff' : '#333',
                                    borderRadius: '10px',
                                    transform: 'rotateY(180deg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                }}>
                                    {language === 'hi' ? card.contentHi : card.contentEn}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Score: {score}
            </div>
        </div>
    );
};

export default MemoryMatch;

import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        // Auth
        loginTitle: "Login to NeuroLearn",
        registerTitle: "Join the Adventure",
        usernamePayload: "Username",
        passwordPayload: "Password",
        gradePayload: "Class / Grade",
        loginBtn: "Login",
        registerBtn: "Register",
        switchRegister: "Need an account? Register",
        switchLogin: "Have an account? Login",

        // Dashboard
        welcome: "Welcome back",
        progressTitle: "Your Progress",
        quickStats: "Quick Stats",
        recentActivity: "Recent Activity",
        totalQuizzes: "Total Quizzes",
        masteredTopics: "Mastered Topics",
        startQuizBtn: "Start New Quiz",
        avgScore: "Avg",
        noActivity: "No quizzes taken yet.",

        // Quiz
        loading: "Loading Quiz Arena...",
        noQuestions: "No challenges here.",
        levelComplete: "LEVEL COMPLETE!",
        gameOver: "GAME OVER!",
        score: "Score",
        xp: "XP",
        next: "NEXT >>",
        finish: "FINISH",
        backToMenu: "Return to Base",
        podium: "PODIUM",
        totalScore: "Total Score",
        accuracy: "Accuracy",
        locked: "Locked",

        // Topics
        selectTopic: "Select a World (Topic)",
        start: "Start",
        takeQuiz: "Take Quiz",
        chapters: "Chapters",
        subjects: "Subjects",
        loadingTopics: "Loading topics...",
    },
    hi: {
        // Auth
        loginTitle: "न्यूरोलाग्न में लॉगिन करें",
        registerTitle: "साहसिक कार्य में शामिल हों",
        usernamePayload: "उपयोगकर्ता नाम",
        passwordPayload: "पासवर्ड",
        gradePayload: "कक्षा / ग्रेड",
        loginBtn: "लॉगिन",
        registerBtn: "रजिस्टर",
        switchRegister: "खाता नहीं है? रजिस्टर करें",
        switchLogin: "खाता है? लॉगिन करें",

        // Dashboard
        welcome: "वापसी पर स्वागत है",
        progressTitle: "आपकी प्रगति",
        quickStats: "त्वरित आँकड़े",
        recentActivity: "हाल की गतिविधि",
        totalQuizzes: "कुल क्विज़",
        masteredTopics: "महारत हासिल विषय",
        startQuizBtn: "नई क्विज़ शुरू करें",
        avgScore: "औसत",
        noActivity: "अभी तक कोई क्विज़ नहीं लिया गया।",

        // Quiz
        loading: "क्विज़ अखाड़ा लोड हो रहा है...",
        noQuestions: "यहाँ कोई चुनौतियाँ नहीं हैं।",
        levelComplete: "स्तर पूरा हुआ!",
        gameOver: "खेल खत्म!",
        score: "स्कोर",
        xp: "अनुभव",
        next: "अगला >>",
        finish: "समाप्त",
        backToMenu: "आधार पर लौटें",
        podium: "पोडियम",
        totalScore: "कुल स्कोर",
        accuracy: "शुद्धता",
        locked: "बंद है",

        // Topics
        selectTopic: "एक दुनिया चुनें (विषय)",
        start: "शुरू करें",
        takeQuiz: "क्विज़ लें",
        chapters: "अध्याय",
        subjects: "विषय",
        loadingTopics: "विषय लोड हो रहे हैं...",
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

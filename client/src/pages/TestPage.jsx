import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const TestPage = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]); // Array of option labels 'A', 'B'...
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/test/config');
                setQuestions(res.data.questions);
            } catch (err) {
                console.error(err);
                alert('Failed to load test');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleAnswer = (label) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const newAnswers = [...answers, label];
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setIsTransitioning(false);
            }, 300);
        } else {
            submitTest(newAnswers);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0 && !isTransitioning) {
            setIsTransitioning(true);
            // Remove the last answer when going back, so the user must answer again to proceed
            setAnswers(answers.slice(0, -1));
            setTimeout(() => {
                setCurrentIndex(currentIndex - 1);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const submitTest = async (finalAnswers) => {
        setLoading(true);
        try {
            const res = await api.post('/test/submit', { answers: finalAnswers });
            // Pass result to result page via state or store
            navigate('/result', { state: { result: res.data } });
        } catch (err) {
            console.error(err);
            alert('提交失败，请重试'); // Translated to Chinese
            setLoading(false);
            setIsTransitioning(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">加载中...</div>;
    if (questions.length === 0) return <div>未找到题目</div>;

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-paper-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="mb-8 flex justify-between text-gray-500 text-sm">
                    <span>{currentQuestion.chapter}</span>
                    <span>{currentIndex + 1} / {questions.length}</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-2xl font-serif font-bold mb-8 text-ink-black leading-relaxed">
                            {currentQuestion.question}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={() => handleAnswer(option.label)}
                                    disabled={isTransitioning}
                                    className={`w-full text-left p-4 border rounded-lg transition-all duration-200 group ${isTransitioning
                                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                            : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                        }`}
                                >
                                    <span className="font-bold mr-4 text-gray-400 group-hover:text-ink-black">{option.label}.</span>
                                    <span className="text-gray-800">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Previous Button */}
                <div className="mt-8 flex justify-start">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0 || isTransitioning}
                        className={`text-sm flex items-center gap-2 transition-colors ${currentIndex === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:text-ink-black'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        上一题
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestPage;

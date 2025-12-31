import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
    const hideTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }
        };
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    console.log('FeedbackButton: open modal');
                    setIsModalOpen(true);
                }}
                className="fixed bottom-6 right-6 z-40 relative p-0 bg-transparent shadow-none border-0"
                aria-label="Feedback"
                title="মতামত দিন"
            >
                <img
                    src="/feedback_icon.png"
                    alt="Feedback"
                    className="w-12 h-12 select-none"
                    draggable="false"
                    onLoad={() => console.log('FeedbackButton: PNG icon loaded')}
                />
                <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    মতামত দিন
                </span>
            </button>

            <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showSuccessPrompt ? 'opacity-100' : 'opacity-0'}`} role="status" aria-live="polite">
                <div className="px-5 py-3 rounded-2xl shadow-2xl border border-green-700 bg-green-600 text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">ধন্যবাদ! মতামত পাঠানো হয়েছে</span>
                </div>
            </div>

            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => {
                    console.log('FeedbackButton: close modal');
                    setIsModalOpen(false);
                }}
                onSubmitted={() => {
                    console.log('FeedbackButton: feedback submitted');
                    if (hideTimerRef.current) {
                        clearTimeout(hideTimerRef.current);
                    }
                    setShowSuccessPrompt(true);
                    hideTimerRef.current = setTimeout(() => {
                        setShowSuccessPrompt(false);
                    }, 2500);
                }}
            />
        </>
    );
};

export default FeedbackButton;

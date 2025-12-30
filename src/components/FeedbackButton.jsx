import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 z-40 group flex items-center justify-center p-4 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-green-100 dark:border-green-900"
                aria-label="Feedback"
                title="মতামত দিন"
            >
                <MessageCircle className="w-6 h-6 animate-pulse group-hover:animate-none" />
                <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    মতামত দিন
                </span>
            </button>

            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default FeedbackButton;

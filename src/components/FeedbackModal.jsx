import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const FeedbackModal = ({ isOpen, onClose, onSubmitted }) => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        try {
            console.log('FeedbackModal: submitting feedback');
            await addDoc(collection(db, 'feedbacks'), {
                message: message.trim(),
                createdAt: serverTimestamp(),
                userAgent: navigator.userAgent,
                page: window.location.pathname
            });

            toast.success('মতামত পাঠানোর জন্য ধন্যবাদ!');
            setMessage('');
            console.log('FeedbackModal: feedback submitted successfully');
            if (typeof onSubmitted === 'function') {
                onSubmitted();
            }
            onClose();
        } catch (error) {
            console.error('Error adding feedback: ', error);
            toast.error('দুঃখিত, মতামত পাঠাতে সমস্যা হয়েছে।');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400">
                            <MessageSquare size={20} />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">মতামত দিন</h3>
                    </div>
                    <button
                        onClick={() => {
                            console.log('FeedbackModal: close clicked');
                            onClose();
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            আপনার মতামত আমাদের জানান
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="এখানে লিখুন..."
                            className="w-full min-h-[120px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !message.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span className="ml-1">পাঠানো হচ্ছে...</span>
                                </>
                            ) : (
                                <>
                                    <span>পাঠান</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;

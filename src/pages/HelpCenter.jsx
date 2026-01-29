import React, { useState } from 'react';
import { Search, Book, MessageCircle, Mail, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function HelpCenter() {
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const faqs = [
        {
            q: "How do I add a new employee?",
            a: "Go to the Employees page and click the '+ Add Employee' button in the top right corner. Fill out the form with the employee's details including name, email, role, department, and salary. Click 'Save' to add them to the system.",
            category: "employees"
        },
        {
            q: "How do I reset my password?",
            a: "You can request a password reset from the Login page by clicking 'Forgot Password'. If you're already logged in, navigate to Settings > Security and use the 'Update Password' section to change your password.",
            category: "security"
        },
        {
            q: "Can I export attendance reports?",
            a: "Currently, attendance reports can be viewed on the Attendance page where you can see check-in/check-out times and dates. Export functionality for CSV/PDF reports is planned for the next update.",
            category: "attendance"
        },
        {
            q: "How do I create a new department?",
            a: "Navigate to the Departments page and click 'Add Department'. You'll need to specify a department name and assign a department head. The system will automatically track employee count as you add employees to the department.",
            category: "departments"
        },
        {
            q: "How do I upload documents?",
            a: "Go to the Documents page and click the 'Upload Document' button. Select your file (PDF, DOC, XLS, etc.) and it will be uploaded to the cloud. All documents are associated with your account and can be downloaded or deleted later.",
            category: "documents"
        },
        {
            q: "How do I change the theme?",
            a: "Navigate to Settings > Appearance. You can choose between Dark Mode (default) and Light Mode. Your preference will be saved automatically and applied across all pages.",
            category: "settings"
        },
        {
            q: "What are the different employee statuses?",
            a: "Employees can have the following statuses: Active (currently working), On Leave (temporarily away), or Inactive (no longer with the company). You can update an employee's status by editing their profile.",
            category: "employees"
        },
        {
            q: "How do I track attendance?",
            a: "The Attendance page shows all check-in and check-out records. Employees can mark their attendance using the 'Check In' and 'Check Out' buttons. The system automatically records timestamps and dates.",
            category: "attendance"
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        searchTerm === '' ||
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChat = () => {
        setShowChatModal(true);
        if (chatHistory.length === 0) {
            setChatHistory([
                { sender: 'bot', message: 'Hello! How can I help you today?', time: new Date().toLocaleTimeString() }
            ]);
        }
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;

        const newMessage = {
            sender: 'user',
            message: chatMessage,
            time: new Date().toLocaleTimeString()
        };

        setChatHistory(prev => [...prev, newMessage]);
        setChatMessage('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                sender: 'bot',
                message: "Thank you for your message! A support agent will respond shortly. In the meantime, you can check our FAQ section below for quick answers.",
                time: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, botResponse]);
        }, 1000);
    };

    const handleEmailSupport = () => {
        showToast('Opening your email client...', 'info');
        window.location.href = 'mailto:support@vrmx.com?subject=Support Request&body=Please describe your issue here...';
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-4">How can we help you?</h1>
                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for answers..."
                        className="w-full bg-dark-800 border border-dark-700 rounded-full pl-12 pr-6 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-lg shadow-black/20"
                    />
                </div>
                {searchTerm && (
                    <p className="text-gray-400 text-sm mt-2">
                        Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div
                    className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-colors cursor-pointer group"
                    onClick={() => {
                        showToast('Documentation coming soon!', 'info');
                    }}
                >
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Book size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
                    <p className="text-gray-400 text-sm">Detailed guides and articles about all features.</p>
                </div>

                <div
                    className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-colors cursor-pointer group"
                    onClick={handleChat}
                >
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
                    <p className="text-gray-400 text-sm">Chat with our support team in real-time.</p>
                </div>

                <div
                    className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-colors cursor-pointer group"
                    onClick={handleEmailSupport}
                >
                    <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
                    <p className="text-gray-400 text-sm">Get help via email for complex issues.</p>
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
                <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {filteredFaqs.map((item, index) => (
                        <div
                            key={index}
                            className="border border-dark-700 rounded-lg overflow-hidden hover:border-primary-500/30 transition-colors"
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full p-4 flex items-center justify-between text-left hover:bg-dark-700/30 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-primary-500 font-bold text-lg">Q.</span>
                                    <h3 className="text-white font-medium">{item.q}</h3>
                                </div>
                                {expandedFaq === index ? (
                                    <ChevronUp className="text-gray-400" size={20} />
                                ) : (
                                    <ChevronDown className="text-gray-400" size={20} />
                                )}
                            </button>
                            {expandedFaq === index && (
                                <div className="px-4 pb-4 pt-2 bg-dark-700/20 animate-fade-in">
                                    <p className="text-gray-400 pl-8">{item.a}</p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-primary-500/10 text-primary-500 text-xs rounded-full ml-8">
                                        {item.category}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No FAQs found matching "{searchTerm}". Try a different search term.
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Modal */}
            {showChatModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-lg flex flex-col max-h-[600px]">
                        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Live Support Chat</h3>
                                    <p className="text-xs text-gray-400">We typically reply in minutes</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowChatModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatHistory.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-200'} rounded-lg p-3`}>
                                        <p className="text-sm">{msg.message}</p>
                                        <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-dark-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React from 'react';
import { Search, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';

export default function HelpCenter() {
    const faqs = [
        { q: "How do I add a new employee?", a: "Go to the Employees page and click the '+ Add Employee' button in the top right corner. Fill out the form and click 'Save'." },
        { q: "How do I reset my password?", a: "You can request a password reset from the Login page by clicking 'Forgot Password', or go to Settings > Security if you are already logged in." },
        { q: "Can I export attendance reports?", a: "Currently, attendance reports can be viewed on the Attendance page. Export functionality is coming in the next update." },
        { q: "How do I create a new department?", a: "Navigate to the Departments page and click 'Add Department'. You'll need to specify a name and assign a department head." },
    ];

    const handleChat = () => {
        alert("Connecting to live support agent... (Simulation: Chat window would open here)");
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-4">How can we help you?</h1>
                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full bg-dark-800 border border-dark-700 rounded-full pl-12 pr-6 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-lg shadow-black/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-colors cursor-pointer group" onClick={() => window.open('https://docs.employees.com', '_blank')}>
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Book size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
                    <p className="text-gray-400 text-sm">Detailed guides and articles about all features.</p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-colors cursor-pointer group" onClick={handleChat}>
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
                    <p className="text-gray-400 text-sm">Chat with our support team in real-time.</p>
                </div>

                <a href="mailto:support@peoplehub.com" className="bg-dark-800 p-6 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-colors cursor-pointer group block">
                    <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
                    <p className="text-gray-400 text-sm">Get help via email for complex issues.</p>
                </a>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
                <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    {faqs.map((item, index) => (
                        <div key={index} className="border-b border-dark-700/50 pb-6 last:border-0 last:pb-0">
                            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                                <span className="text-primary-500 font-bold">Q.</span> {item.q}
                            </h3>
                            <p className="text-gray-400 pl-6">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

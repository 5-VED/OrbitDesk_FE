import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { aiService } from '../../services/ai.service';
import './ChatbotWidget.css';

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Simulate AI response delay for realism if it's too fast
            // Using generateReply API for now as a generic chat endpoint
            const response = await aiService.generateReply({
                ticketId: 'general-chat',
                ticketContent: userMsg.text,
                context: "You are a helpful support chatbot talking directly to a user."
            });

            const botMsg = {
                id: Date.now() + 1,
                text: response.reply || "I'm not sure how to respond to that.",
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting to the server.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            {!isOpen && (
                <button
                    className="chatbot-trigger"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open Chat"
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-widget">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <Bot size={20} />
                            OrbitDesk AI
                        </div>
                        <div className="chatbot-header-actions">
                            <button onClick={() => setIsOpen(false)} aria-label="Close Chat">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-message ${msg.sender}`}>
                                <div className="chat-bubble">
                                    {msg.text}
                                </div>
                                <span className="chat-time">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chat-message bot">
                                <div className="chat-typing">
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={!inputValue.trim() || isTyping}
                        >
                            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

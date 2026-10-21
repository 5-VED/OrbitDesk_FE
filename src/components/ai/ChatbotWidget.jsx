import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Fab,
    CircularProgress
} from '@mui/material';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { aiService } from '../../services/ai.service';

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
            {/* Trigger Fab Button */}
            {!isOpen && (
                <Fab
                    color="primary"
                    aria-label="Open Chat"
                    onClick={() => setIsOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1300,
                        boxShadow: 4
                    }}
                >
                    <MessageSquare size={24} />
                </Fab>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: { xs: 'calc(100vw - 32px)', sm: 380 },
                        height: 520,
                        maxHeight: 'calc(100vh - 48px)',
                        zIndex: 1300,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'primary.main',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Bot size={22} />
                            <Typography variant="subtitle1" fontWeight={700}>
                                OrbitDesk AI
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Chat"
                            sx={{ color: '#fff' }}
                        >
                            <X size={20} />
                        </IconButton>
                    </Box>

                    {/* Messages scroll area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50'
                        }}
                    >
                        {messages.map((msg) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            borderTopRightRadius: isUser ? 0 : 2,
                                            borderTopLeftRadius: !isUser ? 0 : 2,
                                            bgcolor: isUser ? 'primary.main' : 'background.paper',
                                            color: isUser ? '#fff' : 'text.primary',
                                            boxShadow: 1,
                                            fontSize: '0.9rem',
                                            lineHeight: 1.4,
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {msg.text}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: 'block',
                                            mt: 0.25,
                                            textAlign: isUser ? 'right' : 'left',
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            );
                        })}

                        {isTyping && (
                            <Box sx={{ alignSelf: 'flex-start', p: 1.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                                <CircularProgress size={16} color="primary" />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input form */}
                    <Box
                        component="form"
                        onSubmit={handleSend}
                        sx={{
                            p: 1.5,
                            display: 'flex',
                            gap: 1,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isTyping}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <IconButton
                            type="submit"
                            color="primary"
                            disabled={!inputValue.trim() || isTyping}
                            sx={{
                                bgcolor: 'primary.main',
                                color: '#fff',
                                '&:hover': { bgcolor: 'primary.dark' },
                                '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
                                borderRadius: 2
                            }}
                        >
                            {isTyping ? <CircularProgress size={18} color="inherit" /> : <Send size={18} />}
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
}

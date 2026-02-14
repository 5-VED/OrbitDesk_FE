import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { toast } from 'react-hot-toast';

export function SmartReplyModal({ isOpen, onClose, onApply, ticketId }) {
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && !replyText) {
            generateReply();
        }
    }, [isOpen, ticketId]);

    const generateReply = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await aiService.generateReply({ ticketId });
            // Handle different response structures gracefully
            const text = result?.reply || result?.data?.reply || result?.data || (typeof result === 'string' ? result : '');

            if (text) {
                setReplyText(text);
            } else {
                throw new Error('No reply generated');
            }
        } catch (err) {
            console.error('AI Reply Error:', err);
            setError('Failed to generate reply. Please try again.');
            toast.error('Could not generate smart reply');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!replyText.trim()) return;
        onApply(replyText);
        onClose();
        // Optional: clear text after applying? 
        // setReplyText(''); 
        // Better to keep it until next generation or meaningful reset
    };

    const handleClose = () => {
        onClose();
        // Reset state on close if needed, but maybe user wants to come back to it?
        // Let's not clear on close for now, only on apply or new generation.
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} className="text-purple-600" />
                    <span>AI Smart Reply</span>
                </div>
            }
            size="medium"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <div style={{ flex: 1 }}></div>
                    <Button
                        variant="secondary"
                        onClick={generateReply}
                        disabled={loading}
                        icon={RefreshCw}
                    >
                        Regenerate
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={loading || !replyText.trim()}
                        icon={Check}
                    >
                        Insert Reply
                    </Button>
                </>
            }
        >
            <div className="smart-reply-content">
                {loading ? (
                    <div className="loading-state" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        <div className="spinner" style={{ marginBottom: '16px' }}>
                            <RefreshCw className="animate-spin" size={24} />
                        </div>
                        <p>Generating smart reply...</p>
                    </div>
                ) : error ? (
                    <div className="error-state" style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
                        <p>{error}</p>
                        <Button variant="outline" onClick={generateReply} style={{ marginTop: '16px' }}>
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <div className="reply-preview">
                        <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={10}
                            placeholder="Generated reply will appear here..."
                            style={{ minHeight: '300px' }}
                        />
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666', textAlign: 'right' }}>
                            AI-generated content may be inaccurate. Please review before sending.
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

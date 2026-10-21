import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Send,
    MoreHorizontal,
    Clock,
    MessageSquare,
    Lock,
    RefreshCw,
    Edit,
    Trash2,
    Check,
    X,
    ChevronDown,
    Sparkles,
    FileText,
    Smile,
    Meh,
    Frown,
    Star
} from 'lucide-react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Dropdown } from '../components/ui/Dropdown';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import { Modal } from '../components/ui/Modal';
import { SmartReplyModal } from '../components/ai/SmartReplyModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTicketDetail,
    fetchAgents,
    addComment,
    updateComment,
    deleteComment,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    clearTicketDetail,
    selectTicketDetail,
    selectTicketComments,
    selectTicketDetailLoading,
    selectTicketDetailSubmitting,
    selectTicketAgents,
} from '../store/slices/ticketDetailSlice';
import { getStatusOptions, getPriorityOptions } from '../utils/ticketConstants';
import { aiService } from '../services/ai.service';
import { ratingService } from '../services/rating.service';
import { toast } from 'react-hot-toast';

export function TicketDetail() {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const ticket = useAppSelector(selectTicketDetail);
    const comments = useAppSelector(selectTicketComments);
    const loading = useAppSelector(selectTicketDetailLoading);
    const submitting = useAppSelector(selectTicketDetailSubmitting);
    const agents = useAppSelector(selectTicketAgents);

    // Local ephemeral UI state
    const [replyText, setReplyText] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const replyEditorRef = useRef(null);
    const [isSmartReplyModalOpen, setIsSmartReplyModalOpen] = useState(false);

    const statusDotColors = {
        new: '#3B82F6',
        open: '#F44336',
        pending: '#F59E0B',
        hold: '#A2A8B5',
        solved: '#22C55E',
        closed: '#6B7280',
    };

    const priorityDotColors = {
        low: '#A2A8B5',
        normal: '#3B82F6',
        high: '#F59E0B',
        urgent: '#EF4444',
    };

    const statusWithDots = getStatusOptions().map(opt => ({
        ...opt,
        dotColor: statusDotColors[opt.value],
    }));

    const priorityWithDots = getPriorityOptions().map(opt => ({
        ...opt,
        dotColor: priorityDotColors[opt.value],
    }));

    // AI State
    const [sentiment, setSentiment] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    // Rating State
    const [existingRating, setExistingRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [ratingFeedback, setRatingFeedback] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        dispatch(fetchTicketDetail(ticketId));
        dispatch(fetchAgents());

        return () => {
            dispatch(clearTicketDetail());
        };
    }, [dispatch, ticketId]);

    useEffect(() => {
        if (ticketId) {
            ratingService.getRatingByTicket(ticketId)
                .then(res => {
                    if (res.success && res.data) {
                        setExistingRating(res.data);
                        setSelectedRating(res.data.rating);
                        setRatingFeedback(res.data.feedback || '');
                    }
                })
                .catch(() => {});
        }
    }, [ticketId]);

    // Analyze Sentiment on load
    useEffect(() => {
        if (ticket?.description && !sentiment) {
            aiService.analyzeSentiment(ticket.description)
                .then(res => {
                    if (res && res.sentiment) setSentiment(res.sentiment);
                    else if (res && res.label) setSentiment(res);
                })
                .catch(err => console.error("Sentiment analysis failed:", err));
        }
    }, [ticket?.description, sentiment]);

    const handleRefresh = () => dispatch(fetchTicketDetail(ticketId));

    const handleSummarize = async () => {
        setLoadingSummary(true);
        try {
            const conversation = [
                `Customer: ${ticket.description}`,
                ...comments.map(c => `${c.author_id.first_name}: ${c.body}`)
            ].join('\n\n');

            const res = await aiService.summarizeTicket({
                ticketId,
                ticketConversation: conversation
            });

            if (res && res.summary) {
                setSummary(res.summary);
                toast.success("Summary generated");
            }
        } catch (error) {
            toast.error("Failed to summarize ticket");
            console.error(error);
        } finally {
            setLoadingSummary(false);
        }
    };

    const handleSubmitReply = async (e) => {
        e?.preventDefault();
        if (!replyText || replyText === '<p></p>') return;

        try {
            await dispatch(addComment({
                ticketId,
                commentData: { body: replyText, public: !isInternal },
            })).unwrap();
            toast.success(isInternal ? 'Note added' : 'Reply sent');
            setReplyText('');
            replyEditorRef.current?.clear();
            dispatch(fetchTicketDetail(ticketId));
        } catch (error) {
            toast.error(error || 'Failed to send reply');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await dispatch(updateTicketStatus({ ticketId, status: newStatus })).unwrap();
            toast.success('Status updated');
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handlePriorityChange = async (newPriority) => {
        try {
            await dispatch(updateTicketPriority({ ticketId, priority: newPriority })).unwrap();
            toast.success('Priority updated');
        } catch {
            toast.error('Failed to update priority');
        }
    };

    const handleAssigneeChange = async (newAssignee) => {
        try {
            await dispatch(assignTicket({ ticketId, assigneeId: newAssignee })).unwrap();
            toast.success('Ticket assigned');
            dispatch(fetchTicketDetail(ticketId));
        } catch {
            toast.error('Failed to assign ticket');
        }
    };

    const handleResolveTicket = async () => {
        try {
            await dispatch(updateTicketStatus({ ticketId, status: 'solved' })).unwrap();
            toast.success('Ticket resolved');
        } catch {
            toast.error('Failed to resolve ticket');
        }
    };

    // Comment editing handlers
    const handleEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingCommentText(comment.body);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const handleSmartReplyInsert = (text) => {
        setReplyText(text);
        replyEditorRef.current?.setContent(text);
        setIsInternal(false);
    };

    const handleSaveEdit = async (commentId) => {
        if (!editingCommentText.trim()) return;

        setSavingEdit(true);
        try {
            await dispatch(updateComment({
                ticketId,
                commentId,
                commentData: { body: editingCommentText },
            })).unwrap();
            toast.success('Note updated successfully');
            setEditingCommentId(null);
            setEditingCommentText('');
            dispatch(fetchTicketDetail(ticketId));
        } catch (error) {
            toast.error(error || 'Failed to update note');
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteComment = async () => {
        if (!commentToDelete) return;

        setDeletingCommentId(commentToDelete);
        setIsDeleteModalOpen(false);

        try {
            await dispatch(deleteComment({ ticketId, commentId: commentToDelete })).unwrap();
            toast.success('Note deleted successfully');
            dispatch(fetchTicketDetail(ticketId));
        } catch (error) {
            toast.error(error || 'Failed to delete note');
        } finally {
            setDeletingCommentId(null);
            setCommentToDelete(null);
        }
    };

    if (loading) {
        return (
            <PageContainer title="Loading...">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, gap: 2 }}>
                    <CircularProgress size={28} />
                    <Typography variant="body2" color="text.secondary">Loading ticket details...</Typography>
                </Box>
            </PageContainer>
        );
    }

    if (!ticket) {
        return (
            <PageContainer title="Ticket Not Found">
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>The requested ticket could not be found.</Typography>
                    <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
                </Box>
            </PageContainer>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRequesterName = () => {
        if (ticket.requester_id?.first_name) {
            return `${ticket.requester_id.first_name} ${ticket.requester_id.last_name}`;
        }
        return 'Unknown';
    };

    const getAssigneeName = () => {
        if (ticket.assignee_id?.first_name) {
            return `${ticket.assignee_id.first_name} ${ticket.assignee_id.last_name}`;
        }
        return null;
    };

    const getSentimentIcon = () => {
        if (!sentiment) return null;
        if (sentiment.label === 'Positive') return <Smile size={16} color="#22C55E" />;
        if (sentiment.label === 'Negative') return <Frown size={16} color="#EF4444" />;
        return <Meh size={16} color="#F59E0B" />;
    };

    const handleSubmitRating = async () => {
        if (selectedRating === 0) {
            toast.error('Please select a rating');
            return;
        }
        setSubmittingRating(true);
        try {
            const res = await ratingService.submitRating(ticketId, {
                rating: selectedRating,
                feedback: ratingFeedback,
            });
            if (res.success) {
                setExistingRating(res.data);
                toast.success(existingRating ? 'Rating updated' : 'Rating submitted');
            }
        } catch {
            toast.error('Failed to submit rating');
        } finally {
            setSubmittingRating(false);
        }
    };

    const renderStars = (interactive = false) => {
        const displayRating = interactive ? (hoverRating || selectedRating) : (existingRating?.rating || 0);
        return (
            <Stack direction="row" spacing={0.5} onMouseLeave={() => interactive && setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Box
                        key={star}
                        component="span"
                        sx={{
                            cursor: interactive ? 'pointer' : 'default',
                            display: 'inline-flex',
                            transition: 'transform 0.15s ease',
                            '&:hover': interactive ? { transform: 'scale(1.2)' } : {}
                        }}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onClick={() => interactive && setSelectedRating(star)}
                    >
                        <Star
                            size={interactive ? 26 : 20}
                            fill={star <= displayRating ? '#f59e0b' : 'none'}
                            stroke={star <= displayRating ? '#f59e0b' : 'currentColor'}
                        />
                    </Box>
                ))}
            </Stack>
        );
    };

    return (
        <PageContainer
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        component={Link}
                        to="/tickets"
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1.5,
                        }}
                    >
                        <ArrowLeft size={18} />
                    </IconButton>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', letterSpacing: 0.5 }}>
                                #{ticketId?.slice(-6).toUpperCase()}
                            </Typography>
                            {sentiment && (
                                <Chip
                                    icon={getSentimentIcon()}
                                    label={`${sentiment.label} ${sentiment.emoji || ''}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 22, fontSize: '0.75rem' }}
                                />
                            )}
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                            {ticket.subject}
                        </Typography>
                    </Box>
                </Box>
            }
            actions={
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button variant="outline" icon={FileText} onClick={handleSummarize} disabled={loadingSummary}>
                        {loadingSummary ? 'Summarizing...' : 'Summarize'}
                    </Button>
                    <Button variant="ghost" icon={RefreshCw} onClick={handleRefresh} />
                    <Button variant="secondary" icon={MoreHorizontal} />
                    <Button onClick={handleResolveTicket} disabled={ticket.status === 'solved'}>
                        {ticket.status === 'solved' ? 'Resolved' : 'Resolve Ticket'}
                    </Button>
                </Stack>
            }
        >
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCommentToDelete(null);
                }}
                title="Delete Note"
                size="small"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setCommentToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="danger"
                            onClick={confirmDeleteComment}
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <Typography variant="body2">Are you sure you want to delete this note? This action cannot be undone.</Typography>
            </Modal>

            {/* AI Smart Reply Modal */}
            <SmartReplyModal
                isOpen={isSmartReplyModalOpen}
                onClose={() => setIsSmartReplyModalOpen(false)}
                onApply={handleSmartReplyInsert}
                ticketId={ticketId}
            />

            {/* AI Summary Section */}
            {summary && (
                <Alert
                    severity="info"
                    icon={<Sparkles size={20} />}
                    sx={{ mb: 3 }}
                    action={
                        <Button variant="ghost" size="sm" onClick={() => setSummary(null)}>
                            Dismiss
                        </Button>
                    }
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>AI Summary</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{summary}</Typography>
                </Alert>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' },
                    gap: 3,
                    alignItems: 'start',
                }}
            >
                {/* Main Conversation Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        {/* Original ticket description as first message */}
                        <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Avatar name={getRequesterName()} size="sm" />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{getRequesterName()}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(ticket.createdAt)} · via {ticket.channel || 'Web'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>{ticket.subject}</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                                {ticket.description}
                            </Typography>
                        </Box>

                        {/* Comments/Replies */}
                        {comments.map((comment) => {
                            const isInternalNote = comment.public === false;
                            return (
                                <Box
                                    key={comment._id}
                                    sx={{
                                        p: 3,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: isInternalNote
                                            ? (theme) => theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(254, 243, 199, 0.4)'
                                            : 'background.paper',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Avatar
                                            name={comment.author_id?.first_name ? `${comment.author_id.first_name} ${comment.author_id.last_name}` : 'Unknown'}
                                            size="sm"
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {comment.author_id?.first_name ? `${comment.author_id.first_name} ${comment.author_id.last_name}` : 'Unknown'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(comment.createdAt)}
                                            </Typography>
                                        </Box>
                                        {isInternalNote && (
                                            <Chip
                                                icon={<Lock size={12} />}
                                                label="Internal Note"
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                                sx={{ height: 22, fontSize: '0.75rem' }}
                                            />
                                        )}
                                        {editingCommentId !== comment._id && (
                                            <Stack direction="row" spacing={0.5}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditComment(comment)}
                                                    title="Edit"
                                                >
                                                    <Edit size={14} />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    disabled={deletingCommentId === comment._id}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </IconButton>
                                            </Stack>
                                        )}
                                    </Box>

                                    {editingCommentId === comment._id ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            <RichTextEditor
                                                value={editingCommentText}
                                                onChange={setEditingCommentText}
                                                placeholder="Edit your comment..."
                                                compact
                                                minHeight="80px"
                                                maxHeight="250px"
                                            />
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleCancelEdit}
                                                    disabled={savingEdit}
                                                >
                                                    <X size={14} style={{ marginRight: 4 }} /> Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSaveEdit(comment._id)}
                                                    disabled={savingEdit || !editingCommentText || editingCommentText === '<p></p>'}
                                                >
                                                    <Check size={14} style={{ marginRight: 4 }} /> {savingEdit ? 'Saving...' : 'Save'}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: comment.body }}
                                        />
                                    )}
                                </Box>
                            );
                        })}

                        {/* Reply Form */}
                        <Box
                            component="form"
                            onSubmit={handleSubmitReply}
                            sx={{
                                p: 2.5,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                <ButtonBase
                                    onClick={() => setIsInternal(false)}
                                    sx={{
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: 1.5,
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        bgcolor: !isInternal ? 'primary.soft' : 'transparent',
                                        color: !isInternal ? 'primary.main' : 'text.secondary',
                                        gap: 1,
                                    }}
                                >
                                    <MessageSquare size={16} />
                                    Reply
                                </ButtonBase>
                                <ButtonBase
                                    onClick={() => setIsInternal(true)}
                                    sx={{
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: 1.5,
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        bgcolor: isInternal ? 'warning.light' : 'transparent',
                                        color: isInternal ? 'warning.dark' : 'text.secondary',
                                        gap: 1,
                                    }}
                                >
                                    <Lock size={16} />
                                    Internal Note
                                </ButtonBase>
                            </Stack>

                            <RichTextEditor
                                ref={replyEditorRef}
                                value={replyText}
                                onChange={setReplyText}
                                placeholder={isInternal ? "Add an internal note..." : "Type your reply..."}
                                minHeight="120px"
                                maxHeight="400px"
                                onSubmit={handleSubmitReply}
                            />

                            <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                                <Button
                                    variant="ghost"
                                    icon={Sparkles}
                                    type="button"
                                    onClick={() => setIsSmartReplyModalOpen(true)}
                                >
                                    AI Reply
                                </Button>
                                <Button type="submit" icon={Send} disabled={!replyText || replyText === '<p></p>' || submitting}>
                                    {submitting ? 'Sending...' : (isInternal ? 'Add Note' : 'Send Reply')}
                                </Button>
                            </Stack>
                        </Box>
                    </Card>
                </Box>

                {/* Sidebar Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* SLA Status */}
                    {(ticket.response_due_at || ticket.resolve_due_at) && (
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <CardHeader
                                title={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Clock size={16} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>SLA Status</Typography>
                                    </Stack>
                                }
                                sx={{ pb: 1 }}
                            />
                            <CardContent sx={{ pt: 0 }}>
                                <Stack spacing={2}>
                                    {ticket.response_due_at && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Response Due
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body2">{new Date(ticket.response_due_at).toLocaleString()}</Typography>
                                                {ticket.first_response_at ? (
                                                    new Date(ticket.first_response_at) <= new Date(ticket.response_due_at)
                                                        ? <Chip label="Responded" size="small" color="success" variant="outlined" sx={{ height: 20 }} />
                                                        : <Chip label="Breached" size="small" color="error" variant="outlined" sx={{ height: 20 }} />
                                                ) : new Date() > new Date(ticket.response_due_at) ? (
                                                    <Chip label="Overdue" size="small" color="error" sx={{ height: 20 }} />
                                                ) : (
                                                    <Chip label="On Track" size="small" color="success" variant="outlined" sx={{ height: 20 }} />
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                    {ticket.resolve_due_at && (
                                        <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Resolution Due
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body2">{new Date(ticket.resolve_due_at).toLocaleString()}</Typography>
                                                {ticket.solved_at ? (
                                                    new Date(ticket.solved_at) <= new Date(ticket.resolve_due_at)
                                                        ? <Chip label="Resolved" size="small" color="success" variant="outlined" sx={{ height: 20 }} />
                                                        : <Chip label="Breached" size="small" color="error" variant="outlined" sx={{ height: 20 }} />
                                                ) : new Date() > new Date(ticket.resolve_due_at) ? (
                                                    <Chip label="Overdue" size="small" color="error" sx={{ height: 20 }} />
                                                ) : (
                                                    <Chip label="On Track" size="small" color="success" variant="outlined" sx={{ height: 20 }} />
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Properties Card */}
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardHeader
                            title={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Properties</Typography>}
                            sx={{ pb: 1 }}
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Status</Typography>
                                    <Dropdown
                                        value={ticket.status}
                                        onChange={handleStatusChange}
                                        items={statusWithDots}
                                        trigger={(selected) => (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {selected?.dotColor && (
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: selected.dotColor }} />
                                                )}
                                                <Typography variant="body2">{selected?.label || 'Select status'}</Typography>
                                                <ChevronDown size={14} style={{ opacity: 0.5 }} />
                                            </Stack>
                                        )}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Priority</Typography>
                                    <Dropdown
                                        value={ticket.priority}
                                        onChange={handlePriorityChange}
                                        items={priorityWithDots}
                                        trigger={(selected) => (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {selected?.dotColor && (
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: selected.dotColor }} />
                                                )}
                                                <Typography variant="body2">{selected?.label || 'Select priority'}</Typography>
                                                <ChevronDown size={14} style={{ opacity: 0.5 }} />
                                            </Stack>
                                        )}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Assigned To</Typography>
                                    <Dropdown
                                        value={ticket.assignee_id?._id || ''}
                                        onChange={handleAssigneeChange}
                                        items={[
                                            { value: '', label: 'Unassigned' },
                                            ...agents,
                                        ]}
                                        trigger={(selected) => (
                                            <Typography variant="body2">{selected?.label || 'Unassigned'}</Typography>
                                        )}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">Type</Typography>
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{ticket.type || 'Question'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">Channel</Typography>
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{ticket.channel || 'Web'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">Created</Typography>
                                    <Typography variant="body2">{formatDate(ticket.createdAt)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">Updated</Typography>
                                    <Typography variant="body2">{formatDate(ticket.updatedAt)}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Tags Card */}
                    {ticket.tags && ticket.tags.length > 0 && (
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <CardHeader
                                title={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Tags</Typography>}
                                sx={{ pb: 1 }}
                            />
                            <CardContent sx={{ pt: 0 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {ticket.tags.map((tag, index) => (
                                        <Chip key={index} label={tag} size="small" variant="outlined" />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Agent Rating Card */}
                    {(ticket.status === 'solved' || ticket.status === 'closed') && ticket.assignee_id && (
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <CardHeader
                                title={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Star size={16} color="#F59E0B" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Rate Agent</Typography>
                                    </Stack>
                                }
                                sx={{ pb: 1 }}
                            />
                            <CardContent sx={{ pt: 0 }}>
                                <Stack spacing={1.5} alignItems="center">
                                    <Typography variant="body2" textAlign="center">
                                        How was <strong>{getAssigneeName() || 'the agent'}</strong>?
                                    </Typography>
                                    {renderStars(true)}
                                    <OutlinedInput
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Optional feedback..."
                                        value={ratingFeedback}
                                        onChange={(e) => setRatingFeedback(e.target.value)}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleSubmitRating}
                                        disabled={submittingRating || selectedRating === 0}
                                        style={{ width: '100%' }}
                                    >
                                        {submittingRating ? 'Submitting...' : (existingRating ? 'Update Rating' : 'Submit Rating')}
                                    </Button>
                                    {existingRating && (
                                        <Typography variant="caption" color="text.secondary">
                                            You rated {existingRating.rating}/5
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Requester Info Card */}
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardHeader
                            title={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Requester</Typography>}
                            sx={{ pb: 1 }}
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                <Avatar name={getRequesterName()} size="lg" />
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{getRequesterName()}</Typography>
                                    {ticket.requester_id?.email && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {ticket.requester_id.email}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            {ticket.requester_id?.phone && (
                                <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                                    <Typography variant="body2">{ticket.requester_id.phone}</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </PageContainer>
    );
}

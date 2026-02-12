import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Send,
    Paperclip,
    MoreHorizontal,
    Clock,
    User,
    Tag,
    MessageSquare,
    Lock,
    RefreshCw,
    Edit,
    Trash2,
    X,
    Check
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Select, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
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
import { toast } from 'react-hot-toast';
import './TicketDetail.css';

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

    useEffect(() => {
        dispatch(fetchTicketDetail(ticketId));
        dispatch(fetchAgents());

        return () => {
            dispatch(clearTicketDetail());
        };
    }, [dispatch, ticketId]);

    const handleRefresh = () => dispatch(fetchTicketDetail(ticketId));

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            await dispatch(addComment({
                ticketId,
                commentData: { body: replyText, public: !isInternal },
            })).unwrap();
            toast.success(isInternal ? 'Note added' : 'Reply sent');
            setReplyText('');
            dispatch(fetchTicketDetail(ticketId));
        } catch (error) {
            toast.error(error || 'Failed to send reply');
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await dispatch(updateTicketStatus({ ticketId, status: newStatus })).unwrap();
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handlePriorityChange = async (e) => {
        const newPriority = e.target.value;
        try {
            await dispatch(updateTicketPriority({ ticketId, priority: newPriority })).unwrap();
            toast.success('Priority updated');
        } catch (error) {
            toast.error('Failed to update priority');
        }
    };

    const handleAssigneeChange = async (e) => {
        const newAssignee = e.target.value;
        try {
            await dispatch(assignTicket({ ticketId, assigneeId: newAssignee })).unwrap();
            toast.success('Ticket assigned');
            dispatch(fetchTicketDetail(ticketId));
        } catch (error) {
            toast.error('Failed to assign ticket');
        }
    };

    const handleResolveTicket = async () => {
        try {
            await dispatch(updateTicketStatus({ ticketId, status: 'solved' })).unwrap();
            toast.success('Ticket resolved');
        } catch (error) {
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
                <div className="loading-state">Loading ticket details...</div>
            </PageContainer>
        );
    }

    if (!ticket) {
        return (
            <PageContainer title="Ticket Not Found">
                <div className="error-state">
                    <p>The requested ticket could not be found.</p>
                    <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
                </div>
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

    return (
        <PageContainer
            title={
                <div className="ticket-header">
                    <Link to="/tickets" className="back-link">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="ticket-header-info">
                        <span className="ticket-id">#{ticketId?.slice(-6).toUpperCase()}</span>
                        <h1 className="ticket-subject">{ticket.subject}</h1>
                    </div>
                </div>
            }
            actions={
                <>
                    <Button variant="ghost" icon={RefreshCw} onClick={handleRefresh} />
                    <Button variant="secondary" icon={MoreHorizontal} />
                    <Button onClick={handleResolveTicket} disabled={ticket.status === 'solved'}>
                        {ticket.status === 'solved' ? 'Resolved' : 'Resolve Ticket'}
                    </Button>
                </>
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
                <p>Are you sure you want to delete this note? This action cannot be undone.</p>
            </Modal>

            <div className="ticket-detail">
                {/* Main Content */}
                <div className="ticket-main">
                    {/* Original Description */}
                    <Card padding="none" className="conversation-card">
                        <div className="conversation-list">
                            {/* Original ticket description as first message */}
                            <div className="conversation-message customer">
                                <div className="message-header">
                                    <Avatar name={getRequesterName()} size="sm" />
                                    <div className="message-meta">
                                        <span className="message-author">{getRequesterName()}</span>
                                        <span className="message-time">{formatDate(ticket.createdAt)}</span>
                                        <span className="message-via">via {ticket.channel || 'Web'}</span>
                                    </div>
                                </div>
                                <div className="message-content">
                                    <strong>{ticket.subject}</strong>
                                    <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                                </div>
                            </div>

                            {/* Comments/Replies */}
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className={`conversation-message ${comment.public === false ? 'internal' : (comment.author_id?._id === ticket.requester_id?._id ? 'customer' : 'agent')}`}
                                >
                                    <div className="message-header">
                                        <Avatar name={comment.author_id?.first_name ? `${comment.author_id.first_name} ${comment.author_id.last_name}` : 'Unknown'} size="sm" />
                                        <div className="message-meta">
                                            <span className="message-author">
                                                {comment.author_id?.first_name ? `${comment.author_id.first_name} ${comment.author_id.last_name}` : 'Unknown'}
                                            </span>
                                            <span className="message-time">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        {comment.public === false && (
                                            <span className="internal-badge">
                                                <Lock size={12} />
                                                Internal Note
                                            </span>
                                        )}
                                        {/* Edit/Delete buttons - only show for comments, not when editing */}
                                        {editingCommentId !== comment._id && (
                                            <div className="message-actions">
                                                <button
                                                    type="button"
                                                    className="message-action-btn"
                                                    onClick={() => handleEditComment(comment)}
                                                    title="Edit"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="message-action-btn danger"
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    disabled={deletingCommentId === comment._id}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="message-content">
                                        {editingCommentId === comment._id ? (
                                            <div className="edit-comment-form">
                                                <textarea
                                                    value={editingCommentText}
                                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                                    rows={3}
                                                    className="edit-comment-textarea"
                                                />
                                                <div className="edit-comment-actions">
                                                    <button
                                                        type="button"
                                                        className="edit-action-btn cancel"
                                                        onClick={handleCancelEdit}
                                                        disabled={savingEdit}
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="edit-action-btn save"
                                                        onClick={() => handleSaveEdit(comment._id)}
                                                        disabled={savingEdit || !editingCommentText.trim()}
                                                    >
                                                        <Check size={14} /> {savingEdit ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            comment.body
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        <form className="reply-form" onSubmit={handleSubmitReply}>
                            <div className="reply-tabs">
                                <button
                                    type="button"
                                    className={`reply-tab ${!isInternal ? 'active' : ''}`}
                                    onClick={() => setIsInternal(false)}
                                >
                                    <MessageSquare size={16} />
                                    Reply
                                </button>
                                <button
                                    type="button"
                                    className={`reply-tab ${isInternal ? 'active' : ''}`}
                                    onClick={() => setIsInternal(true)}
                                >
                                    <Lock size={16} />
                                    Internal Note
                                </button>
                            </div>
                            <Textarea
                                placeholder={isInternal ? "Add an internal note..." : "Type your reply..."}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                            />
                            <div className="reply-actions">
                                <Button variant="ghost" icon={Paperclip} type="button">
                                    Attach
                                </Button>
                                <Button type="submit" icon={Send} disabled={!replyText.trim() || submitting}>
                                    {submitting ? 'Sending...' : (isInternal ? 'Add Note' : 'Send Reply')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Sidebar */}
                <aside className="ticket-sidebar">
                    {/* Properties */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Properties</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="property-list">
                                <div className="property-item">
                                    <label>Status</label>
                                    <Select
                                        options={getStatusOptions()}
                                        value={ticket.status}
                                        onChange={handleStatusChange}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Priority</label>
                                    <Select
                                        options={getPriorityOptions()}
                                        value={ticket.priority}
                                        onChange={handlePriorityChange}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Assigned To</label>
                                    <Select
                                        options={[{ value: '', label: 'Unassigned' }, ...agents]}
                                        value={ticket.assignee_id?._id || ''}
                                        onChange={handleAssigneeChange}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Type</label>
                                    <span className="property-value" style={{ textTransform: 'capitalize' }}>{ticket.type || 'Question'}</span>
                                </div>
                                <div className="property-item">
                                    <label>Channel</label>
                                    <span className="property-value" style={{ textTransform: 'capitalize' }}>{ticket.channel || 'Web'}</span>
                                </div>
                                <div className="property-item">
                                    <label>Created</label>
                                    <span className="property-value">{formatDate(ticket.createdAt)}</span>
                                </div>
                                <div className="property-item">
                                    <label>Updated</label>
                                    <span className="property-value">{formatDate(ticket.updatedAt)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {ticket.tags && ticket.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="tags-list">
                                    {ticket.tags.map((tag, index) => (
                                        <span key={index} className="tag-badge">{tag}</span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Requester Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Requester</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="customer-info">
                                <div className="customer-header">
                                    <Avatar name={getRequesterName()} size="lg" />
                                    <div>
                                        <h4>{getRequesterName()}</h4>
                                        {ticket.requester_id?.email && (
                                            <span>{ticket.requester_id.email}</span>
                                        )}
                                    </div>
                                </div>
                                {ticket.requester_id?.phone && (
                                    <div className="customer-details">
                                        <div className="detail-item">
                                            <label>Phone</label>
                                            <span>{ticket.requester_id.phone}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </PageContainer>
    );
}

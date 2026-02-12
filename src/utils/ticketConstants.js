// Ticket status enum (matches backend)
export const TICKET_STATUS = {
    NEW: 'new',
    OPEN: 'open',
    PENDING: 'pending',
    ON_HOLD: 'hold',
    SOLVED: 'solved',
    CLOSED: 'closed',
};

// Ticket priority enum (matches backend)
export const TICKET_PRIORITY = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
};

// Ticket type enum (matches backend)
export const TICKET_TYPE = {
    QUESTION: 'question',
    INCIDENT: 'incident',
    PROBLEM: 'problem',
    TASK: 'task',
};

// Ticket channel enum (matches backend)
export const TICKET_CHANNEL = {
    EMAIL: 'email',
    WEB: 'web',
    API: 'api',
    CHAT: 'chat',
    PHONE: 'phone',
};

// Helper functions to get options for dropdowns
export const getStatusOptions = () => [
    { value: TICKET_STATUS.NEW, label: 'New' },
    { value: TICKET_STATUS.OPEN, label: 'Open' },
    { value: TICKET_STATUS.PENDING, label: 'Pending' },
    { value: TICKET_STATUS.ON_HOLD, label: 'On Hold' },
    { value: TICKET_STATUS.SOLVED, label: 'Solved' },
    { value: TICKET_STATUS.CLOSED, label: 'Closed' },
];

export const getPriorityOptions = () => [
    { value: TICKET_PRIORITY.LOW, label: 'Low' },
    { value: TICKET_PRIORITY.NORMAL, label: 'Normal' },
    { value: TICKET_PRIORITY.HIGH, label: 'High' },
    { value: TICKET_PRIORITY.URGENT, label: 'Urgent' },
];

export const getTypeOptions = () => [
    { value: TICKET_TYPE.QUESTION, label: 'Question' },
    { value: TICKET_TYPE.INCIDENT, label: 'Incident' },
    { value: TICKET_TYPE.PROBLEM, label: 'Problem' },
    { value: TICKET_TYPE.TASK, label: 'Task' },
];

export const getFilterStatusOptions = () => [
    { value: 'all', label: 'All Status' },
    ...getStatusOptions(),
];

export const getFilterPriorityOptions = () => [
    { value: 'all', label: 'All Priority' },
    ...getPriorityOptions(),
];

// Status color mapping for badges
export const getStatusColor = (status) => {
    const colors = {
        [TICKET_STATUS.NEW]: 'info',
        [TICKET_STATUS.OPEN]: 'warning',
        [TICKET_STATUS.PENDING]: 'secondary',
        [TICKET_STATUS.ON_HOLD]: 'secondary',
        [TICKET_STATUS.SOLVED]: 'success',
        [TICKET_STATUS.CLOSED]: 'default',
    };
    return colors[status] || 'default';
};

// Priority color mapping for badges
export const getPriorityColor = (priority) => {
    const colors = {
        [TICKET_PRIORITY.LOW]: 'success',
        [TICKET_PRIORITY.NORMAL]: 'info',
        [TICKET_PRIORITY.HIGH]: 'warning',
        [TICKET_PRIORITY.URGENT]: 'danger',
    };
    return colors[priority] || 'default';
};

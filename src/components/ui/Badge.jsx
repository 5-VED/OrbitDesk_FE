import './Badge.css';

const variantMap = {
    default: 'badge-default',
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    className = '',
    ...props
}) {
    return (
        <span
            className={`badge badge-${size} ${variantMap[variant]} ${className}`}
            {...props}
        >
            {dot && <span className="badge-dot" />}
            {children}
        </span>
    );
}

// Status-specific badges for convenience
export function StatusBadge({ status }) {
    const statusConfig = {
        new: { label: 'New', variant: 'info' },
        open: { label: 'Open', variant: 'primary' },
        pending: { label: 'Pending', variant: 'warning' },
        hold: { label: 'On Hold', variant: 'default' },
        solved: { label: 'Solved', variant: 'success' },
        closed: { label: 'Closed', variant: 'default' },
        // Legacy support
        resolved: { label: 'Resolved', variant: 'success' },
        overdue: { label: 'Overdue', variant: 'danger' },
    };

    const config = statusConfig[status] || { label: status || 'Unknown', variant: 'default' };

    return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }) {
    const priorityConfig = {
        low: { label: 'Low', variant: 'default' },
        normal: { label: 'Normal', variant: 'info' },
        high: { label: 'High', variant: 'warning' },
        urgent: { label: 'Urgent', variant: 'danger' },
        // Legacy support
        medium: { label: 'Medium', variant: 'info' },
    };

    const config = priorityConfig[priority] || { label: priority || 'Unknown', variant: 'default' };

    return <Badge variant={config.variant}>{config.label}</Badge>;
}

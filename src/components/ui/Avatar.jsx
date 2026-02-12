import './Avatar.css';

const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
};

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

function stringToColor(str) {
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
    src,
    name,
    size = 'md',
    status,
    className = '',
    ...props
}) {
    const dimension = sizeMap[size];
    const initials = getInitials(name);
    const bgColor = stringToColor(name || 'default');

    return (
        <div
            className={`avatar avatar-${size} ${className}`}
            style={{ width: dimension, height: dimension }}
            {...props}
        >
            {src ? (
                <img src={src} alt={name || 'Avatar'} className="avatar-image" />
            ) : (
                <div className="avatar-fallback" style={{ backgroundColor: bgColor }}>
                    {initials}
                </div>
            )}
            {status && <span className={`avatar-status avatar-status-${status}`} />}
        </div>
    );
}

export function AvatarGroup({ children, max = 4, size = 'md' }) {
    const avatars = Array.isArray(children) ? children : [children];
    const visible = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
        <div className="avatar-group">
            {visible}
            {remaining > 0 && (
                <div className={`avatar avatar-${size} avatar-overflow`}>
                    <div className="avatar-fallback">+{remaining}</div>
                </div>
            )}
        </div>
    );
}

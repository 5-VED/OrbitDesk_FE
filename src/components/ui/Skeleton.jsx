import './Skeleton.css';

export function Skeleton({ width, height, borderRadius, className = '', variant = 'rectangular' }) {
    const style = {
        width: width || '100%',
        height: height || '16px',
        borderRadius: borderRadius || (variant === 'circular' ? '50%' : 'var(--radius-md)'),
    };

    return <div className={`skeleton ${className}`} style={style} />;
}

export function SkeletonCard({ lines = 3 }) {
    return (
        <div className="skeleton-card">
            <div className="skeleton-card-header">
                <Skeleton variant="circular" width="48px" height="48px" />
                <div className="skeleton-card-text">
                    <Skeleton width="60%" height="14px" />
                    <Skeleton width="40%" height="12px" />
                </div>
            </div>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} width={i === lines - 1 ? '70%' : '100%'} height="12px" />
            ))}
        </div>
    );
}

export function SkeletonStatCards({ count = 4 }) {
    return (
        <div className="skeleton-stats-grid">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton-stat-card">
                    <Skeleton variant="circular" width="48px" height="48px" borderRadius="var(--radius-lg)" />
                    <div className="skeleton-stat-text">
                        <Skeleton width="80px" height="12px" />
                        <Skeleton width="50px" height="24px" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
    return (
        <div className="skeleton-table">
            <div className="skeleton-table-header">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} height="14px" width={`${60 + Math.random() * 40}%`} />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="skeleton-table-row">
                    {Array.from({ length: cols }).map((_, colIdx) => (
                        <Skeleton key={colIdx} height="12px" width={`${50 + Math.random() * 50}%`} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonDashboard() {
    return (
        <div className="skeleton-dashboard">
            <SkeletonStatCards count={4} />
            <div className="skeleton-dashboard-grid">
                <SkeletonCard lines={5} />
                <SkeletonCard lines={3} />
                <SkeletonCard lines={2} />
            </div>
        </div>
    );
}

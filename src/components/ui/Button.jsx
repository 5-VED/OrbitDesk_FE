import './Button.css';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className="btn-spinner" />}
            {Icon && iconPosition === 'left' && !loading && <Icon size={size === 'sm' ? 14 : 16} />}
            {children && <span>{children}</span>}
            {Icon && iconPosition === 'right' && !loading && <Icon size={size === 'sm' ? 14 : 16} />}
        </button>
    );
}

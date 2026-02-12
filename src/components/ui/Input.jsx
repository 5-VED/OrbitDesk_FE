import './Input.css';

export function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    hint,
    icon: Icon,
    disabled = false,
    required = false,
    className = '',
    id,
    suffix,
    ...props
}) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className={`input-container ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}>
                {Icon && <Icon size={18} className="input-icon" />}
                <input
                    id={inputId}
                    type={type}
                    className="input-field"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
                {suffix && <div className="input-suffix">{suffix}</div>}
            </div>
            {(error || hint) && (
                <span className={`input-message ${error ? 'input-message-error' : ''}`}>
                    {error || hint}
                </span>
            )}
        </div>
    );
}

export function Textarea({
    label,
    placeholder,
    value,
    onChange,
    error,
    hint,
    disabled = false,
    required = false,
    rows = 4,
    className = '',
    id,
    ...props
}) {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <textarea
                id={inputId}
                className={`textarea-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                rows={rows}
                {...props}
            />
            {(error || hint) && (
                <span className={`input-message ${error ? 'input-message-error' : ''}`}>
                    {error || hint}
                </span>
            )}
        </div>
    );
}

export function Select({
    label,
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    error,
    disabled = false,
    required = false,
    className = '',
    id,
    ...props
}) {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <select
                id={inputId}
                className={`select-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="input-message input-message-error">{error}</span>}
        </div>
    );
}

import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import './Modal.css';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
    isOpen,
    onClose,
    title,
    eyebrow,
    iconChip,
    children,
    footer,
    size = 'medium',
    closeOnOverlay = true,
    closeOnEsc = true,
}) {
    const overlayRef = useRef(null);
    const containerRef = useRef(null);
    const previousFocus = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (closeOnEsc && e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key === 'Tab' && containerRef.current) {
            const focusable = containerRef.current.querySelectorAll(FOCUSABLE);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }, [closeOnEsc, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        previousFocus.current = document.activeElement;
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        const raf = requestAnimationFrame(() => {
            if (containerRef.current) {
                const first = containerRef.current.querySelector(FOCUSABLE);
                first?.focus();
            }
        });

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            previousFocus.current?.focus();
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
        >
            <div className={`modal-container modal-${size}`} ref={containerRef}>
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                >
                    <X size={16} />
                </button>

                {(eyebrow || iconChip) && (
                    <div className="modal-eyebrow-row">
                        {iconChip && (
                            <span className={`modal-icon-chip modal-icon-chip-${iconChip.variant}`}>
                                <iconChip.icon size={16} />
                            </span>
                        )}
                        {eyebrow && <span className="modal-eyebrow">{eyebrow}</span>}
                    </div>
                )}

                {title && (
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                    </div>
                )}

                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

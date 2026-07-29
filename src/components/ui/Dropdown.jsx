import { useState, useRef, useEffect, useCallback } from 'react';
import './Dropdown.css';

export function Dropdown({
    trigger,
    items = [],
    value,
    onChange,
    align = 'start',
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const panelRef = useRef(null);
    const triggerRef = useRef(null);
    const itemRefs = useRef([]);
    const selectedRef = useRef(null);

    const flatItems = items.reduce((acc, group) => {
        if (group.items) {
            return [...acc, ...group.items];
        }
        return [...acc, group];
    }, []);

    const selectedItem = flatItems.find(item => item.value === value);

    const handleTriggerClick = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleItemClick = useCallback((item) => {
        if (item.disabled) return;
        onChange?.(item.value);
        setIsOpen(false);
    }, [onChange]);

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        const enabledItems = flatItems.filter(item => !item.disabled);
        const maxIndex = enabledItems.length - 1;

        switch (e.key) {
            case 'ArrowDown': {
                e.preventDefault();
                setActiveIndex(prev => (prev < maxIndex ? prev + 1 : 0));
                break;
            }
            case 'ArrowUp': {
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
                break;
            }
            case 'Enter':
            case ' ': {
                e.preventDefault();
                const item = enabledItems[activeIndex];
                if (item) handleItemClick(item);
                break;
            }
            case 'Escape': {
                e.preventDefault();
                setIsOpen(false);
                triggerRef.current?.focus();
                break;
            }
        }
    }, [isOpen, flatItems, activeIndex, handleItemClick]);

    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(-1);
            return;
        }

        const idx = flatItems.findIndex(item => item.value === value && !item.disabled);
        setActiveIndex(idx >= 0 ? idx : 0);

        const raf = requestAnimationFrame(() => {
            if (selectedRef.current) {
                selectedRef.current.scrollIntoView({ block: 'nearest' });
            }
        });

        return () => cancelAnimationFrame(raf);
    }, [isOpen, flatItems, value]);

    useEffect(() => {
        if (!isOpen) return;

        document.addEventListener('keydown', handleKeyDown);

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
            itemRefs.current[activeIndex].scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    const renderItem = (item, idx) => {
        const isSelected = item.value === value;
        const isActive = activeIndex === idx;
        const classes = [
            'dropdown-item',
            isSelected && 'dropdown-item-selected',
            isActive && 'dropdown-item-active',
            item.destructive && 'dropdown-item-destructive',
            item.disabled && 'dropdown-item-disabled',
        ].filter(Boolean).join(' ');

        return (
            <button
                key={item.value || idx}
                type="button"
                className={classes}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                ref={el => { itemRefs.current[idx] = el; }}
                role="option"
                aria-selected={isSelected}
                id={`dropdown-option-${item.value}`}
            >
                {item.dotColor && (
                    <span
                        className="dropdown-item-dot"
                        style={{ backgroundColor: item.dotColor }}
                        aria-hidden="true"
                    />
                )}
                <span className="dropdown-item-label">{item.label}</span>
                {isSelected && (
                    <span className="dropdown-item-check" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                )}
            </button>
        );
    };

    return (
        <div
            className={`dropdown-container ${className}`}
            ref={containerRef}
            onKeyDown={handleKeyDown}
        >
            <div
                ref={triggerRef}
                className={`dropdown-trigger ${isOpen ? 'dropdown-trigger-open' : ''}`}
                onClick={handleTriggerClick}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls="dropdown-panel"
                tabIndex={0}
            >
                {trigger(selectedItem)}
            </div>

            {isOpen && (
                <div
                    id="dropdown-panel"
                    className={`dropdown-panel dropdown-align-${align}`}
                    ref={panelRef}
                    role="listbox"
                >
                    {items.map((group, gi) => {
                        if (group.items) {
                            return (
                                <div key={group.label || gi}>
                                    {group.label && (
                                        <div className="dropdown-group-label">{group.label}</div>
                                    )}
                                    {group.items.map((item, ii) => {
                                        const globalIdx = flatItems.indexOf(item);
                                        return renderItem(item, globalIdx);
                                    })}
                                </div>
                            );
                        }
                        const globalIdx = flatItems.indexOf(group);
                        return (
                            <div key={group.value || gi}>
                                {group.divider && <div className="dropdown-divider" />}
                                {renderItem(group, globalIdx)}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

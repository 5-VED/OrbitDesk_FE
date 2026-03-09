import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import './PageContainer.css';

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e) => setIsMobile(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [breakpoint]);
    return isMobile;
}

export function PageContainer({ children, title, actions }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useIsMobile();
    const location = useLocation();

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const toggleSidebar = useCallback(() => {
        if (isMobile) {
            setMobileOpen(prev => !prev);
        } else {
            setCollapsed(prev => !prev);
        }
    }, [isMobile]);

    const closeMobileSidebar = useCallback(() => setMobileOpen(false), []);

    return (
        <div className="page-layout">
            {isMobile && mobileOpen && (
                <div className="sidebar-overlay" onClick={closeMobileSidebar} />
            )}
            <Sidebar
                collapsed={isMobile ? false : collapsed}
                onToggle={toggleSidebar}
                mobileOpen={mobileOpen}
                isMobile={isMobile}
            />
            <TopNavbar
                collapsed={isMobile ? false : collapsed}
                onMenuToggle={toggleSidebar}
                isMobile={isMobile}
            />
            <main className={`page-main ${collapsed && !isMobile ? 'expanded' : ''}`}>
                {(title || actions) && (
                    <div className="page-header">
                        {title && <h1 className="page-title">{title}</h1>}
                        {actions && <div className="page-actions">{actions}</div>}
                    </div>
                )}
                <motion.div
                    className="page-content"
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}

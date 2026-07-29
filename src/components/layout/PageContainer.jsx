import { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import './PageContainer.css';

export function PageContainer({ children, title, actions }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);

    const toggleMobile = useCallback(() => {
        setMobileOpen(prev => !prev);
    }, []);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
    }, []);

    return (
        <div className="page-layout">
            <Sidebar
                collapsed={collapsed}
                onToggle={toggleSidebar}
                mobileOpen={mobileOpen}
                onMobileClose={closeMobile}
            />
            {mobileOpen && <div className="sidebar-backdrop" onClick={closeMobile} />}
            <TopNavbar collapsed={collapsed} onToggleMobile={toggleMobile} />
            <main className={`page-main ${collapsed ? 'expanded' : ''}`}>
                {(title || actions) && (
                    <div className="page-header">
                        {title && <h1 className="page-title">{title}</h1>}
                        {actions && <div className="page-actions">{actions}</div>}
                    </div>
                )}
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

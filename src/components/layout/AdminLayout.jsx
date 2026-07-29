import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import './AdminLayout.css';

export function AdminLayout() {
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
        <div className="admin-layout">
            <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} mobileOpen={mobileOpen} onMobileClose={closeMobile} />
            {mobileOpen && <div className="admin-sidebar-backdrop" onClick={closeMobile} />}
            <AdminTopbar collapsed={collapsed} onToggleMobile={toggleMobile} />
            <main className={`admin-main ${collapsed ? 'expanded' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}

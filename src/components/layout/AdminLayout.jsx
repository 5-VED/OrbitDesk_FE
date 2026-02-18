import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import './AdminLayout.css';

export function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="admin-layout">
            <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} />
            <AdminTopbar collapsed={collapsed} />
            <main className={`admin-main ${collapsed ? 'expanded' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}

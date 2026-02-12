import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import './PageContainer.css';

export function PageContainer({ children, title, actions }) {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="page-layout">
            <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
            <TopNavbar collapsed={collapsed} />
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

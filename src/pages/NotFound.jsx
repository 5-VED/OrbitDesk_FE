import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, LayoutDashboard, Ticket, Users, BookOpen, AlertTriangle } from 'lucide-react';
import './NotFound.css';

export function NotFound() {
    const location = useLocation();
    const navigate = useNavigate();

    const quickLinks = [
        { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { label: 'Tickets', to: '/tickets', icon: Ticket },
        { label: 'Agents', to: '/agents', icon: Users },
        { label: 'Knowledge Base', to: '/knowledge-base', icon: BookOpen },
    ];

    return (
        <div className="not-found-page">
            {/* Animated background grid */}
            <div className="not-found-bg" aria-hidden="true" />

            {/* Floating color orbs */}
            <div className="not-found-orb not-found-orb-1" aria-hidden="true" />
            <div className="not-found-orb not-found-orb-2" aria-hidden="true" />
            <div className="not-found-orb not-found-orb-3" aria-hidden="true" />

            <main className="not-found-content" role="main">
                <div className="not-found-card">
                    {/* Large 404 text */}
                    <div className="not-found-number" aria-label="Error 404">
                        <span className="not-found-digit">4</span>
                        <span className="not-found-digit">0</span>
                        <span className="not-found-digit">4</span>
                    </div>

                    <div className="not-found-divider" />

                    {/* Icon */}
                    <div className="not-found-icon-wrap" aria-hidden="true">
                        <AlertTriangle size={32} strokeWidth={1.5} />
                    </div>

                    {/* Heading */}
                    <h1 className="not-found-title">Page Not Found</h1>
                    <p className="not-found-subtitle">
                        The page you're looking for doesn't exist or has been moved.
                        Double-check the URL or navigate back to a known page.
                    </p>

                    {/* Requested URL badge */}
                    <div className="not-found-url-badge" title={location.pathname} aria-label={`Requested path: ${location.pathname}`}>
                        <AlertTriangle size={12} />
                        <span>{location.pathname}</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="not-found-actions">
                        <button
                            id="nf-go-back-btn"
                            className="nf-btn-secondary"
                            onClick={() => navigate(-1)}
                            aria-label="Go back to previous page"
                        >
                            <ArrowLeft size={16} />
                            Go Back
                        </button>
                        <Link
                            id="nf-home-btn"
                            to="/dashboard"
                            className="nf-btn-primary"
                            aria-label="Return to dashboard"
                        >
                            <Home size={16} />
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Quick navigation chips */}
                    <div className="not-found-links">
                        <p className="not-found-links-label">Quick Navigation</p>
                        <nav className="not-found-links-grid" aria-label="Quick links">
                            {quickLinks.map(({ label, to, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="not-found-link-chip"
                                    aria-label={`Navigate to ${label}`}
                                >
                                    <Icon size={12} />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </main>
        </div>
    );
}

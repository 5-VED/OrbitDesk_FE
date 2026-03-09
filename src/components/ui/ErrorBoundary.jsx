import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                }}>
                    <AlertTriangle size={48} style={{ color: 'var(--color-warning)', marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 24px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        <RefreshCw size={16} />
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

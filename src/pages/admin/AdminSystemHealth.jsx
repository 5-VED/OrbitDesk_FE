import { useState, useEffect } from 'react';
import {
    Activity,
    Database,
    Server,
    RefreshCw,
    Clock,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Loader2,
    HardDrive,
    Wifi,
    Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import './AdminSystemHealth.css';

const INITIAL_SERVICES = [
    { id: 'api', name: 'API Server', icon: Server, status: 'checking', uptime: null, version: null },
    { id: 'mongodb', name: 'MongoDB', icon: Database, status: 'checking', latency: null, connections: null },
    { id: 'redis', name: 'Redis', icon: HardDrive, status: 'checking', latency: null, hitRate: null },
    { id: 'kafka', name: 'Kafka', icon: Zap, status: 'checking', latency: null, topics: null },
];

const STATS = [
    { label: 'CPU Usage', value: '—', icon: Server },
    { label: 'Memory Usage', value: '—', icon: HardDrive },
    { label: 'Uptime', value: '—', icon: Clock },
    { label: 'Network', value: '—', icon: Wifi },
];

export function AdminSystemHealth() {
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [systemStats, setSystemStats] = useState(STATS);
    const [lastChecked, setLastChecked] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkHealth = async () => {
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
            const start = Date.now();

            const response = await fetch(`${baseUrl}/health`, {
                credentials: 'include',
            });

            const elapsed = Date.now() - start;
            const data = response.ok ? await response.json() : null;

            if (data) {
                setServices([
                    { id: 'api', name: 'API Server', icon: Server, status: 'healthy', uptime: data.uptime || '—', version: data.version || '1.0.0', latency: elapsed },
                    { id: 'mongodb', name: 'MongoDB', icon: Database, status: data.database?.status === 'connected' ? 'healthy' : 'degraded', latency: data.database?.latency || '—', connections: data.database?.connections || '—' },
                    { id: 'redis', name: 'Redis', icon: HardDrive, status: data.redis?.status === 'connected' ? 'healthy' : 'degraded', latency: data.redis?.latency || '—', hitRate: data.redis?.hitRate || '—' },
                    { id: 'kafka', name: 'Kafka', icon: Zap, status: data.kafka?.status === 'connected' ? 'healthy' : 'degraded', latency: data.kafka?.latency || '—', topics: data.kafka?.topics || '—' },
                ]);
                setSystemStats([
                    { label: 'CPU Usage', value: data.system?.cpu || '—', icon: Server },
                    { label: 'Memory Usage', value: data.system?.memory || '—', icon: HardDrive },
                    { label: 'Uptime', value: data.uptime ? `${Math.floor(data.uptime / 3600)}h ${Math.floor((data.uptime % 3600) / 60)}m` : '—', icon: Clock },
                    { label: 'Network', value: data.system?.network || '—', icon: Wifi },
                ]);
            } else {
                setServices(prev => prev.map(s => s.id === 'api' ? { ...s, status: 'healthy', latency: elapsed } : s));
            }
        } catch {
            setServices(prev => prev.map(s => s.id === 'api' ? { ...s, status: 'down' } : s));
        } finally {
            setLastChecked(new Date());
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'healthy': return 'Operational';
            case 'degraded': return 'Degraded';
            case 'down': return 'Down';
            default: return 'Checking...';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'healthy': return <Badge variant="success">{getStatusLabel(status)}</Badge>;
            case 'degraded': return <Badge variant="warning">{getStatusLabel(status)}</Badge>;
            case 'down': return <Badge variant="danger">{getStatusLabel(status)}</Badge>;
            default: return <Badge variant="secondary">{getStatusLabel(status)}</Badge>;
        }
    };

    return (
        <div className="admin-system-health">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">System Health</h1>
                    <p className="admin-page-subtitle">
                        Monitor service status and system performance
                        {lastChecked && ` — Last checked: ${lastChecked.toLocaleTimeString()}`}
                    </p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={RefreshCw} onClick={checkHealth} disabled={loading}>
                        {loading ? 'Checking...' : 'Refresh'}
                    </Button>
                </div>
            </div>

            {/* Overall Status */}
            <div className="admin-health-overall">
                {services.every(s => s.status === 'healthy') && (
                    <div className="admin-health-banner healthy">
                        <CheckCircle2 size={20} />
                        <span>All systems operational</span>
                    </div>
                )}
                {services.some(s => s.status === 'degraded') && (
                    <div className="admin-health-banner degraded">
                        <AlertTriangle size={20} />
                        <span>Some services are experiencing issues</span>
                    </div>
                )}
                {services.some(s => s.status === 'down') && (
                    <div className="admin-health-banner down">
                        <XCircle size={20} />
                        <span>One or more services are down</span>
                    </div>
                )}
            </div>

            {/* Service Cards */}
            <div className="admin-health-grid">
                {services.map(service => (
                    <Card key={service.id} className="admin-health-service-card">
                        <CardContent>
                            <div className="admin-health-service-header">
                                <div className="admin-health-service-icon" data-status={service.status}>
                                    <service.icon size={24} />
                                </div>
                                <div className="admin-health-service-title">
                                    <h3>{service.name}</h3>
                                    {getStatusBadge(service.status)}
                                </div>
                            </div>
                            <div className="admin-health-service-details">
                                {service.latency !== null && service.latency !== undefined && (
                                    <div className="admin-health-service-detail">
                                        <span className="admin-health-detail-label">Latency</span>
                                        <span className="admin-health-detail-value">
                                            {typeof service.latency === 'number' ? `${service.latency}ms` : service.latency}
                                        </span>
                                    </div>
                                )}
                                {service.uptime !== null && service.uptime !== undefined && (
                                    <div className="admin-health-service-detail">
                                        <span className="admin-health-detail-label">Uptime</span>
                                        <span className="admin-health-detail-value">
                                            {typeof service.uptime === 'number' ? `${Math.floor(service.uptime / 3600)}h ${Math.floor((service.uptime % 3600) / 60)}m` : service.uptime}
                                        </span>
                                    </div>
                                )}
                                {service.version && (
                                    <div className="admin-health-service-detail">
                                        <span className="admin-health-detail-label">Version</span>
                                        <span className="admin-health-detail-value">{service.version}</span>
                                    </div>
                                )}
                                {service.connections !== null && service.connections !== undefined && (
                                    <div className="admin-health-service-detail">
                                        <span className="admin-health-detail-label">Connections</span>
                                        <span className="admin-health-detail-value">{service.connections}</span>
                                    </div>
                                )}
                                {service.hitRate !== null && service.hitRate !== undefined && (
                                    <div className="admin-health-service-detail">
                                        <span className="admin-health-detail-label">Hit Rate</span>
                                        <span className="admin-health-detail-value">{service.hitRate}</span>
                                    </div>
                                )}
                                {service.topics !== null && service.topics !== undefined && (
                                    <div className="admin-health-service-detail">
                                        <span className="admin-health-detail-label">Topics</span>
                                        <span className="admin-health-detail-value">{service.topics}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* System Stats */}
            <Card className="admin-health-stats-card">
                <CardHeader>
                    <CardTitle>System Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="admin-health-stats-grid">
                        {systemStats.map(stat => (
                            <div key={stat.label} className="admin-health-stat-item">
                                <div className="admin-health-stat-icon">
                                    <stat.icon size={20} />
                                </div>
                                <div className="admin-health-stat-info">
                                    <span className="admin-health-stat-label">{stat.label}</span>
                                    <span className="admin-health-stat-value">{stat.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
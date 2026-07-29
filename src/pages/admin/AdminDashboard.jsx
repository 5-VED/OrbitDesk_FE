import { useState, useEffect } from 'react';
import {
    Users,
    Ticket,
    Building2,
    UsersRound,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Activity,
    Shield,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Eye,
    Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dashboardService } from '@/services/dashboard.service';
import './AdminDashboard.css';

const iconMap = {
    Users,
    Ticket,
    Building2,
    UsersRound,
};

const getAuditEventIcon = (type) => {
    switch (type) {
        case 'policy': return Clock;
        case 'automation': return Activity;
        case 'user': return Users;
        case 'security': return Shield;
        default: return Activity;
    }
};

function formatTimeAgo(date) {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function AdminDashboard() {
    const [stats, setStats] = useState([]);
    const [slaData, setSlaData] = useState([]);
    const [agents, setAgents] = useState([]);
    const [auditEvents, setAuditEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, slaRes, agentsRes, auditRes] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getSlaOverview(),
                    dashboardService.getTopAgents(),
                    dashboardService.getRecentActivity(),
                ]);

                const mappedStats = (statsRes?.data?.systemStats || []).map((s) => ({
                    ...s,
                    icon: iconMap[s.icon] || Users,
                    change: s.change || '—',
                    trend: s.trend || 'neutral',
                }));
                setStats(mappedStats);

                setSlaData(slaRes?.data || []);
                setAgents(agentsRes?.data || []);
                setAuditEvents(auditRes?.data || []);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <Loader2 size={32} className="spin" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Admin Dashboard</h1>
                    <p className="admin-page-subtitle">System overview and health monitoring</p>
                </div>
                <div className="admin-page-actions">
                    <Button variant="secondary" icon={BarChart3}>View Reports</Button>
                    <Button variant="secondary" icon={Eye}>Audit Log</Button>
                </div>
            </div>

            <div className="admin-stats-grid">
                {stats.map((stat) => (
                    <Card key={stat.label} className="admin-stat-card" hover>
                        <div className="admin-stat-top">
                            <div className="admin-stat-icon-wrapper" data-color={stat.color}>
                                <stat.icon size={22} />
                            </div>
                            {stat.trend !== 'neutral' && (
                                <span className={`admin-stat-change ${stat.trend}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <div className="admin-stat-body">
                            <span className="admin-stat-value">{stat.value}</span>
                            <span className="admin-stat-label">{stat.label}</span>
                        </div>
                        <span className="admin-stat-subtitle">{stat.subtitle}</span>
                    </Card>
                ))}
            </div>

            <div className="admin-dashboard-grid">
                <Card className="admin-sla-card">
                    <CardHeader>
                        <CardTitle>SLA Compliance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="admin-sla-metrics">
                            {slaData.map((item) => {
                                const isGood = item.inverted
                                    ? item.value <= item.target
                                    : item.value >= item.target;
                                return (
                                    <div key={item.label} className="admin-sla-metric">
                                        <div className="admin-sla-metric-header">
                                            <span className="admin-sla-metric-label">{item.label}</span>
                                            <span className={`admin-sla-metric-value ${isGood ? 'good' : 'warning'}`}>
                                                {item.value}%
                                            </span>
                                        </div>
                                        <div className="admin-sla-bar">
                                            <div
                                                className="admin-sla-progress"
                                                data-status={isGood ? 'good' : 'warning'}
                                                style={{ width: `${Math.min(item.value, 100)}%` }}
                                            />
                                        </div>
                                        <div className="admin-sla-target">
                                            <span>Target: {item.inverted ? '≤' : '≥'}{item.target}%</span>
                                            {isGood ? (
                                                <span className="admin-sla-status good"><CheckCircle2 size={12} /> Meeting target</span>
                                            ) : (
                                                <span className="admin-sla-status warning"><AlertTriangle size={12} /> Below target</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="admin-audit-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="admin-audit-list">
                            {auditEvents.map((event) => {
                                const IconComponent = getAuditEventIcon(event.type);
                                return (
                                    <div key={event.id} className="admin-audit-item">
                                        <div className="admin-audit-icon" data-type={event.type}>
                                            <IconComponent size={14} />
                                        </div>
                                        <div className="admin-audit-content">
                                            <p>
                                                <strong>{event.user}</strong>{' '}
                                                {event.action}{' '}
                                                <span className="admin-audit-target">{event.target}</span>
                                            </p>
                                            <span className="admin-audit-time">{formatTimeAgo(event.time)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="admin-agents-card">
                    <CardHeader>
                        <CardTitle>Top Performing Agents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="admin-agents-table">
                            <div className="admin-agents-table-header">
                                <span>Agent</span>
                                <span>Tickets</span>
                                <span>Resolved</span>
                                <span>Rating</span>
                            </div>
                            {agents.map((agent) => (
                                <div key={agent.name} className="admin-agents-table-row">
                                    <div className="admin-agent-info">
                                        <Avatar name={agent.name} size="sm" status={agent.status} />
                                        <span>{agent.name}</span>
                                    </div>
                                    <span className="admin-agent-stat">{agent.tickets}</span>
                                    <span className="admin-agent-stat">{agent.resolved}</span>
                                    <span className="admin-agent-stat admin-agent-rating">⭐ {agent.satisfaction}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

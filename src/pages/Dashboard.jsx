import { useState, useEffect } from 'react';
import {
    Ticket,
    Clock,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Users,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { slaService } from '../features/settings/api/sla';
import { userService } from '../features/contacts/api/users';
import './Dashboard.css';

export function Dashboard() {
    const [dashData, setDashData] = useState(null);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [statsRes, agentsRes] = await Promise.all([
                    slaService.getDashboardStats(),
                    userService.getAgents().catch(() => ({ data: { agents: [] } })),
                ]);
                setDashData(statsRes.data || null);

                const agentList = agentsRes?.data?.agents || agentsRes?.data || [];
                setAgents(Array.isArray(agentList) ? agentList.slice(0, 5) : []);
            } catch {
                // Dashboard is non-critical; show empty state
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const ts = dashData?.ticketStats || {};
    const sla = dashData?.slaCompliance || {};

    const ticketStats = [
        { label: 'Open Tickets', value: ts.open ?? 0, icon: Ticket, color: 'primary' },
        { label: 'Pending', value: ts.pending ?? 0, icon: Clock, color: 'warning' },
        { label: 'Overdue', value: ts.overdue ?? 0, icon: AlertTriangle, color: 'danger' },
        { label: 'Resolved Today', value: ts.resolvedToday ?? 0, icon: CheckCircle2, color: 'success' },
    ];

    const avgResponseLabel = sla.avgResponseMinutes != null
        ? (sla.avgResponseMinutes < 60 ? `${sla.avgResponseMinutes}m` : `${(sla.avgResponseMinutes / 60).toFixed(1)}h`)
        : '-';

    const slaStatus = [
        { label: 'First Response', value: sla.firstResponse ?? 0, target: 95 },
        { label: 'Resolution Time', value: sla.resolution ?? 0, target: 90 },
    ];

    if (loading) {
        return (
            <PageContainer title="Dashboard">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 size={32} className="spin" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Dashboard"
            actions={
                <Button icon={TrendingUp}>View Reports</Button>
            }
        >
            <div className="dashboard">
                {/* Stats Cards */}
                <div className="dashboard-stats">
                    {ticketStats.map((stat) => (
                        <Card key={stat.label} className="stat-card">
                            <div className="stat-icon-wrapper" data-color={stat.color}>
                                <stat.icon size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">{stat.label}</span>
                                <div className="stat-value-row">
                                    <span className="stat-value">{stat.value}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="dashboard-grid">
                    {/* Agent Performance */}
                    <Card className="agents-card">
                        <CardHeader>
                            <CardTitle>Agent Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="agents-list">
                                {agents.length === 0 && (
                                    <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '1rem 0' }}>
                                        No agent data available
                                    </p>
                                )}
                                {agents.map((agent) => {
                                    const name = `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || agent.email;
                                    return (
                                        <div key={agent._id} className="agent-row">
                                            <div className="agent-info">
                                                <Avatar name={name} size="sm" />
                                                <span className="agent-name">{name}</span>
                                            </div>
                                            <div className="agent-stats">
                                                <div className="agent-stat">
                                                    <span className="agent-stat-value">{agent.ticketStats?.total ?? 0}</span>
                                                    <span className="agent-stat-label">Tickets</span>
                                                </div>
                                                <div className="agent-stat">
                                                    <span className="agent-stat-value">{agent.ticketStats?.resolved ?? 0}</span>
                                                    <span className="agent-stat-label">Resolved</span>
                                                </div>
                                                <div className="agent-stat">
                                                    <span className="agent-stat-value">
                                                        {agent.rating?.avg > 0 ? `⭐ ${agent.rating.avg.toFixed(1)}` : '-'}
                                                    </span>
                                                    <span className="agent-stat-label">Rating</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* SLA Status */}
                    <Card className="sla-card">
                        <CardHeader>
                            <CardTitle>SLA Compliance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="sla-list">
                                {slaStatus.map((s) => (
                                    <div key={s.label} className="sla-item">
                                        <div className="sla-header">
                                            <span className="sla-label">{s.label}</span>
                                            <span className="sla-value">{s.value}%</span>
                                        </div>
                                        <div className="sla-bar">
                                            <div
                                                className="sla-progress"
                                                style={{ width: `${s.value}%` }}
                                                data-status={s.value >= s.target ? 'good' : 'warning'}
                                            />
                                        </div>
                                        <span className="sla-target">Target: {s.target}%</span>
                                    </div>
                                ))}
                                <div className="sla-item">
                                    <div className="sla-header">
                                        <span className="sla-label">Avg. Response Time</span>
                                        <span className="sla-value">{avgResponseLabel}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="quick-actions-card">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="quick-actions">
                                <Button variant="secondary" icon={Ticket} fullWidth>
                                    Create Ticket
                                </Button>
                                <Button variant="secondary" icon={Users} fullWidth>
                                    Add Contact
                                </Button>
                                <Button variant="secondary" icon={MessageSquare} fullWidth>
                                    Start Chat
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}

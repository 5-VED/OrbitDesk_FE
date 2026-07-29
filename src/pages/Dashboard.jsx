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
    Target,
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

function CircularProgress({ value, target, size = 80, strokeWidth = 6 }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(value, 100) / 100) * circumference;
    const isAtRisk = value < target;

    return (
        <div className="circular-progress" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-bg-tertiary)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={isAtRisk ? 'var(--color-warning)' : 'var(--color-success)'}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <div className="circular-progress-value">
                <span className="circular-progress-number">{value}%</span>
            </div>
        </div>
    );
}

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

    // Placeholder content — no backend endpoint for these yet.
    const recentActivity = [
        { id: 1, type: 'ticket_created', user: 'Sarah Chen', action: 'created ticket', target: '#1234 - Login issue', time: '2 min ago' },
        { id: 2, type: 'ticket_resolved', user: 'Mike Johnson', action: 'resolved ticket', target: '#1230 - Payment failed', time: '15 min ago' },
        { id: 3, type: 'comment', user: 'Emily Davis', action: 'commented on', target: '#1228 - API error', time: '32 min ago' },
        { id: 4, type: 'assigned', user: 'Alex Kim', action: 'was assigned to', target: '#1225 - Dashboard bug', time: '1 hour ago' },
        { id: 5, type: 'ticket_created', user: 'John Smith', action: 'created ticket', target: '#1233 - Mobile app crash', time: '2 hours ago' },
    ];

    const agentPerformance = [
        { name: 'Sarah Chen', tickets: 34, resolved: 28, rating: 4.8, status: 'online' },
        { name: 'Mike Johnson', tickets: 29, resolved: 25, rating: 4.6, status: 'online' },
        { name: 'Emily Davis', tickets: 22, resolved: 20, rating: 4.9, status: 'busy' },
        { name: 'Alex Kim', tickets: 18, resolved: 15, rating: 4.5, status: 'away' },
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
            title="Workspace"
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
                                <stat.icon size={22} />
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
                    {/* Workspace Health — Circular progress rings */}
                    <Card className="sla-card">
                        <CardHeader>
                            <CardTitle>Workspace Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="health-rings">
                                {slaStatus.map((s) => (
                                    <div key={s.label} className="health-ring-item">
                                        <CircularProgress value={s.value} target={s.target} />
                                        <div className="health-ring-label">
                                            <span className="health-ring-text">{s.label}</span>
                                            <span className={`health-ring-status ${s.value >= s.target ? 'on-track' : 'at-risk'}`}>
                                                {s.value >= s.target ? 'On track' : 'At risk'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="sla-item">
                                <div className="sla-header">
                                    <span className="sla-label">Avg. Response Time</span>
                                    <span className="sla-value">{avgResponseLabel}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Focus */}
                    <Card className="focus-card">
                        <CardHeader>
                            <CardTitle>Today's Focus</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="focus-list">
                                <div className="focus-item">
                                    <div className="focus-item-priority priority-high" />
                                    <div className="focus-item-content">
                                        <span className="focus-item-title">Resolve escalation #1220</span>
                                        <span className="focus-item-meta">Due today · Priority high</span>
                                    </div>
                                </div>
                                <div className="focus-item">
                                    <div className="focus-item-priority priority-medium" />
                                    <div className="focus-item-content">
                                        <span className="focus-item-title">Review pending SLA exceptions</span>
                                        <span className="focus-item-meta">3 items · Review by EOD</span>
                                    </div>
                                </div>
                                <div className="focus-item">
                                    <div className="focus-item-priority priority-low" />
                                    <div className="focus-item-content">
                                        <span className="focus-item-title">Team standup at 10:00 AM</span>
                                        <span className="focus-item-meta">Weekly sync</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="activity-card">
                        <CardHeader>
                            <CardTitle>Team Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="activity-list">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="activity-item">
                                        <Avatar name={item.user} size="sm" />
                                        <div className="activity-content">
                                            <p>
                                                <strong>{item.user}</strong> {item.action}{' '}
                                                <span className="activity-target">{item.target}</span>
                                            </p>
                                            <span className="activity-time">{item.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agent Capacity */}
                    <Card className="agents-card">
                        <CardHeader>
                            <CardTitle>Team Capacity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="agents-list">
                                {agentPerformance.map((agent) => (
                                    <div key={agent.name} className="agent-row">
                                        <div className="agent-info">
                                            <Avatar name={agent.name} size="sm" status={agent.status} />
                                            <div className="agent-details">
                                                <span className="agent-name">{agent.name}</span>
                                                <span className="agent-status-text">
                                                    {agent.status === 'online' && 'Available'}
                                                    {agent.status === 'busy' && 'On a call'}
                                                    {agent.status === 'away' && 'Away'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="agent-stats">
                                            <div className="agent-stat">
                                                <span className="agent-stat-value">{agent.resolved}</span>
                                                <span className="agent-stat-label">Resolved</span>
                                            </div>
                                            <div className="agent-stat">
                                                <span className="agent-stat-value">{agent.tickets}</span>
                                                <span className="agent-stat-label">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Signals */}
                <Card className="ai-signals-card">
                    <CardHeader>
                        <CardTitle>
                            <div className="ai-signals-header">
                                <Target size={16} />
                                <span>AI Signals</span>
                                <Badge variant="info" size="sm">2 new</Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="ai-signals-list">
                            <div className="ai-signal-item">
                                <div className="ai-signal-icon">
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="ai-signal-content">
                                    <span className="ai-signal-text">Unusually high ticket volume on login flow — consider reviewing recent deployment</span>
                                    <span className="ai-signal-meta">Detected 15m ago</span>
                                </div>
                            </div>
                            <div className="ai-signal-item">
                                <div className="ai-signal-icon">
                                    <TrendingUp size={16} />
                                </div>
                                <div className="ai-signal-content">
                                    <span className="ai-signal-text">Agent Sarah Chen has highest resolution rate this week (94%)</span>
                                    <span className="ai-signal-meta">Weekly trend</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
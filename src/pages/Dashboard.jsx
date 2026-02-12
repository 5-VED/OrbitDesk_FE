import {
    Ticket,
    Clock,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Users,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import './Dashboard.css';

// Mock data
const ticketStats = [
    { label: 'Open Tickets', value: 124, change: 12, trend: 'up', icon: Ticket, color: 'primary' },
    { label: 'Pending', value: 45, change: -5, trend: 'down', icon: Clock, color: 'warning' },
    { label: 'Overdue', value: 8, change: 3, trend: 'up', icon: AlertTriangle, color: 'danger' },
    { label: 'Resolved Today', value: 67, change: 23, trend: 'up', icon: CheckCircle2, color: 'success' },
];

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

const slaStatus = [
    { label: 'First Response', value: 94, target: 95 },
    { label: 'Resolution Time', value: 87, target: 90 },
    { label: 'Customer Satisfaction', value: 92, target: 85 },
];

export function Dashboard() {
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
                                    <span className={`stat-change ${stat.trend}`}>
                                        {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {Math.abs(stat.change)}%
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="dashboard-grid">
                    {/* Recent Activity */}
                    <Card className="activity-card">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
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

                    {/* Agent Performance */}
                    <Card className="agents-card">
                        <CardHeader>
                            <CardTitle>Agent Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="agents-list">
                                {agentPerformance.map((agent) => (
                                    <div key={agent.name} className="agent-row">
                                        <div className="agent-info">
                                            <Avatar name={agent.name} size="sm" status={agent.status} />
                                            <span className="agent-name">{agent.name}</span>
                                        </div>
                                        <div className="agent-stats">
                                            <div className="agent-stat">
                                                <span className="agent-stat-value">{agent.tickets}</span>
                                                <span className="agent-stat-label">Tickets</span>
                                            </div>
                                            <div className="agent-stat">
                                                <span className="agent-stat-value">{agent.resolved}</span>
                                                <span className="agent-stat-label">Resolved</span>
                                            </div>
                                            <div className="agent-stat">
                                                <span className="agent-stat-value">⭐ {agent.rating}</span>
                                                <span className="agent-stat-label">Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                {slaStatus.map((sla) => (
                                    <div key={sla.label} className="sla-item">
                                        <div className="sla-header">
                                            <span className="sla-label">{sla.label}</span>
                                            <span className="sla-value">{sla.value}%</span>
                                        </div>
                                        <div className="sla-bar">
                                            <div
                                                className="sla-progress"
                                                style={{ width: `${sla.value}%` }}
                                                data-status={sla.value >= sla.target ? 'good' : 'warning'}
                                            />
                                        </div>
                                        <span className="sla-target">Target: {sla.target}%</span>
                                    </div>
                                ))}
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

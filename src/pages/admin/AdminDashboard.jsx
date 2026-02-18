import { useState, useEffect } from 'react';
import {
    Users,
    Ticket,
    Building2,
    UsersRound,
    TrendingUp,
    TrendingDown,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Activity,
    Shield,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import './AdminDashboard.css';

// Mock data — replace with real API calls
const systemStats = [
    { label: 'Total Users', value: '1,247', change: '+12%', trend: 'up', icon: Users, color: 'primary', subtitle: '34 admins · 89 agents · 1,124 customers' },
    { label: 'Active Tickets', value: '382', change: '-5%', trend: 'down', icon: Ticket, color: 'warning', subtitle: '124 open · 45 pending · 213 in-progress' },
    { label: 'Organizations', value: '56', change: '+3', trend: 'up', icon: Building2, color: 'info', subtitle: '48 active · 8 inactive' },
    { label: 'Agent Groups', value: '12', change: '—', trend: 'neutral', icon: UsersRound, color: 'success', subtitle: '89 agents across 12 groups' },
];

const slaCompliance = [
    { label: 'First Response', value: 94, target: 95, color: 'warning' },
    { label: 'Resolution Time', value: 87, target: 90, color: 'danger' },
    { label: 'Customer Satisfaction', value: 92, target: 85, color: 'success' },
    { label: 'Escalation Rate', value: 4, target: 10, color: 'success', inverted: true },
];

const recentAuditEvents = [
    { id: 1, user: 'Admin User', action: 'Updated SLA Policy', target: 'Premium Support', time: '5 min ago', type: 'policy' },
    { id: 2, user: 'System', action: 'Auto-escalated ticket', target: '#TK-1892', time: '12 min ago', type: 'automation' },
    { id: 3, user: 'Jane Cooper', action: 'Created new agent', target: 'mike.wilson@acme.com', time: '1 hour ago', type: 'user' },
    { id: 4, user: 'Admin User', action: 'Modified role permissions', target: 'Support Lead', time: '2 hours ago', type: 'security' },
    { id: 5, user: 'System', action: 'Bulk ticket assignment', target: '23 tickets → Tier 2', time: '3 hours ago', type: 'automation' },
    { id: 6, user: 'Jane Cooper', action: 'Disabled user account', target: 'old.agent@acme.com', time: '5 hours ago', type: 'security' },
];

const topAgents = [
    { name: 'Sarah Chen', tickets: 34, resolved: 31, avgTime: '2.1h', satisfaction: 4.9, status: 'online' },
    { name: 'Mike Johnson', tickets: 29, resolved: 27, avgTime: '2.8h', satisfaction: 4.7, status: 'online' },
    { name: 'Emily Davis', tickets: 22, resolved: 20, avgTime: '1.9h', satisfaction: 4.8, status: 'busy' },
    { name: 'Alex Kim', tickets: 18, resolved: 16, avgTime: '3.2h', satisfaction: 4.5, status: 'away' },
    { name: 'Priya Patel', tickets: 15, resolved: 14, avgTime: '2.5h', satisfaction: 4.6, status: 'online' },
];

const systemHealth = [
    { service: 'Backend API', status: 'healthy', uptime: '99.98%', latency: '45ms' },
    { service: 'MongoDB', status: 'healthy', uptime: '99.99%', latency: '12ms' },
    { service: 'Kafka', status: 'healthy', uptime: '99.95%', latency: '8ms' },
    { service: 'Notification Service', status: 'degraded', uptime: '98.5%', latency: '230ms' },
    { service: 'Redis Cache', status: 'healthy', uptime: '99.99%', latency: '3ms' },
];

const getAuditEventIcon = (type) => {
    switch (type) {
        case 'policy': return Clock;
        case 'automation': return Activity;
        case 'user': return Users;
        case 'security': return Shield;
        default: return Activity;
    }
};

export function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            {/* Page Header */}
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

            {/* System Stats */}
            <div className="admin-stats-grid">
                {systemStats.map((stat) => (
                    <Card key={stat.label} className="admin-stat-card" hover>
                        <div className="admin-stat-top">
                            <div className={`admin-stat-icon-wrapper`} data-color={stat.color}>
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

            {/* Main Grid */}
            <div className="admin-dashboard-grid">
                {/* SLA Compliance */}
                <Card className="admin-sla-card">
                    <CardHeader>
                        <CardTitle>SLA Compliance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="admin-sla-metrics">
                            {slaCompliance.map((item) => {
                                const isGood = item.inverted
                                    ? item.value <= item.target
                                    : item.value >= item.target;
                                return (
                                    <div key={item.label} className="admin-sla-metric">
                                        <div className="admin-sla-metric-header">
                                            <span className="admin-sla-metric-label">{item.label}</span>
                                            <span className={`admin-sla-metric-value ${isGood ? 'good' : 'warning'}`}>
                                                {item.value}{item.inverted ? '%' : '%'}
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

                {/* Recent Audit Events */}
                <Card className="admin-audit-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="admin-audit-list">
                            {recentAuditEvents.map((event) => {
                                const IconComponent = getAuditEventIcon(event.type);
                                return (
                                    <div key={event.id} className="admin-audit-item">
                                        <div className={`admin-audit-icon`} data-type={event.type}>
                                            <IconComponent size={14} />
                                        </div>
                                        <div className="admin-audit-content">
                                            <p>
                                                <strong>{event.user}</strong>{' '}
                                                {event.action}{' '}
                                                <span className="admin-audit-target">{event.target}</span>
                                            </p>
                                            <span className="admin-audit-time">{event.time}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Agents */}
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
                                <span>Avg Time</span>
                                <span>Rating</span>
                            </div>
                            {topAgents.map((agent) => (
                                <div key={agent.name} className="admin-agents-table-row">
                                    <div className="admin-agent-info">
                                        <Avatar name={agent.name} size="sm" status={agent.status} />
                                        <span>{agent.name}</span>
                                    </div>
                                    <span className="admin-agent-stat">{agent.tickets}</span>
                                    <span className="admin-agent-stat">{agent.resolved}</span>
                                    <span className="admin-agent-stat">{agent.avgTime}</span>
                                    <span className="admin-agent-stat admin-agent-rating">⭐ {agent.satisfaction}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card className="admin-health-card">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="admin-health-list">
                            {systemHealth.map((service) => (
                                <div key={service.service} className="admin-health-item">
                                    <div className="admin-health-left">
                                        <div className={`admin-health-dot ${service.status}`}></div>
                                        <span className="admin-health-service">{service.service}</span>
                                    </div>
                                    <div className="admin-health-metrics">
                                        <span className="admin-health-metric">
                                            <span className="admin-health-metric-label">Uptime</span>
                                            <span className="admin-health-metric-value">{service.uptime}</span>
                                        </span>
                                        <span className="admin-health-metric">
                                            <span className="admin-health-metric-label">Latency</span>
                                            <span className="admin-health-metric-value">{service.latency}</span>
                                        </span>
                                        <Badge variant={service.status === 'healthy' ? 'success' : 'warning'}>
                                            {service.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { useState } from 'react';
import {
    Download,
    Calendar,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import './Reports.css';

// Mock data
const ticketTrendData = [
    { name: 'Mon', created: 45, resolved: 38 },
    { name: 'Tue', created: 52, resolved: 45 },
    { name: 'Wed', created: 48, resolved: 52 },
    { name: 'Thu', created: 61, resolved: 55 },
    { name: 'Fri', created: 55, resolved: 48 },
    { name: 'Sat', created: 32, resolved: 35 },
    { name: 'Sun', created: 28, resolved: 30 },
];

const agentPerformanceData = [
    { name: 'Sarah', tickets: 156, sla: 96 },
    { name: 'Mike', tickets: 134, sla: 92 },
    { name: 'Emily', tickets: 98, sla: 98 },
    { name: 'Alex', tickets: 67, sla: 88 },
    { name: 'Lisa', tickets: 245, sla: 94 },
];

const channelData = [
    { name: 'Email', value: 45, color: '#3b82f6' },
    { name: 'Chat', value: 30, color: '#10b981' },
    { name: 'Phone', value: 15, color: '#f59e0b' },
    { name: 'Web Form', value: 10, color: '#8b5cf6' },
];

const slaData = [
    { name: 'Week 1', firstResponse: 95, resolution: 88 },
    { name: 'Week 2', firstResponse: 93, resolution: 85 },
    { name: 'Week 3', firstResponse: 97, resolution: 92 },
    { name: 'Week 4', firstResponse: 94, resolution: 90 },
];

const summaryStats = [
    { label: 'Total Tickets', value: '1,247', change: 12.5, trend: 'up' },
    { label: 'Avg. Resolution Time', value: '4.2h', change: -8.3, trend: 'down' },
    { label: 'Customer Satisfaction', value: '94%', change: 2.1, trend: 'up' },
    { label: 'First Contact Resolution', value: '78%', change: 5.4, trend: 'up' },
];

const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' },
];

export function Reports() {
    const [timeRange, setTimeRange] = useState('7d');

    return (
        <PageContainer
            title="Reports & Analytics"
            actions={
                <>
                    <Select
                        options={timeRangeOptions}
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    />
                    <Button variant="secondary" icon={Download}>Export</Button>
                </>
            }
        >
            <div className="reports-page">
                {/* Summary Stats */}
                <div className="reports-summary">
                    {summaryStats.map((stat) => (
                        <Card key={stat.label} className="summary-card">
                            <div className="summary-content">
                                <span className="summary-label">{stat.label}</span>
                                <span className="summary-value">{stat.value}</span>
                            </div>
                            <div className={`summary-change ${stat.trend}`}>
                                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span>{Math.abs(stat.change)}%</span>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="reports-grid">
                    {/* Ticket Trends */}
                    <Card className="chart-card wide">
                        <CardHeader>
                            <CardTitle>Ticket Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={ticketTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                        <XAxis dataKey="name" stroke="var(--color-text-tertiary)" />
                                        <YAxis stroke="var(--color-text-tertiary)" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--color-bg-primary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="created"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6' }}
                                            name="Created"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="resolved"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={{ fill: '#10b981' }}
                                            name="Resolved"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: '#3b82f6' }} />
                                    <span>Created</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                                    <span>Resolved</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agent Performance */}
                    <Card className="chart-card">
                        <CardHeader>
                            <CardTitle>Agent Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={agentPerformanceData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                        <XAxis type="number" stroke="var(--color-text-tertiary)" />
                                        <YAxis dataKey="name" type="category" stroke="var(--color-text-tertiary)" width={50} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--color-bg-primary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="tickets" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Tickets" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Channel Distribution */}
                    <Card className="chart-card">
                        <CardHeader>
                            <CardTitle>Channel Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="chart-container pie-chart">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={channelData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {channelData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pie-legend">
                                    {channelData.map((item) => (
                                        <div key={item.name} className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: item.color }} />
                                            <span>{item.name}</span>
                                            <span className="legend-value">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SLA Compliance */}
                    <Card className="chart-card wide">
                        <CardHeader>
                            <CardTitle>SLA Compliance Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={slaData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                        <XAxis dataKey="name" stroke="var(--color-text-tertiary)" />
                                        <YAxis stroke="var(--color-text-tertiary)" domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--color-bg-primary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="firstResponse" fill="#3b82f6" radius={[4, 4, 0, 0]} name="First Response" />
                                        <Bar dataKey="resolution" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolution" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: '#3b82f6' }} />
                                    <span>First Response SLA</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                                    <span>Resolution SLA</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}

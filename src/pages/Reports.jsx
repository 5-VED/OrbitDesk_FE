import { useState, useEffect } from 'react';
import {
    Download,
    TrendingUp,
    TrendingDown,
    Loader2
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
import { reportService } from '../services/report.service';
import './Reports.css';

const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
];

export function Reports() {
    const [timeRange, setTimeRange] = useState('7d');
    const [summary, setSummary] = useState(null);
    const [ticketTrends, setTicketTrends] = useState([]);
    const [agentPerformance, setAgentPerformance] = useState([]);
    const [channelData, setChannelData] = useState([]);
    const [slaData, setSlaData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const [summaryRes, trendsRes, agentsRes, channelRes, slaRes] = await Promise.all([
                    reportService.getSummary({ range: timeRange }),
                    reportService.getTicketTrends({ range: timeRange }),
                    reportService.getAgentPerformance({ range: timeRange }),
                    reportService.getChannelDistribution({ range: timeRange }),
                    reportService.getSlaCompliance({ range: timeRange === '7d' ? '30d' : timeRange }),
                ]);
                setSummary(summaryRes?.data || null);
                setTicketTrends(trendsRes?.data || []);
                setAgentPerformance(agentsRes?.data || []);
                setChannelData(channelRes?.data || []);
                setSlaData(slaRes?.data || []);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [timeRange]);

    const summaryStats = summary ? [
        { label: 'Total Tickets', value: summary.totalTickets?.value?.toLocaleString() || '0', change: summary.totalTickets?.change || 0, trend: summary.totalTickets?.change >= 0 ? 'up' : 'down' },
        { label: 'Resolved Tickets', value: summary.resolvedTickets?.value?.toLocaleString() || '0', change: summary.resolvedTickets?.change || 0, trend: summary.resolvedTickets?.change >= 0 ? 'up' : 'down' },
        { label: 'Customer Satisfaction', value: summary.satisfaction?.value || '0%', change: summary.satisfaction?.change || 0, trend: (summary.satisfaction?.change || 0) >= 0 ? 'up' : 'down' },
        { label: 'First Contact Resolution', value: summary.firstContactResolution?.value || '0%', change: summary.firstContactResolution?.change || 0, trend: (summary.firstContactResolution?.change || 0) >= 0 ? 'up' : 'down' },
    ] : [];

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
                {loading ? (
                    <div className="admin-dashboard-loading">
                        <Loader2 size={32} className="spin" />
                        <p>Loading reports...</p>
                    </div>
                ) : (
                <>
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
                                    <LineChart data={ticketTrends}>
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
                                    <BarChart data={agentPerformance} layout="vertical">
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
                </>
                )}
            </div>
        </PageContainer>
    );
}
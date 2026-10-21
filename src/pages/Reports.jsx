import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Stack,
    MenuItem,
    TextField,
    Button as MuiButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Download,
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
import { reportService } from '../services/report.service';

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
            } catch (err) {
                console.error('Failed to load reports:', err);
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
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <TextField
                        select
                        size="small"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        sx={{ minWidth: 140 }}
                    >
                        {timeRangeOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <MuiButton
                        variant="outlined"
                        color="inherit"
                        startIcon={<Download size={16} />}
                        sx={{ textTransform: 'none' }}
                    >
                        Export
                    </MuiButton>
                </Stack>
            }
        >
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
                    <CircularProgress size={36} color="primary" />
                    <Typography color="text.secondary">Loading reports...</Typography>
                </Box>
            ) : (
                <Stack spacing={3}>
                    {/* Summary Stats */}
                    <Grid container spacing={2}>
                        {summaryStats.map((stat) => (
                            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">
                                                {stat.label}
                                            </Typography>
                                            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                color: stat.trend === 'up' ? 'success.main' : 'error.main',
                                                bgcolor: stat.trend === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                px: 1,
                                                py: 0.25,
                                                borderRadius: 1
                                            }}
                                        >
                                            {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            <span>{Math.abs(stat.change)}%</span>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Charts Grid */}
                    <Grid container spacing={3}>
                        {/* Ticket Trends */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                        Ticket Trends
                                    </Typography>
                                    <Box sx={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={ticketTrends}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" />
                                                <XAxis dataKey="name" stroke="var(--color-text-secondary, #64748b)" />
                                                <YAxis stroke="var(--color-text-secondary, #64748b)" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'var(--color-bg-primary, #ffffff)',
                                                        border: '1px solid var(--color-border, #e2e8f0)',
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
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                                            <Typography variant="caption" color="text.secondary">Created</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981' }} />
                                            <Typography variant="caption" color="text.secondary">Resolved</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Agent Performance */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                        Agent Performance
                                    </Typography>
                                    <Box sx={{ width: '100%', height: 280 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={agentPerformance} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" />
                                                <XAxis type="number" stroke="var(--color-text-secondary, #64748b)" />
                                                <YAxis dataKey="name" type="category" stroke="var(--color-text-secondary, #64748b)" width={60} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'var(--color-bg-primary, #ffffff)',
                                                        border: '1px solid var(--color-border, #e2e8f0)',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <Bar dataKey="tickets" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Tickets" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Channel Distribution */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                        Channel Distribution
                                    </Typography>
                                    <Box sx={{ width: '100%', height: 220 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={channelData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={75}
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
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 1 }}>
                                        {channelData.map((item) => (
                                            <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.name}: <strong>{item.value}%</strong>
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* SLA Compliance */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                        SLA Compliance Trend
                                    </Typography>
                                    <Box sx={{ width: '100%', height: 240 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={slaData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" />
                                                <XAxis dataKey="name" stroke="var(--color-text-secondary, #64748b)" />
                                                <YAxis stroke="var(--color-text-secondary, #64748b)" domain={[0, 100]} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'var(--color-bg-primary, #ffffff)',
                                                        border: '1px solid var(--color-border, #e2e8f0)',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <Bar dataKey="firstResponse" fill="#3b82f6" radius={[4, 4, 0, 0]} name="First Response" />
                                                <Bar dataKey="resolution" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolution" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                                            <Typography variant="caption" color="text.secondary">First Response SLA</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981' }} />
                                            <Typography variant="caption" color="text.secondary">Resolution SLA</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            )}
        </PageContainer>
    );
}
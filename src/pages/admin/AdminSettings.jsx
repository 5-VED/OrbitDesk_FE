import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button as MuiButton,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Alert,
    Stack,
    Paper,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Globe,
    Lock,
    Mail,
    Bell,
    Database,
    RefreshCw,
    Save,
    AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const settingsSections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'email', label: 'Email (SMTP)', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
];

const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'hi', label: 'Hindi' },
];

export function AdminSettings() {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState({
        appName: 'OrbitDesk',
        supportEmail: 'support@orbitdesk.com',
        timezone: 'UTC',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        // Security
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecial: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        twoFactorRequired: false,
        // Email
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'noreply@orbitdesk.com',
        smtpPassword: '••••••••••',
        smtpSecure: true,
        fromName: 'OrbitDesk Support',
        fromEmail: 'noreply@orbitdesk.com',
    });

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Stack spacing={3}>
            {/* Page Header */}
            <Box>
                <Typography variant="h5" fontWeight={800}>System Settings</Typography>
                <Typography variant="body2" color="text.secondary">Configure global application preferences</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Navigation Sidebar */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <List disablePadding sx={{ py: 1 }}>
                            {settingsSections.map((section) => {
                                const isSelected = activeSection === section.id;
                                return (
                                    <ListItemButton
                                        key={section.id}
                                        selected={isSelected}
                                        onClick={() => setActiveSection(section.id)}
                                        sx={{
                                            py: 1.5,
                                            px: 2,
                                            borderLeft: isSelected ? '3px solid' : '3px solid transparent',
                                            borderColor: isSelected ? 'primary.main' : 'transparent',
                                            bgcolor: isSelected
                                                ? (theme) => theme.palette.mode === 'dark' ? 'rgba(244,67,54,0.08)' : 'rgba(244,67,54,0.04)'
                                                : 'transparent'
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                                            <section.icon size={18} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={section.label}
                                            primaryTypographyProps={{
                                                variant: 'body2',
                                                fontWeight: isSelected ? 700 : 500,
                                                color: isSelected ? 'primary.main' : 'text.primary'
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Card>
                </Grid>

                {/* Settings Content */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {activeSection === 'general' && (
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                                    General Settings
                                </Typography>
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="Application Name"
                                        value={settings.appName}
                                        onChange={handleChange('appName')}
                                        fullWidth
                                        size="small"
                                    />
                                    <TextField
                                        label="Support Email"
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={handleChange('supportEmail')}
                                        fullWidth
                                        size="small"
                                    />
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                select
                                                label="Timezone"
                                                value={settings.timezone}
                                                onChange={handleChange('timezone')}
                                                fullWidth
                                                size="small"
                                            >
                                                {timezoneOptions.map(opt => (
                                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                select
                                                label="Language"
                                                value={settings.language}
                                                onChange={handleChange('language')}
                                                fullWidth
                                                size="small"
                                            >
                                                {languageOptions.map(opt => (
                                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <TextField
                                        label="Date Format"
                                        value={settings.dateFormat}
                                        onChange={handleChange('dateFormat')}
                                        fullWidth
                                        size="small"
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                                        <MuiButton variant="contained" color="primary" startIcon={<Save size={16} />}>
                                            Save Changes
                                        </MuiButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'security' && (
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                                    Security Settings
                                </Typography>
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                                            Password Policy
                                        </Typography>
                                        <Stack spacing={2}>
                                            <TextField
                                                label="Minimum Password Length"
                                                type="number"
                                                value={settings.minPasswordLength}
                                                onChange={handleChange('minPasswordLength')}
                                                slotProps={{ htmlInput: { min: 6, max: 128 } }}
                                                fullWidth
                                                size="small"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox size="small" checked={settings.requireUppercase} onChange={handleChange('requireUppercase')} />}
                                                label={<Typography variant="body2">Require uppercase letters</Typography>}
                                            />
                                            <FormControlLabel
                                                control={<Checkbox size="small" checked={settings.requireNumbers} onChange={handleChange('requireNumbers')} />}
                                                label={<Typography variant="body2">Require numbers</Typography>}
                                            />
                                            <FormControlLabel
                                                control={<Checkbox size="small" checked={settings.requireSpecial} onChange={handleChange('requireSpecial')} />}
                                                label={<Typography variant="body2">Require special characters</Typography>}
                                            />
                                        </Stack>
                                    </Paper>

                                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                                            Session & Access
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        label="Session Timeout (minutes)"
                                                        type="number"
                                                        value={settings.sessionTimeout}
                                                        onChange={handleChange('sessionTimeout')}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        label="Max Login Attempts"
                                                        type="number"
                                                        value={settings.maxLoginAttempts}
                                                        onChange={handleChange('maxLoginAttempts')}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <FormControlLabel
                                                control={<Checkbox size="small" checked={settings.twoFactorRequired} onChange={handleChange('twoFactorRequired')} />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>Require Two-Factor Authentication</Typography>
                                                        <Typography variant="caption" color="text.secondary">All users must set up 2FA</Typography>
                                                    </Box>
                                                }
                                            />
                                        </Stack>
                                    </Paper>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <MuiButton variant="contained" color="primary" startIcon={<Save size={16} />}>
                                            Save Security Settings
                                        </MuiButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'email' && (
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Email Configuration (SMTP)
                                </Typography>
                                <Alert severity="info" sx={{ mb: 2.5 }}>
                                    These settings configure the outgoing email server for notifications, ticket replies, and system alerts.
                                </Alert>
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                label="SMTP Host"
                                                value={settings.smtpHost}
                                                onChange={handleChange('smtpHost')}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <TextField
                                                label="SMTP Port"
                                                type="number"
                                                value={settings.smtpPort}
                                                onChange={handleChange('smtpPort')}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="SMTP Username"
                                                value={settings.smtpUser}
                                                onChange={handleChange('smtpUser')}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="SMTP Password"
                                                type="password"
                                                value={settings.smtpPassword}
                                                onChange={handleChange('smtpPassword')}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                    <FormControlLabel
                                        control={<Checkbox size="small" checked={settings.smtpSecure} onChange={handleChange('smtpSecure')} />}
                                        label={
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>Use TLS/SSL</Typography>
                                                <Typography variant="caption" color="text.secondary">Encrypt SMTP connection (recommended)</Typography>
                                            </Box>
                                        }
                                    />
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="From Name"
                                                value={settings.fromName}
                                                onChange={handleChange('fromName')}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="From Email"
                                                type="email"
                                                value={settings.fromEmail}
                                                onChange={handleChange('fromEmail')}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
                                        <MuiButton variant="outlined" color="inherit" startIcon={<RefreshCw size={16} />}>
                                            Test Connection
                                        </MuiButton>
                                        <MuiButton variant="contained" color="primary" startIcon={<Save size={16} />}>
                                            Save Email Settings
                                        </MuiButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'notifications' && (
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                                    Notification Preferences
                                </Typography>
                                <Stack spacing={1.5} sx={{ mb: 3 }}>
                                    {[
                                        { event: 'Ticket Created', email: true, inApp: true, desc: 'When a new ticket is submitted' },
                                        { event: 'Ticket Assigned', email: true, inApp: true, desc: 'When a ticket is assigned to an agent' },
                                        { event: 'Ticket Resolved', email: true, inApp: true, desc: 'When a ticket is marked resolved' },
                                        { event: 'SLA Breach Warning', email: true, inApp: true, desc: '15 minutes before SLA breach' },
                                        { event: 'SLA Breached', email: true, inApp: true, desc: 'When an SLA target is missed' },
                                        { event: 'New Comment', email: false, inApp: true, desc: 'When someone comments on a ticket' },
                                        { event: 'User Signup', email: true, inApp: false, desc: 'When a new user registers' },
                                        { event: 'Agent Status Change', email: false, inApp: true, desc: 'When an agent goes online/offline' },
                                    ].map((item) => (
                                        <Paper
                                            key={item.event}
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap',
                                                gap: 2,
                                                borderRadius: 1.5
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {item.event}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.desc}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" spacing={3}>
                                                <FormControlLabel
                                                    control={<Checkbox size="small" defaultChecked={item.email} />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Mail size={14} />
                                                            <Typography variant="caption">Email</Typography>
                                                        </Box>
                                                    }
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox size="small" defaultChecked={item.inApp} />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Bell size={14} />
                                                            <Typography variant="caption">In-App</Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <MuiButton variant="contained" color="primary" startIcon={<Save size={16} />}>
                                        Save Notification Settings
                                    </MuiButton>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'database' && (
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Database & Storage
                                </Typography>
                                <Alert severity="warning" sx={{ mb: 2.5 }} icon={<AlertTriangle size={20} />}>
                                    Database settings are read from environment variables and cannot be changed here. This page is for monitoring only.
                                </Alert>
                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                                    <Stack spacing={2} divider={<Divider />}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Database</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>MongoDB v7.0</Typography>
                                                <Badge variant="success">Connected</Badge>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Host</Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>localhost:27017</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Database Name</Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>orbitdesk</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Collections</Typography>
                                            <Typography variant="body2" fontWeight={600}>14</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Cache</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2">Redis (localhost:6379)</Typography>
                                                <Badge variant="success">Connected</Badge>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Message Broker</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2">Kafka (localhost:9092)</Typography>
                                                <Badge variant="success">Connected</Badge>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Stack>
    );
}

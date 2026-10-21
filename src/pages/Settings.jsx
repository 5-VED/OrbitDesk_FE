import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Zap,
    Link,
    Clock,
    Mail,
    Save
} from 'lucide-react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { SlaPolicyList } from '../features/settings/components/SlaPolicyList';
import { settingsService } from '../services/settings.service';
import toast from 'react-hot-toast';

const menuItems = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'sla', label: 'SLA Policies', icon: Clock },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email Settings', icon: Mail },
];

const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
];

export function Settings() {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, [activeSection]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const cat = ['general', 'security', 'notifications', 'email'].includes(activeSection) ? activeSection : null;
            const res = await settingsService.get(cat);
            if (res?.success && res?.data) {
                setSettings(prev => ({ ...prev, ...(cat ? { [cat]: res.data } : res.data) }));
            }
        } catch {
            // silently fall back to empty state
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (section, field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleSave = async (section) => {
        setSaving(true);
        try {
            const res = await settingsService.update(section, settings[section] || {});
            if (res?.success) {
                setSettings(prev => ({ ...prev, [section]: res.data }));
                toast.success('Settings saved successfully');
            } else {
                toast.error(res?.message || 'Failed to save settings');
            }
        } catch {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const sectionData = (id) => settings[id] || {};

    const renderGeneral = () => (
        <Card>
            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
            <CardContent>
                <Box component="form" onSubmit={e => { e.preventDefault(); handleSave('general'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Input label="Company Name" value={sectionData('general').companyName || ''} onChange={handleChange('general', 'companyName')} />
                    <Input label="Support Email" type="email" value={sectionData('general').supportEmail || ''} onChange={handleChange('general', 'supportEmail')} />
                    <Select label="Timezone" options={timezoneOptions} value={sectionData('general').timezone || 'UTC'} onChange={handleChange('general', 'timezone')} />
                    <Select label="Language" options={languageOptions} value={sectionData('general').language || 'en'} onChange={handleChange('general', 'language')} />
                    <Box sx={{ pt: 1 }}>
                        <Button icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    // Notification preferences form - kept functionally identical per Hard Constraint 2
    const renderNotifications = () => (
        <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={e => { e.preventDefault(); handleSave('notifications'); }}>
                    <Stack spacing={2}>
                        {[
                            { key: 'ticketCreated', label: 'Ticket Created', desc: 'When a new ticket is submitted' },
                            { key: 'ticketAssigned', label: 'Ticket Assigned', desc: 'When a ticket is assigned to you' },
                            { key: 'ticketResolved', label: 'Ticket Resolved', desc: 'When a ticket is marked resolved' },
                            { key: 'slaBreachWarning', label: 'SLA Breach Warning', desc: '15 minutes before SLA breach' },
                            { key: 'slaBreached', label: 'SLA Breached', desc: 'When an SLA target is missed' },
                            { key: 'newComment', label: 'New Comment', desc: 'When someone comments on a ticket' },
                        ].map(item => {
                            const pref = sectionData('notifications')[item.key] || {};
                            return (
                                <Box
                                    key={item.key}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 2,
                                        borderRadius: 1.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: 'background.paper',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                                        <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                                    </Box>
                                    <Switch
                                        checked={pref.email !== false}
                                        onChange={e => {
                                            const current = sectionData('notifications');
                                            setSettings(prev => ({
                                                ...prev,
                                                notifications: {
                                                    ...current,
                                                    [item.key]: { ...current[item.key], email: e.target.checked }
                                                }
                                            }));
                                        }}
                                        color="primary"
                                    />
                                </Box>
                            );
                        })}
                    </Stack>
                    <Box sx={{ mt: 3 }}>
                        <Button icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );

    const renderAutomation = () => (
        <Card>
            <CardHeader><CardTitle>Automation Rules</CardTitle></CardHeader>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Auto-assign Tickets</Typography>
                        <Typography variant="caption" color="text.secondary">Automatically assign new tickets to available agents</Typography>
                    </Box>
                    <Switch
                        checked={settings.autoAssign !== false}
                        onChange={e => setSettings(prev => ({ ...prev, autoAssign: e.target.checked }))}
                        color="primary"
                    />
                </Box>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure more advanced automation rules in the Automation Center.
                    </Typography>
                    <Button variant="secondary">Open Automation Center</Button>
                </Paper>
            </CardContent>
        </Card>
    );

    const renderSecurity = () => (
        <Card>
            <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
            <CardContent>
                <Box component="form" onSubmit={e => { e.preventDefault(); handleSave('security'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                        }}
                    >
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Two-Factor Authentication</Typography>
                            <Typography variant="caption" color="text.secondary">Require 2FA for all team members</Typography>
                        </Box>
                        <Switch
                            checked={sectionData('security').twoFactorRequired || false}
                            onChange={handleChange('security', 'twoFactorRequired')}
                            color="primary"
                        />
                    </Box>
                    <Input
                        label="Minimum Password Length"
                        type="number"
                        value={sectionData('security').minPasswordLength || 8}
                        onChange={handleChange('security', 'minPasswordLength')}
                    />
                    <Box sx={{ pt: 1 }}>
                        <Button icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </Box>
                </Box>
                <Stack direction="row" spacing={1.5} sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button variant="secondary">View Login History</Button>
                    <Button variant="secondary">Manage API Keys</Button>
                </Stack>
            </CardContent>
        </Card>
    );

    const renderSla = () => <SlaPolicyList />;

    const renderPlaceholder = (sectionId) => (
        <Card>
            <CardHeader><CardTitle>{menuItems.find(m => m.id === sectionId)?.label}</CardTitle></CardHeader>
            <CardContent>
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configure your {menuItems.find(m => m.id === sectionId)?.label.toLowerCase()} settings here.
                    </Typography>
                    <Button variant="secondary">Configure</Button>
                </Paper>
            </CardContent>
        </Card>
    );

    return (
        <PageContainer title="Settings">
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
                    gap: 3,
                    alignItems: 'start',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 1,
                        bgcolor: 'background.paper',
                    }}
                >
                    <List sx={{ p: 0 }}>
                        {menuItems.map((item) => {
                            const isSelected = activeSection === item.id;
                            const IconComponent = item.icon;
                            return (
                                <ListItemButton
                                    key={item.id}
                                    selected={isSelected}
                                    onClick={() => setActiveSection(item.id)}
                                    sx={{
                                        borderRadius: 1.5,
                                        mb: 0.5,
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.soft',
                                            color: 'primary.main',
                                            '&:hover': {
                                                bgcolor: 'primary.soft',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: 'primary.main',
                                            }
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                                        <IconComponent size={18} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.875rem',
                                            fontWeight: isSelected ? 600 : 500
                                        }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Paper>

                <Box sx={{ minWidth: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                            <CircularProgress size={28} />
                        </Box>
                    ) : (
                        <>
                            {activeSection === 'general' && renderGeneral()}
                            {activeSection === 'notifications' && renderNotifications()}
                            {activeSection === 'automation' && renderAutomation()}
                            {activeSection === 'security' && renderSecurity()}
                            {activeSection === 'sla' && renderSla()}
                            {(activeSection === 'integrations' || activeSection === 'email') && renderPlaceholder(activeSection)}
                        </>
                    )}
                </Box>
            </Box>
        </PageContainer>
    );
}
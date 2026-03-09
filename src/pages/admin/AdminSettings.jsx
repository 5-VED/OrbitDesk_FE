import { useState, useEffect } from 'react';
import {
    Save,
    Globe,
    Lock,
    Mail,
    Bell,
    Database,
    RefreshCw,
    Info,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { settingsService } from '@/services/settings.service';
import './AdminSettings.css';

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

const defaultNotifications = [
    { key: 'ticketCreated', event: 'Ticket Created', desc: 'When a new ticket is submitted' },
    { key: 'ticketAssigned', event: 'Ticket Assigned', desc: 'When a ticket is assigned to an agent' },
    { key: 'ticketResolved', event: 'Ticket Resolved', desc: 'When a ticket is marked resolved' },
    { key: 'slaBreachWarning', event: 'SLA Breach Warning', desc: '15 minutes before SLA breach' },
    { key: 'slaBreached', event: 'SLA Breached', desc: 'When an SLA target is missed' },
    { key: 'newComment', event: 'New Comment', desc: 'When someone comments on a ticket' },
    { key: 'userSignup', event: 'User Signup', desc: 'When a new user registers' },
    { key: 'agentStatusChange', event: 'Agent Status Change', desc: 'When an agent goes online/offline' },
];

export function AdminSettings() {
    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await settingsService.get();
                setSettings(res.data || {});
            } catch (err) {
                console.error('Failed to load settings:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const getSectionData = (section) => settings[section] || {};

    const handleChange = (section, field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    const handleNotifChange = (key, channel) => (e) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: { ...(prev.notifications?.[key] || {}), [channel]: e.target.checked },
            },
        }));
    };

    const handleSave = async (category) => {
        try {
            setSaving(true);
            const res = await settingsService.update(category, settings[category] || {});
            setSettings(prev => ({ ...prev, [category]: res.data }));
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-settings" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    const general = getSectionData('general');
    const security = getSectionData('security');
    const email = getSectionData('email');
    const notifications = getSectionData('notifications');

    return (
        <div className="admin-settings">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">System Settings</h1>
                    <p className="admin-page-subtitle">Configure global application preferences</p>
                </div>
            </div>

            <div className="admin-settings-layout">
                <aside className="admin-settings-nav">
                    <nav>
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                className={`admin-settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <section.icon size={18} />
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="admin-settings-content">
                    {activeSection === 'general' && (
                        <Card>
                            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
                            <CardContent>
                                <form className="admin-settings-form" onSubmit={(e) => { e.preventDefault(); handleSave('general'); }}>
                                    <Input label="Application Name" value={general.appName || ''} onChange={handleChange('general', 'appName')} />
                                    <Input label="Support Email" type="email" value={general.supportEmail || ''} onChange={handleChange('general', 'supportEmail')} />
                                    <div className="admin-settings-form-row">
                                        <Select label="Timezone" options={timezoneOptions} value={general.timezone || 'UTC'} onChange={handleChange('general', 'timezone')} />
                                        <Select label="Language" options={languageOptions} value={general.language || 'en'} onChange={handleChange('general', 'language')} />
                                    </div>
                                    <Input label="Date Format" value={general.dateFormat || ''} onChange={handleChange('general', 'dateFormat')} />
                                    <div className="admin-settings-save-row">
                                        <Button type="submit" icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'security' && (
                        <Card>
                            <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
                            <CardContent>
                                <form className="admin-settings-form" onSubmit={(e) => { e.preventDefault(); handleSave('security'); }}>
                                    <div className="admin-settings-section-group">
                                        <h4 className="admin-settings-section-title">Password Policy</h4>
                                        <Input label="Minimum Password Length" type="number" value={security.minPasswordLength || 8} onChange={handleChange('security', 'minPasswordLength')} min={6} max={128} />
                                        <div className="admin-settings-toggles">
                                            <label className="admin-settings-toggle-item">
                                                <div className="admin-settings-toggle-info"><span className="admin-settings-toggle-label">Require uppercase letters</span></div>
                                                <input type="checkbox" className="admin-settings-toggle-input" checked={security.requireUppercase ?? true} onChange={handleChange('security', 'requireUppercase')} />
                                            </label>
                                            <label className="admin-settings-toggle-item">
                                                <div className="admin-settings-toggle-info"><span className="admin-settings-toggle-label">Require numbers</span></div>
                                                <input type="checkbox" className="admin-settings-toggle-input" checked={security.requireNumbers ?? true} onChange={handleChange('security', 'requireNumbers')} />
                                            </label>
                                            <label className="admin-settings-toggle-item">
                                                <div className="admin-settings-toggle-info"><span className="admin-settings-toggle-label">Require special characters</span></div>
                                                <input type="checkbox" className="admin-settings-toggle-input" checked={security.requireSpecial ?? true} onChange={handleChange('security', 'requireSpecial')} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="admin-settings-section-group">
                                        <h4 className="admin-settings-section-title">Session & Access</h4>
                                        <div className="admin-settings-form-row">
                                            <Input label="Session Timeout (minutes)" type="number" value={security.sessionTimeout || 30} onChange={handleChange('security', 'sessionTimeout')} />
                                            <Input label="Max Login Attempts" type="number" value={security.maxLoginAttempts || 5} onChange={handleChange('security', 'maxLoginAttempts')} />
                                        </div>
                                        <label className="admin-settings-toggle-item">
                                            <div className="admin-settings-toggle-info">
                                                <span className="admin-settings-toggle-label">Require Two-Factor Authentication</span>
                                                <span className="admin-settings-toggle-desc">All users must set up 2FA</span>
                                            </div>
                                            <input type="checkbox" className="admin-settings-toggle-input" checked={security.twoFactorRequired ?? false} onChange={handleChange('security', 'twoFactorRequired')} />
                                        </label>
                                    </div>
                                    <div className="admin-settings-save-row">
                                        <Button type="submit" icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Security Settings'}</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'email' && (
                        <Card>
                            <CardHeader><CardTitle>Email Configuration (SMTP)</CardTitle></CardHeader>
                            <CardContent>
                                <div className="admin-settings-info-banner">
                                    <Info size={16} />
                                    <span>These settings configure the outgoing email server for notifications, ticket replies, and system alerts.</span>
                                </div>
                                <form className="admin-settings-form" onSubmit={(e) => { e.preventDefault(); handleSave('email'); }}>
                                    <div className="admin-settings-form-row">
                                        <Input label="SMTP Host" value={email.smtpHost || ''} onChange={handleChange('email', 'smtpHost')} />
                                        <Input label="SMTP Port" type="number" value={email.smtpPort || 587} onChange={handleChange('email', 'smtpPort')} />
                                    </div>
                                    <div className="admin-settings-form-row">
                                        <Input label="SMTP Username" value={email.smtpUser || ''} onChange={handleChange('email', 'smtpUser')} />
                                        <Input label="SMTP Password" type="password" value={email.smtpPassword || ''} onChange={handleChange('email', 'smtpPassword')} />
                                    </div>
                                    <label className="admin-settings-toggle-item">
                                        <div className="admin-settings-toggle-info">
                                            <span className="admin-settings-toggle-label">Use TLS/SSL</span>
                                            <span className="admin-settings-toggle-desc">Encrypt SMTP connection (recommended)</span>
                                        </div>
                                        <input type="checkbox" className="admin-settings-toggle-input" checked={email.smtpSecure ?? true} onChange={handleChange('email', 'smtpSecure')} />
                                    </label>
                                    <div className="admin-settings-form-row">
                                        <Input label="From Name" value={email.fromName || ''} onChange={handleChange('email', 'fromName')} />
                                        <Input label="From Email" type="email" value={email.fromEmail || ''} onChange={handleChange('email', 'fromEmail')} />
                                    </div>
                                    <div className="admin-settings-save-row">
                                        <Button variant="secondary" icon={RefreshCw}>Test Connection</Button>
                                        <Button type="submit" icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Email Settings'}</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'notifications' && (
                        <Card>
                            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                            <CardContent>
                                <div className="admin-settings-notification-grid">
                                    {defaultNotifications.map((item) => (
                                        <div key={item.key} className="admin-notif-row">
                                            <div className="admin-notif-info">
                                                <span className="admin-notif-event">{item.event}</span>
                                                <span className="admin-notif-desc">{item.desc}</span>
                                            </div>
                                            <div className="admin-notif-channels">
                                                <label className="admin-notif-channel">
                                                    <input type="checkbox" checked={notifications?.[item.key]?.email ?? false} onChange={handleNotifChange(item.key, 'email')} />
                                                    <Mail size={14} />
                                                    <span>Email</span>
                                                </label>
                                                <label className="admin-notif-channel">
                                                    <input type="checkbox" checked={notifications?.[item.key]?.inApp ?? false} onChange={handleNotifChange(item.key, 'inApp')} />
                                                    <Bell size={14} />
                                                    <span>In-App</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="admin-settings-save-row">
                                    <Button icon={Save} disabled={saving} onClick={() => handleSave('notifications')}>{saving ? 'Saving...' : 'Save Notification Settings'}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'database' && (
                        <Card>
                            <CardHeader><CardTitle>Database & Storage</CardTitle></CardHeader>
                            <CardContent>
                                <div className="admin-settings-info-banner warning">
                                    <AlertTriangle size={16} />
                                    <span>Database settings are read from environment variables and cannot be changed here. This page is for monitoring only.</span>
                                </div>
                                <div className="admin-db-info">
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Database</span>
                                        <span className="admin-db-value">MongoDB</span>
                                        <Badge variant="success">Connected</Badge>
                                    </div>
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Cache</span>
                                        <span className="admin-db-value">Redis</span>
                                        <Badge variant="success">Connected</Badge>
                                    </div>
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Message Broker</span>
                                        <span className="admin-db-value">Kafka</span>
                                        <Badge variant="success">Connected</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

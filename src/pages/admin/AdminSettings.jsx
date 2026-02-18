import { useState } from 'react';
import {
    Settings,
    Save,
    Globe,
    Lock,
    Mail,
    Bell,
    Database,
    RefreshCw,
    Info,
    AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
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
        <div className="admin-settings">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">System Settings</h1>
                    <p className="admin-page-subtitle">Configure global application preferences</p>
                </div>
            </div>

            <div className="admin-settings-layout">
                {/* Settings Navigation */}
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

                {/* Settings Content */}
                <div className="admin-settings-content">
                    {activeSection === 'general' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="admin-settings-form">
                                    <Input
                                        label="Application Name"
                                        value={settings.appName}
                                        onChange={handleChange('appName')}
                                    />
                                    <Input
                                        label="Support Email"
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={handleChange('supportEmail')}
                                    />
                                    <div className="admin-settings-form-row">
                                        <Select
                                            label="Timezone"
                                            options={timezoneOptions}
                                            value={settings.timezone}
                                            onChange={handleChange('timezone')}
                                        />
                                        <Select
                                            label="Language"
                                            options={languageOptions}
                                            value={settings.language}
                                            onChange={handleChange('language')}
                                        />
                                    </div>
                                    <Input
                                        label="Date Format"
                                        value={settings.dateFormat}
                                        onChange={handleChange('dateFormat')}
                                    />
                                    <div className="admin-settings-save-row">
                                        <Button icon={Save}>Save Changes</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'security' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="admin-settings-form">
                                    <div className="admin-settings-section-group">
                                        <h4 className="admin-settings-section-title">Password Policy</h4>
                                        <Input
                                            label="Minimum Password Length"
                                            type="number"
                                            value={settings.minPasswordLength}
                                            onChange={handleChange('minPasswordLength')}
                                            min={6}
                                            max={128}
                                        />
                                        <div className="admin-settings-toggles">
                                            <label className="admin-settings-toggle-item">
                                                <div className="admin-settings-toggle-info">
                                                    <span className="admin-settings-toggle-label">Require uppercase letters</span>
                                                </div>
                                                <input type="checkbox" className="admin-settings-toggle-input" checked={settings.requireUppercase} onChange={handleChange('requireUppercase')} />
                                            </label>
                                            <label className="admin-settings-toggle-item">
                                                <div className="admin-settings-toggle-info">
                                                    <span className="admin-settings-toggle-label">Require numbers</span>
                                                </div>
                                                <input type="checkbox" className="admin-settings-toggle-input" checked={settings.requireNumbers} onChange={handleChange('requireNumbers')} />
                                            </label>
                                            <label className="admin-settings-toggle-item">
                                                <div className="admin-settings-toggle-info">
                                                    <span className="admin-settings-toggle-label">Require special characters</span>
                                                </div>
                                                <input type="checkbox" className="admin-settings-toggle-input" checked={settings.requireSpecial} onChange={handleChange('requireSpecial')} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="admin-settings-section-group">
                                        <h4 className="admin-settings-section-title">Session & Access</h4>
                                        <div className="admin-settings-form-row">
                                            <Input
                                                label="Session Timeout (minutes)"
                                                type="number"
                                                value={settings.sessionTimeout}
                                                onChange={handleChange('sessionTimeout')}
                                            />
                                            <Input
                                                label="Max Login Attempts"
                                                type="number"
                                                value={settings.maxLoginAttempts}
                                                onChange={handleChange('maxLoginAttempts')}
                                            />
                                        </div>
                                        <label className="admin-settings-toggle-item">
                                            <div className="admin-settings-toggle-info">
                                                <span className="admin-settings-toggle-label">Require Two-Factor Authentication</span>
                                                <span className="admin-settings-toggle-desc">All users must set up 2FA</span>
                                            </div>
                                            <input type="checkbox" className="admin-settings-toggle-input" checked={settings.twoFactorRequired} onChange={handleChange('twoFactorRequired')} />
                                        </label>
                                    </div>
                                    <div className="admin-settings-save-row">
                                        <Button icon={Save}>Save Security Settings</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'email' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Configuration (SMTP)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="admin-settings-info-banner">
                                    <Info size={16} />
                                    <span>These settings configure the outgoing email server for notifications, ticket replies, and system alerts.</span>
                                </div>
                                <form className="admin-settings-form">
                                    <div className="admin-settings-form-row">
                                        <Input
                                            label="SMTP Host"
                                            value={settings.smtpHost}
                                            onChange={handleChange('smtpHost')}
                                        />
                                        <Input
                                            label="SMTP Port"
                                            type="number"
                                            value={settings.smtpPort}
                                            onChange={handleChange('smtpPort')}
                                        />
                                    </div>
                                    <div className="admin-settings-form-row">
                                        <Input
                                            label="SMTP Username"
                                            value={settings.smtpUser}
                                            onChange={handleChange('smtpUser')}
                                        />
                                        <Input
                                            label="SMTP Password"
                                            type="password"
                                            value={settings.smtpPassword}
                                            onChange={handleChange('smtpPassword')}
                                        />
                                    </div>
                                    <label className="admin-settings-toggle-item">
                                        <div className="admin-settings-toggle-info">
                                            <span className="admin-settings-toggle-label">Use TLS/SSL</span>
                                            <span className="admin-settings-toggle-desc">Encrypt SMTP connection (recommended)</span>
                                        </div>
                                        <input type="checkbox" className="admin-settings-toggle-input" checked={settings.smtpSecure} onChange={handleChange('smtpSecure')} />
                                    </label>
                                    <div className="admin-settings-form-row">
                                        <Input
                                            label="From Name"
                                            value={settings.fromName}
                                            onChange={handleChange('fromName')}
                                        />
                                        <Input
                                            label="From Email"
                                            type="email"
                                            value={settings.fromEmail}
                                            onChange={handleChange('fromEmail')}
                                        />
                                    </div>
                                    <div className="admin-settings-save-row">
                                        <Button variant="secondary" icon={RefreshCw}>Test Connection</Button>
                                        <Button icon={Save}>Save Email Settings</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'notifications' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="admin-settings-notification-grid">
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
                                        <div key={item.event} className="admin-notif-row">
                                            <div className="admin-notif-info">
                                                <span className="admin-notif-event">{item.event}</span>
                                                <span className="admin-notif-desc">{item.desc}</span>
                                            </div>
                                            <div className="admin-notif-channels">
                                                <label className="admin-notif-channel">
                                                    <input type="checkbox" defaultChecked={item.email} />
                                                    <Mail size={14} />
                                                    <span>Email</span>
                                                </label>
                                                <label className="admin-notif-channel">
                                                    <input type="checkbox" defaultChecked={item.inApp} />
                                                    <Bell size={14} />
                                                    <span>In-App</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="admin-settings-save-row">
                                    <Button icon={Save}>Save Notification Settings</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'database' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Database & Storage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="admin-settings-info-banner warning">
                                    <AlertTriangle size={16} />
                                    <span>Database settings are read from environment variables and cannot be changed here. This page is for monitoring only.</span>
                                </div>
                                <div className="admin-db-info">
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Database</span>
                                        <span className="admin-db-value">MongoDB v7.0</span>
                                        <Badge variant="success">Connected</Badge>
                                    </div>
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Host</span>
                                        <span className="admin-db-value admin-db-mono">localhost:27017</span>
                                    </div>
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Database Name</span>
                                        <span className="admin-db-value admin-db-mono">orbitdesk</span>
                                    </div>
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Collections</span>
                                        <span className="admin-db-value">14</span>
                                    </div>
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Cache</span>
                                        <span className="admin-db-value">Redis (localhost:6379)</span>
                                        <Badge variant="success">Connected</Badge>
                                    </div>
                                    <div className="admin-db-row">
                                        <span className="admin-db-label">Message Broker</span>
                                        <span className="admin-db-value">Kafka (localhost:9092)</span>
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

import { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Zap,
    Link,
    Clock,
    Mail,
    Save
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Input';
import './Settings.css';

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
    const [settings, setSettings] = useState({
        companyName: 'Acme Corp',
        supportEmail: 'support@acme.com',
        timezone: 'America/New_York',
        language: 'en',
        autoAssign: true,
        emailNotifications: true,
        slackNotifications: false,
        twoFactor: true,
    });

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <PageContainer title="Settings">
            <div className="settings-page">
                {/* Settings Menu */}
                <aside className="settings-menu">
                    <nav>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                className={`settings-menu-item ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Settings Content */}
                <div className="settings-content">
                    {activeSection === 'general' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="settings-form">
                                    <Input
                                        label="Company Name"
                                        value={settings.companyName}
                                        onChange={handleChange('companyName')}
                                    />
                                    <Input
                                        label="Support Email"
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={handleChange('supportEmail')}
                                    />
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
                                    <Button icon={Save}>Save Changes</Button>
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
                                <div className="settings-toggles">
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Email Notifications</span>
                                            <span className="toggle-description">Receive email updates for ticket activity</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="toggle-input"
                                            checked={settings.emailNotifications}
                                            onChange={handleChange('emailNotifications')}
                                        />
                                    </label>
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Slack Notifications</span>
                                            <span className="toggle-description">Send notifications to Slack channels</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="toggle-input"
                                            checked={settings.slackNotifications}
                                            onChange={handleChange('slackNotifications')}
                                        />
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'automation' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Automation Rules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="settings-toggles">
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Auto-assign Tickets</span>
                                            <span className="toggle-description">Automatically assign new tickets to available agents</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="toggle-input"
                                            checked={settings.autoAssign}
                                            onChange={handleChange('autoAssign')}
                                        />
                                    </label>
                                </div>
                                <div className="automation-hint">
                                    <p>Configure more advanced automation rules in the Automation Center.</p>
                                    <Button variant="secondary">Open Automation Center</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'security' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="settings-toggles">
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Two-Factor Authentication</span>
                                            <span className="toggle-description">Require 2FA for all team members</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="toggle-input"
                                            checked={settings.twoFactor}
                                            onChange={handleChange('twoFactor')}
                                        />
                                    </label>
                                </div>
                                <div className="security-actions">
                                    <Button variant="secondary">View Login History</Button>
                                    <Button variant="secondary">Manage API Keys</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {(activeSection === 'sla' || activeSection === 'integrations' || activeSection === 'email') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{menuItems.find(m => m.id === activeSection)?.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="settings-placeholder">
                                    <p>Configure your {menuItems.find(m => m.id === activeSection)?.label.toLowerCase()} settings here.</p>
                                    <Button variant="secondary">Configure</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}

import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Zap,
    Link,
    Clock,
    Mail,
    Save,
    Loader2
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { SlaPolicyList } from '../features/settings/components/SlaPolicyList';
import { settingsService } from '../services/settings.service';
import { toast } from 'react-hot-toast';
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
                setSettings({
                    general: { companyName: '', supportEmail: '', timezone: 'UTC', language: 'en' },
                    notifications: {},
                    security: { twoFactor: false },
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const general = settings.general || {};
    const security = settings.security || {};

    const handleChange = (section, field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    const handleSave = async (category) => {
        try {
            setSaving(true);
            const res = await settingsService.update(category, settings[category] || {});
            setSettings(prev => ({ ...prev, [category]: res.data }));
            toast.success('Settings saved successfully');
        } catch (err) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <PageContainer title="Settings">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 size={32} className="animate-spin" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Settings">
            <div className="settings-page">
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

                <div className="settings-content">
                    {activeSection === 'general' && (
                        <Card>
                            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
                            <CardContent>
                                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleSave('general'); }}>
                                    <Input label="Company Name" value={general.appName || ''} onChange={handleChange('general', 'appName')} />
                                    <Input label="Support Email" type="email" value={general.supportEmail || ''} onChange={handleChange('general', 'supportEmail')} />
                                    <Select label="Timezone" options={timezoneOptions} value={general.timezone || 'UTC'} onChange={handleChange('general', 'timezone')} />
                                    <Select label="Language" options={languageOptions} value={general.language || 'en'} onChange={handleChange('general', 'language')} />
                                    <Button type="submit" icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'notifications' && (
                        <Card>
                            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                            <CardContent>
                                <div className="settings-toggles">
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Email Notifications</span>
                                            <span className="toggle-description">Receive email updates for ticket activity</span>
                                        </div>
                                        <input type="checkbox" className="toggle-input" checked={settings.notifications?.emailNotifications ?? true} onChange={handleChange('notifications', 'emailNotifications')} />
                                    </label>
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Slack Notifications</span>
                                            <span className="toggle-description">Send notifications to Slack channels</span>
                                        </div>
                                        <input type="checkbox" className="toggle-input" checked={settings.notifications?.slackNotifications ?? false} onChange={handleChange('notifications', 'slackNotifications')} />
                                    </label>
                                </div>
                                <Button icon={Save} disabled={saving} onClick={() => handleSave('notifications')} style={{ marginTop: '1rem' }}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'automation' && (
                        <Card>
                            <CardHeader><CardTitle>Automation Rules</CardTitle></CardHeader>
                            <CardContent>
                                <div className="settings-toggles">
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Auto-assign Tickets</span>
                                            <span className="toggle-description">Automatically assign new tickets to available agents</span>
                                        </div>
                                        <input type="checkbox" className="toggle-input" checked={general.autoAssign ?? true} onChange={handleChange('general', 'autoAssign')} />
                                    </label>
                                </div>
                                <div className="automation-hint">
                                    <p>Configure more advanced automation rules in the Automation Center.</p>
                                    <Button variant="secondary" disabled title="Coming soon">Open Automation Center</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'security' && (
                        <Card>
                            <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
                            <CardContent>
                                <div className="settings-toggles">
                                    <label className="toggle-item">
                                        <div className="toggle-info">
                                            <span className="toggle-label">Two-Factor Authentication</span>
                                            <span className="toggle-description">Require 2FA for all team members</span>
                                        </div>
                                        <input type="checkbox" className="toggle-input" checked={security.twoFactorRequired ?? false} onChange={handleChange('security', 'twoFactorRequired')} />
                                    </label>
                                </div>
                                <div className="security-actions">
                                    <Button variant="secondary" disabled title="Coming soon">View Login History</Button>
                                    <Button variant="secondary" disabled title="Coming soon">Manage API Keys</Button>
                                </div>
                                <Button icon={Save} disabled={saving} onClick={() => handleSave('security')} style={{ marginTop: '1rem' }}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'sla' && <SlaPolicyList />}

                    {(activeSection === 'integrations' || activeSection === 'email') && (
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

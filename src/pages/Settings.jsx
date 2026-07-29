import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    User,
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
import { Input, Select, Textarea } from '../components/ui/Input';
import { SlaPolicyList } from '../features/settings/components/SlaPolicyList';
import { settingsService } from '../services/settings.service';
import toast from 'react-hot-toast';
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
                <form className="settings-form" onSubmit={e => { e.preventDefault(); handleSave('general'); }}>
                    <Input label="Company Name" value={sectionData('general').companyName || ''} onChange={handleChange('general', 'companyName')} />
                    <Input label="Support Email" type="email" value={sectionData('general').supportEmail || ''} onChange={handleChange('general', 'supportEmail')} />
                    <Select label="Timezone" options={timezoneOptions} value={sectionData('general').timezone || 'UTC'} onChange={handleChange('general', 'timezone')} />
                    <Select label="Language" options={languageOptions} value={sectionData('general').language || 'en'} onChange={handleChange('general', 'language')} />
                    <Button icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </form>
            </CardContent>
        </Card>
    );

    const renderNotifications = () => (
        <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={e => { e.preventDefault(); handleSave('notifications'); }}>
                    <div className="settings-toggles">
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
                                <label key={item.key} className="toggle-item">
                                    <div className="toggle-info">
                                        <span className="toggle-label">{item.label}</span>
                                        <span className="toggle-description">{item.desc}</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle-input"
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
                                    />
                                </label>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <Button icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );

    const renderAutomation = () => (
        <Card>
            <CardHeader><CardTitle>Automation Rules</CardTitle></CardHeader>
            <CardContent>
                <div className="settings-toggles">
                    <label className="toggle-item">
                        <div className="toggle-info">
                            <span className="toggle-label">Auto-assign Tickets</span>
                            <span className="toggle-description">Automatically assign new tickets to available agents</span>
                        </div>
                        <input type="checkbox" className="toggle-input" checked={settings.autoAssign !== false} onChange={e => setSettings(prev => ({ ...prev, autoAssign: e.target.checked }))} />
                    </label>
                </div>
                <div className="automation-hint">
                    <p>Configure more advanced automation rules in the Automation Center.</p>
                    <Button variant="secondary">Open Automation Center</Button>
                </div>
            </CardContent>
        </Card>
    );

    const renderSecurity = () => (
        <Card>
            <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={e => { e.preventDefault(); handleSave('security'); }}>
                    <div className="settings-toggles">
                        <label className="toggle-item">
                            <div className="toggle-info">
                                <span className="toggle-label">Two-Factor Authentication</span>
                                <span className="toggle-description">Require 2FA for all team members</span>
                            </div>
                            <input type="checkbox" className="toggle-input" checked={sectionData('security').twoFactorRequired || false} onChange={handleChange('security', 'twoFactorRequired')} />
                        </label>
                    </div>
                    <Input label="Minimum Password Length" type="number" value={sectionData('security').minPasswordLength || 8} onChange={handleChange('security', 'minPasswordLength')} style={{ marginTop: 'var(--spacing-lg)' }} />
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <Button icon={Save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </form>
                <div className="security-actions">
                    <Button variant="secondary">View Login History</Button>
                    <Button variant="secondary">Manage API Keys</Button>
                </div>
            </CardContent>
        </Card>
    );

    const renderSla = () => <SlaPolicyList />;

    const renderPlaceholder = (sectionId) => (
        <Card>
            <CardHeader><CardTitle>{menuItems.find(m => m.id === sectionId)?.label}</CardTitle></CardHeader>
            <CardContent>
                <div className="settings-placeholder">
                    <p>Configure your {menuItems.find(m => m.id === sectionId)?.label.toLowerCase()} settings here.</p>
                    <Button variant="secondary">Configure</Button>
                </div>
            </CardContent>
        </Card>
    );

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
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-2xl)' }}>
                            <Loader2 size={24} className="spin" />
                        </div>
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
                </div>
            </div>
        </PageContainer>
    );
}
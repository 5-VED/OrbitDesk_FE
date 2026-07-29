import { useState } from 'react';
import {
    KeyRound,
    Plus,
    Copy,
    Eye,
    EyeOff,
    Trash2,
    CheckCheck,
    Loader2,
    AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import './AdminApiKeys.css';

const DEMO_KEYS = [
    { id: '1', name: 'Production API', key: 'sk_orbit_live_a1b2c3d4e5f6g7h8i9j0', scopes: ['tickets:read', 'tickets:write', 'users:read'], status: 'active', lastUsed: '2026-07-27T10:30:00Z', created: '2026-01-15T00:00:00Z' },
    { id: '2', name: 'Staging Integration', key: 'sk_orbit_test_k1l2m3n4o5p6q7r8s9t0', scopes: ['tickets:read', 'contacts:read'], status: 'active', lastUsed: '2026-07-26T14:00:00Z', created: '2026-03-01T00:00:00Z' },
    { id: '3', name: 'Mobile App', key: 'sk_orbit_test_u1v2w3x4y5z6a7b8c9d0', scopes: ['tickets:read', 'tickets:write'], status: 'revoked', lastUsed: '2026-06-01T08:00:00Z', created: '2026-02-10T00:00:00Z' },
];

const SCOPE_OPTIONS = [
    { value: 'tickets:read', label: 'Tickets (Read)' },
    { value: 'tickets:write', label: 'Tickets (Write)' },
    { value: 'users:read', label: 'Users (Read)' },
    { value: 'users:write', label: 'Users (Write)' },
    { value: 'contacts:read', label: 'Contacts (Read)' },
    { value: 'contacts:write', label: 'Contacts (Write)' },
    { value: 'reports:read', label: 'Reports (Read)' },
];

export function AdminApiKeys() {
    const [keys, setKeys] = useState(DEMO_KEYS);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyScopes, setNewKeyScopes] = useState(['tickets:read']);
    const [visibleKeys, setVisibleKeys] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    const toggleVisibility = (id) => {
        setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopy = async (key, id) => {
        try {
            await navigator.clipboard.writeText(key);
            setCopiedId(id);
            toast.success('API key copied to clipboard');
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    };

    const handleDelete = (id) => {
        setKeys(prev => prev.filter(k => k.id !== id));
        toast.success('API key deleted');
    };

    const handleCreate = () => {
        if (!newKeyName.trim()) {
            toast.error('Please enter a key name');
            return;
        }
        const newKey = {
            id: Date.now().toString(),
            name: newKeyName,
            key: `sk_orbit_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
            scopes: newKeyScopes,
            status: 'active',
            lastUsed: null,
            created: new Date().toISOString(),
        };
        setKeys(prev => [newKey, ...prev]);
        setNewKeyName('');
        setNewKeyScopes(['tickets:read']);
        setShowNewForm(false);
        toast.success('API key created successfully');
    };

    const toggleScope = (scope) => {
        setNewKeyScopes(prev =>
            prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="admin-api-keys">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">API Keys</h1>
                    <p className="admin-page-subtitle">Manage API keys for external integrations</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={() => setShowNewForm(true)}>Create New Key</Button>
                </div>
            </div>

            {showNewForm && (
                <Card className="admin-api-new-key">
                    <CardHeader>
                        <CardTitle>Create New API Key</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="admin-api-new-form">
                            <Input
                                label="Key Name"
                                placeholder="e.g., Production Integration"
                                value={newKeyName}
                                onChange={e => setNewKeyName(e.target.value)}
                            />
                            <div className="admin-api-scopes-group">
                                <label className="admin-api-scopes-label">Permissions (Scopes)</label>
                                <div className="admin-api-scopes-grid">
                                    {SCOPE_OPTIONS.map(opt => (
                                        <label key={opt.value} className="admin-api-scope-check">
                                            <input
                                                type="checkbox"
                                                checked={newKeyScopes.includes(opt.value)}
                                                onChange={() => toggleScope(opt.value)}
                                            />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="admin-api-form-actions">
                                <Button variant="ghost" onClick={() => setShowNewForm(false)}>Cancel</Button>
                                <Button onClick={handleCreate}>Generate Key</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="admin-api-keys-list">
                {keys.length === 0 ? (
                    <div className="admin-api-empty">
                        <KeyRound size={48} />
                        <p>No API keys created yet</p>
                    </div>
                ) : (
                    keys.map(key => (
                        <Card key={key.id} className="admin-api-key-card">
                            <CardContent>
                                <div className="admin-api-key-header">
                                    <div className="admin-api-key-info">
                                        <h3 className="admin-api-key-name">{key.name}</h3>
                                        <Badge variant={key.status === 'active' ? 'success' : 'secondary'}>
                                            {key.status}
                                        </Badge>
                                    </div>
                                    <div className="admin-api-key-actions">
                                        <button
                                            className="admin-api-key-action"
                                            onClick={() => handleCopy(key.key, key.id)}
                                            title="Copy key"
                                        >
                                            {copiedId === key.id ? <CheckCheck size={16} /> : <Copy size={16} />}
                                        </button>
                                        <button
                                            className="admin-api-key-action"
                                            onClick={() => toggleVisibility(key.id)}
                                            title={visibleKeys[key.id] ? 'Hide key' : 'Show key'}
                                        >
                                            {visibleKeys[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button
                                            className="admin-api-key-action danger"
                                            onClick={() => handleDelete(key.id)}
                                            title="Delete key"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="admin-api-key-value">
                                    <code className={visibleKeys[key.id] ? '' : 'admin-api-key-masked'}>
                                        {visibleKeys[key.id] ? key.key : key.key.substring(0, 20) + '••••••••••'}
                                    </code>
                                </div>
                                <div className="admin-api-key-meta">
                                    <span>Created: {formatDate(key.created)}</span>
                                    <span>Last used: {formatDate(key.lastUsed)}</span>
                                </div>
                                <div className="admin-api-key-scopes">
                                    {key.scopes.map(s => (
                                        <Badge key={s} variant="outline">{s}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="admin-api-keys-info">
                <AlertTriangle size={16} />
                <span>API keys grant full access to the permissions you assign. Keep them secure and rotate them regularly.</span>
            </div>
        </div>
    );
}
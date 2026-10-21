import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button as MuiButton,
    IconButton,
    TextField,
    Checkbox,
    FormControlLabel,
    Alert,
    Stack,
    Paper,
    Chip,
    Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    KeyRound,
    Plus,
    Copy,
    Eye,
    EyeOff,
    Trash2,
    CheckCheck,
    AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

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
        <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>API Keys</Typography>
                    <Typography variant="body2" color="text.secondary">Manage API keys for external integrations</Typography>
                </Box>
                <MuiButton
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={16} />}
                    onClick={() => setShowNewForm(true)}
                    sx={{ textTransform: 'none' }}
                >
                    Create New Key
                </MuiButton>
            </Box>

            {/* Create New Key Form */}
            {showNewForm && (
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Create New API Key
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Key Name"
                                placeholder="e.g., Production Integration"
                                value={newKeyName}
                                onChange={e => setNewKeyName(e.target.value)}
                                fullWidth
                                size="small"
                            />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Permissions (Scopes)
                                </Typography>
                                <Grid container spacing={1}>
                                    {SCOPE_OPTIONS.map(opt => (
                                        <Grid key={opt.value} size={{ xs: 12, sm: 6, md: 4 }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={newKeyScopes.includes(opt.value)}
                                                        onChange={() => toggleScope(opt.value)}
                                                    />
                                                }
                                                label={<Typography variant="body2">{opt.label}</Typography>}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                                <MuiButton variant="outlined" color="inherit" onClick={() => setShowNewForm(false)}>
                                    Cancel
                                </MuiButton>
                                <MuiButton variant="contained" color="primary" onClick={handleCreate}>
                                    Generate Key
                                </MuiButton>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* API Keys List */}
            <Stack spacing={2}>
                {keys.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                        <KeyRound size={48} color="var(--color-text-secondary, #94a3b8)" style={{ margin: '0 auto 12px' }} />
                        <Typography color="text.secondary">No API keys created yet</Typography>
                    </Paper>
                ) : (
                    keys.map(key => (
                        <Card key={key.id} variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {key.name}
                                        </Typography>
                                        <Badge variant={key.status === 'active' ? 'success' : 'default'}>
                                            {key.status}
                                        </Badge>
                                    </Box>
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title="Copy key">
                                            <IconButton size="small" onClick={() => handleCopy(key.key, key.id)}>
                                                {copiedId === key.id ? <CheckCheck size={16} color="#10b981" /> : <Copy size={16} />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={visibleKeys[key.id] ? 'Hide key' : 'Show key'}>
                                            <IconButton size="small" onClick={() => toggleVisibility(key.id)}>
                                                {visibleKeys[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete key">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(key.id)}>
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 1.25,
                                        px: 2,
                                        borderRadius: 1.5,
                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'grey.100',
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem',
                                        mb: 1.5,
                                        wordBreak: 'break-all'
                                    }}
                                >
                                    {visibleKeys[key.id] ? key.key : `${key.key.substring(0, 20)}••••••••••••••••••••`}
                                </Paper>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', fontSize: '0.8rem' }}>
                                        <span>Created: {formatDate(key.created)}</span>
                                        <span>Last used: {formatDate(key.lastUsed)}</span>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                        {key.scopes.map(s => (
                                            <Chip key={s} label={s} size="small" variant="outlined" sx={{ fontSize: '0.75rem', height: 22 }} />
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Stack>

            <Alert severity="warning" icon={<AlertTriangle size={18} />}>
                API keys grant full access to the permissions you assign. Keep them secure and rotate them regularly.
            </Alert>
        </Stack>
    );
}
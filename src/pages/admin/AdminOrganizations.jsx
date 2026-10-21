import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button as MuiButton,
    IconButton,
    TextField,
    InputAdornment,
    CircularProgress,
    Stack,
    Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Building2,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Users,
    Ticket,
    Globe,
    X
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { organizationService } from '@/features/organizations/api/organizations';

export function AdminOrganizations() {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await organizationService.list();
                setOrgs(res?.data || []);
            } catch (err) {
                console.error('Failed to load organizations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrgs();
    }, []);

    const filteredOrgs = orgs.filter(org =>
        !searchQuery ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.domains || []).some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
                <CircularProgress size={36} color="primary" />
                <Typography color="text.secondary">Loading organizations...</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {/* Page Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>Organizations</Typography>
                    <Typography variant="body2" color="text.secondary">Manage customer organizations and their settings</Typography>
                </Box>
                <MuiButton
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={16} />}
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{ textTransform: 'none' }}
                >
                    Add Organization
                </MuiButton>
            </Box>

            {/* Search Bar */}
            <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Search organizations by name or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} color="var(--color-text-secondary, #94a3b8)" />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                                        <X size={14} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }
                    }}
                />
            </Card>

            {/* Org Cards Grid */}
            <Grid container spacing={3}>
                {filteredOrgs.map((org) => (
                    <Grid key={org._id} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                height: '100%',
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'primary.light',
                                        color: 'primary.main'
                                    }}
                                >
                                    <Building2 size={24} />
                                </Box>
                                <Stack direction="row" spacing={0.5}>
                                    <Tooltip title="View">
                                        <IconButton size="small">
                                            <Eye size={15} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton size="small">
                                            <Edit size={15} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton size="small" color="error">
                                            <Trash2 size={15} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>

                            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                {org.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.85rem', mb: 2 }}>
                                <Globe size={14} />
                                <span>{(org.domains || [])[0] || 'No domain'}</span>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Badge variant={org.is_active ? 'success' : 'default'}>
                                    {org.is_active ? 'active' : 'inactive'}
                                </Badge>
                            </Box>

                            <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, fontSize: '0.85rem', color: 'text.secondary' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <Users size={14} />
                                        <span>{org.userCount || 0} users</span>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <Ticket size={14} />
                                        <span>{org.ticketCount || 0} tickets</span>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    SLA: <strong>{org.slaPolicy || 'Default'}</strong>
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Org Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Add Organization"
            >
                <Box component="form" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Input label="Organization Name" placeholder="e.g. Acme Corp" required />
                    <Input label="Domain" placeholder="e.g. acme.com" />
                    <Input label="Contact Email" type="email" placeholder="admin@acme.com" />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                        <MuiButton variant="outlined" color="inherit" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </MuiButton>
                        <MuiButton type="submit" variant="contained" color="primary" startIcon={<Plus size={16} />}>
                            Create Organization
                        </MuiButton>
                    </Box>
                </Box>
            </Modal>
        </Stack>
    );
}

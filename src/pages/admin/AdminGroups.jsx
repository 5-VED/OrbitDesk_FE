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
    Tooltip,
    Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    UsersRound,
    Plus,
    Edit,
    Trash2,
    Search,
    X
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { groupService } from '@/features/groups/api/groups';

export function AdminGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await groupService.list();
                setGroups(res?.data || []);
            } catch (err) {
                console.error('Failed to load groups:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(g =>
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
                <CircularProgress size={36} color="primary" />
                <Typography color="text.secondary">Loading groups...</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {/* Page Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>Agent Groups</Typography>
                    <Typography variant="body2" color="text.secondary">Organize agents into teams for ticket routing and workload management</Typography>
                </Box>
                <MuiButton
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={16} />}
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{ textTransform: 'none' }}
                >
                    Create Group
                </MuiButton>
            </Box>

            {/* Search */}
            <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Search groups..."
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

            {/* Groups Grid */}
            <Grid container spacing={3}>
                {filteredGroups.map((group) => (
                    <Grid key={group._id} size={{ xs: 12, sm: 6, lg: 4 }}>
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
                                    <UsersRound size={22} />
                                </Box>
                                <Stack direction="row" spacing={0.5}>
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
                                {group.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                                {group.description || 'No description provided'}
                            </Typography>

                            {/* Stats */}
                            <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                        {group.memberCount || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Members
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box>
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                        {group.ticketCount || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Tickets
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Group Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create Agent Group"
            >
                <Box component="form" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Input label="Group Name" placeholder="e.g. Tier 1 Support" required />
                    <Input label="Description" placeholder="Brief description of this group" />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                        <MuiButton variant="outlined" color="inherit" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </MuiButton>
                        <MuiButton type="submit" variant="contained" color="primary" startIcon={<Plus size={16} />}>
                            Create Group
                        </MuiButton>
                    </Box>
                </Box>
            </Modal>
        </Stack>
    );
}

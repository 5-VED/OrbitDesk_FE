import { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Paper,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Typography,
    Chip
} from '@mui/material';
import { Search as SearchIcon, FileText, User, Book } from 'lucide-react';
import { api } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

export function SearchDropdown() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            setLoading(true);
            setOpen(true);
            try {
                const response = await api.get('/search', { params: { q: value } });
                setResults(response.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]);
            setOpen(false);
        }
    };

    const handleSelect = (item) => {
        setOpen(false);
        setQuery('');
        if (item.type === 'ticket') navigate(`/tickets/${item.id}`);
        if (item.type === 'customer') navigate(`/contacts/${item.id}`);
        if (item.type === 'kb') navigate(`/knowledge-base/${item.id}`);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'ticket': return <FileText size={16} />;
            case 'customer': return <User size={16} />;
            case 'kb': return <Book size={16} />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <Box ref={containerRef} sx={{ position: 'relative', width: '100%', maxWidth: 360 }}>
            <TextField
                size="small"
                fullWidth
                placeholder="Search tickets, customers, articles..."
                value={query}
                onChange={handleSearch}
                onFocus={() => { if (query.length > 2) setOpen(true); }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon size={18} color="var(--color-text-secondary, #94a3b8)" />
                            </InputAdornment>
                        )
                    }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }
                }}
            />

            {open && (
                <Paper
                    elevation={6}
                    sx={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        maxHeight: 320,
                        overflowY: 'auto'
                    }}
                >
                    {loading ? (
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <CircularProgress size={18} />
                            <Typography variant="body2" color="text.secondary">Searching...</Typography>
                        </Box>
                    ) : results.length > 0 ? (
                        <List disablePadding>
                            {results.map((res, i) => (
                                <ListItemButton
                                    key={i}
                                    onClick={() => handleSelect(res)}
                                    sx={{ py: 1, px: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                                        {getIcon(res.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={res.title}
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                    />
                                    <Chip label={res.type} size="small" variant="outlined" sx={{ textTransform: 'capitalize', height: 20, fontSize: '0.7rem' }} />
                                </ListItemButton>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No results found for "{query}"
                            </Typography>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}

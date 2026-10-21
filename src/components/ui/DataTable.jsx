import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export function DataTable({
    columns = [],
    data = [],
    selectable = false,
    selectedRows = [],
    onSelectRow,
    onSelectAll,
    loading = false,
    emptyMessage = 'No data available',
    onRowClick,
    className = '',
    rowKey = 'id',
    sx = {},
}) {
    const getRowId = (row) => row[rowKey] || row.id || row._id;

    const allSelected = data.length > 0 && selectedRows.length === data.length;
    const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

    const renderEmpty = () => {
        const title = typeof emptyMessage === 'object' ? emptyMessage.title : emptyMessage;
        const subtitle = typeof emptyMessage === 'object'
            ? emptyMessage.subtitle
            : 'Try adjusting your search or create a new entry.';

        return (
            <TableRow>
                <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    align="center"
                    sx={{ py: 6 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                backgroundColor: 'background.subtle',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'text.tertiary',
                                mb: 1,
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                <line x1="12" y1="12" x2="12" y2="16" />
                                <line x1="10" y1="14" x2="14" y2="14" />
                            </svg>
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <TableContainer
            component={Paper}
            variant="outlined"
            className={`data-table-wrapper ${className}`}
            sx={{
                borderRadius: 2,
                overflowX: 'auto',
                ...sx,
            }}
        >
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        {selectable && (
                            <TableCell padding="checkbox" sx={{ width: 48, pl: 2 }}>
                                <Checkbox
                                    size="small"
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={(e) => onSelectAll?.(e.target.checked)}
                                />
                            </TableCell>
                        )}
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                align={col.align || 'left'}
                                sx={{
                                    width: col.width,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    color: 'text.secondary',
                                    backgroundColor: 'background.subtle',
                                    py: 1.5,
                                }}
                            >
                                {col.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (selectable ? 1 : 0)}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                                    <CircularProgress size={20} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Loading...
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        renderEmpty()
                    ) : (
                        data.map((row, idx) => {
                            const rowId = getRowId(row);
                            const isSelected = selectedRows.includes(rowId);
                            return (
                                <TableRow
                                    key={rowId || idx}
                                    hover
                                    selected={isSelected}
                                    onClick={() => onRowClick?.(row)}
                                    sx={{
                                        cursor: onRowClick ? 'pointer' : 'default',
                                        transition: 'background-color 0.15s ease',
                                    }}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox" sx={{ pl: 2 }}>
                                            <Checkbox
                                                size="small"
                                                checked={isSelected}
                                                onChange={(e) => onSelectRow?.(rowId, e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            align={col.align || 'left'}
                                            sx={{ py: 1.75 }}
                                        >
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DataTable;

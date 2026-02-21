import './DataTable.css';

export function DataTable({
    columns,
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
            <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="data-table-empty">
                    <div className="data-table-empty-inner">
                        <div className="data-table-empty-icon" aria-hidden="true">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                <line x1="12" y1="12" x2="12" y2="16" />
                                <line x1="10" y1="14" x2="14" y2="14" />
                            </svg>
                        </div>
                        <p className="data-table-empty-title">{title}</p>
                        {subtitle && <p className="data-table-empty-sub">{subtitle}</p>}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className={`data-table-wrapper ${className}`}>
            <table className="data-table">
                <thead>
                    <tr>
                        {selectable && (
                            <th className="data-table-checkbox">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={el => el && (el.indeterminate = someSelected)}
                                    onChange={(e) => onSelectAll?.(e.target.checked)}
                                />
                            </th>
                        )}
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={{ width: col.width, textAlign: col.align || 'left' }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0)} className="data-table-loading">
                                <div className="data-table-spinner" />
                                Loading...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        renderEmpty()
                    ) : (
                        data.map((row, idx) => {
                            const rowId = getRowId(row);
                            return (
                                <tr
                                    key={rowId || idx}
                                    className={selectedRows.includes(rowId) ? 'selected' : ''}
                                    onClick={() => onRowClick?.(row)}
                                    style={onRowClick ? { cursor: 'pointer' } : undefined}
                                >
                                    {selectable && (
                                        <td className="data-table-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(rowId)}
                                                onChange={(e) => onSelectRow?.(rowId, e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            style={{ textAlign: col.align || 'left' }}
                                        >
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

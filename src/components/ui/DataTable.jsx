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
    className = '',
    rowKey = 'id', // Support for custom row key (e.g., '_id' for MongoDB)
}) {
    const getRowId = (row) => row[rowKey] || row.id || row._id;

    const allSelected = data.length > 0 && selectedRows.length === data.length;
    const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

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
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0)} className="data-table-empty">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => {
                            const rowId = getRowId(row);
                            return (
                                <tr
                                    key={rowId || idx}
                                    className={selectedRows.includes(rowId) ? 'selected' : ''}
                                >
                                    {selectable && (
                                        <td className="data-table-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(rowId)}
                                                onChange={(e) => onSelectRow?.(rowId, e.target.checked)}
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


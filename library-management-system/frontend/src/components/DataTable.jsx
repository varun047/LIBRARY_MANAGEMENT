export default function DataTable({ columns, rows, emptyMessage = 'No records found.' }) {
  return (
    <div className="table-responsive">
      <table className="table table-modern align-middle mb-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-4">
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((column) => (
                <td key={`${column.key}-${idx}`}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

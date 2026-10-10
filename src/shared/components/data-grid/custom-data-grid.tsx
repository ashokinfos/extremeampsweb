import type { DataGridProps } from '@mui/x-data-grid';

import { DataGrid } from '@mui/x-data-grid';

interface CustomDataGridProps extends Omit<DataGridProps, 'sx'> {
  sx?: DataGridProps['sx'];
}

export function CustomDataGrid({ sx, ...props }: CustomDataGridProps) {
  return (
    <DataGrid
      getRowId={(row) => row.Id}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 15 },
        },
      }}
      pageSizeOptions={[10, 15, 25, 50, 100]}
      pagination
      getRowHeight={() => 55}
      sx={{
        border: 'none',
        borderRadius: 2,
        '& .MuiDataGrid-main': {
          borderRadius: 2,
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'var(--palette-background-neutral)',
          borderBottom: '2px solid var(--palette-divider)',
          borderRadius: '8px 8px 0 0',
        },
        '& .MuiDataGrid-columnHeader': {
          fontWeight: 600,
          fontSize: '0.875rem',
          color: 'var(--palette-text-secondary)',
          '&:focus': {
            outline: 'none',
          },
        },
        '& .MuiDataGrid-columnSeparator': {
          color: 'var(--palette-divider)',
        },
        '& .MuiDataGrid-row': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'var(--palette-action-hover)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
          '&:nth-of-type(even)': {
            backgroundColor: 'var(--palette-background-neutral)',
          },
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
          fontSize: '0.875rem',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          '&:focus': {
            outline: 'none',
          },
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '2px solid var(--palette-divider)',
          backgroundColor: 'var(--palette-background-neutral)',
          borderRadius: '0 0 8px 8px',
        },
        '& .MuiTablePagination-root': {
          overflow: 'hidden',
          color: 'var(--palette-text-secondary)',
        },
        '& .MuiTablePagination-selectIcon': {
          color: 'var(--palette-text-secondary)',
        },
        '& .MuiDataGrid-selectedRowCount': {
          color: 'var(--palette-text-secondary)',
        },
        '& .MuiDataGrid-overlay': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
        },
        ...sx,
      }}
      {...props}
    />
  );
}

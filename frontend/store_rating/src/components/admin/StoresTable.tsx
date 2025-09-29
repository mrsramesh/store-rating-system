import React, { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridFilterModel,
} from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Store } from '../../types';
import StoreForm from '../forms/StoreForm';

interface StoresTableProps {
  stores: Store[];
}

const StoresTable: React.FC<StoresTableProps> = ({ stores }) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'name', sort: 'asc' },
  ]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [openDialog, setOpenDialog] = useState(false);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Store Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'address', headerName: 'Address', width: 300 },
    { field: 'overallRating', headerName: 'Rating', width: 130 },
    { field: 'totalRatings', headerName: 'Total Ratings', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewDetails(params.row.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const handleViewDetails = (storeId: string) => {
    console.log('View store details:', storeId);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          Add New Store
        </Button>
      </Box>
      
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={stores}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Store</DialogTitle>
        <DialogContent>
          <StoreForm onSuccess={() => setOpenDialog(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StoresTable;
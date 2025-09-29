import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { dashboardService } from '../../services/api';

interface StoreStats {
  storeId: string;
  storeName: string;
  total_ratings: number;
  avg_rating: number;
  recent_ratings: Array<{
    userName: string;
    rating: number;
    date: string;
  }>;
}

interface StoreOwnerDashboardData {
  total_stores: number;
  total_ratings: number;
  store_stats: StoreStats[];
}

const StoreOwnerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<StoreOwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardService.getStoreOwnerDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Store Owner Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Stores
              </Typography>
              <Typography variant="h4">
                {dashboardData?.total_stores}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Ratings
              </Typography>
              <Typography variant="h4">
                {dashboardData?.total_ratings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {dashboardData?.store_stats.map((store) => (
        <Card key={store.storeId} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {store.storeName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Average Rating: {store.avg_rating} | Total Ratings: {store.total_ratings}
            </Typography>
            
            {store.recent_ratings.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Recent Ratings
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {store.recent_ratings.map((rating, index) => (
                        <TableRow key={index}>
                          <TableCell>{rating.userName}</TableCell>
                          <TableCell>{rating.rating}</TableCell>
                          <TableCell>{new Date(rating.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StoreOwnerDashboard;
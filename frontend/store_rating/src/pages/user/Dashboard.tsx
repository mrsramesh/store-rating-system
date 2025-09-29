// src/pages/user/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Rating,
  Box,
  Button,
} from '@mui/material';
import { Store } from '../../types';
import { storeService } from '../../services/api';

const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await storeService.getStores();
      setStores(response.data.data);
    } catch (error) {
      console.error('Failed to load stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    try {
      await storeService.submitRating(storeId, rating);
      loadStores(); // Reload to reflect changes
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Typography>Loading stores...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stores Directory
      </Typography>
      
      <TextField
        fullWidth
        label="Search stores by name or address"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      
      <Grid container spacing={3}>
        {filteredStores.map((store) => (
          <Grid item xs={12} md={6} key={store.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {store.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {store.address}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={store.overallRating} readOnly precision={0.1} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({store.totalRatings} ratings)
                  </Typography>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Your Rating:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    value={store.userRating || 0}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleRatingSubmit(store.id, newValue);
                      }
                    }}
                  />
                  {store.userRating && (
                    <Button
                      size="small"
                      onClick={() => handleRatingSubmit(store.id, 0)}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserDashboard;
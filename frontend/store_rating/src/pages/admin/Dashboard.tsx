// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import { DashboardStats, User, Store } from '../../types';
import { dashboardService, userService, storeService } from '../../services/api';
import UsersTable from '../../components/admin/UsersTable';
import StoresTable from '../../components/admin/StoresTable';
import StatsCard from '../../components/dashboard/StatsCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        dashboardService.getAdminDashboard(),
        userService.getUsers(),
        storeService.getStores(),
      ]);
      
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setStores(storesRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon="people"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard
              title="Total Stores"
              value={stats.totalStores}
              icon="store"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard
              title="Total Ratings"
              value={stats.totalRatings}
              icon="star"
            />
          </Grid>
        </Grid>
      )}

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Users Management" />
            <Tab label="Stores Management" />
            <Tab label="Recent Activities" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <UsersTable users={users} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <StoresTable stores={stores} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {/* Recent Activities Component */}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
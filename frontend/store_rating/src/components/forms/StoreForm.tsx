import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import { storeSchema } from '../../utils/validation';
import { storeService } from '../../services/api';

interface StoreFormProps {
  onSuccess: () => void;
}

interface StoreFormData {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

const StoreForm: React.FC<StoreFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormData>();

  const onSubmit = async (data: StoreFormData) => {
    try {
      await storeService.createStore(data);
      onSuccess();
    } catch (error) {
      console.error('Failed to create store:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Store Name"
        margin="normal"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        fullWidth
        label="Address"
        multiline
        rows={3}
        margin="normal"
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message}
      />
      <TextField
        fullWidth
        label="Owner ID"
        margin="normal"
        {...register('ownerId')}
        error={!!errors.ownerId}
        helperText={errors.ownerId?.message}
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Create Store'}
      </Button>
    </Box>
  );
};

export default StoreForm;
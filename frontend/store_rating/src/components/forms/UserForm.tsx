// src/components/forms/UserForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { registerSchema } from '../../utils/validation';
import { userService } from '../../services/api';

interface UserFormProps {
  onSuccess: () => void;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  role: string;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await userService.createUser(data);
      onSuccess();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Name"
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
        label="Password"
        type="password"
        margin="normal"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
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
        select
        label="Role"
        margin="normal"
        defaultValue="user"
        {...register('role')}
      >
        <MenuItem value="user">Normal User</MenuItem>
        <MenuItem value="store_owner">Store Owner</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Create User'}
      </Button>
    </Box>
  );
};

export default UserForm;
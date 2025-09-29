// src/utils/validation.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().min(10, 'Name must be at least 10 characters').max(60, 'Name must not exceed 60 characters').required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/^(?=.*[!@#$%^&*])/, 'Password must contain at least one special character')
    .required('Password is required'),
  address: yup.string().max(400, 'Address must not exceed 400 characters'),
});

export const storeSchema = yup.object({
  name: yup.string().required('Store name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  address: yup.string().max(400, 'Address must not exceed 400 characters'),
  ownerId: yup.string().required('Owner is required'),
});

export const ratingSchema = yup.object({
  rating_value: yup.number().min(1).max(5).required('Rating is required'),
});
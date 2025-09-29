// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useCallback } from 'react';
import { logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const hasRole = useCallback((role: string) => {
    return auth.user?.role === role;
  }, [auth.user]);

  return {
    ...auth,
    logout: handleLogout,
    isAdmin: hasRole('admin'),
    isStoreOwner: hasRole('store_owner'),
    isUser: hasRole('user'),
  };
};
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';

// Hook for password update
export const useUpdatePassword = () => {
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: (passwordData) => authApi.updatePassword(token, passwordData),
    onSuccess: () => {
      console.log('Password updated successfully');
    },
    onError: (error) => {
      console.error('Password update failed:', error);
    },
  });
};

// Hook for forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      console.log('Password reset email sent');
    },
    onError: (error) => {
      console.error('Forgot password failed:', error);
    },
  });
};

// Hook for reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      console.log('Password reset successfully');
    },
    onError: (error) => {
      console.error('Password reset failed:', error);
    },
  });
};

// Hook for health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: authApi.healthCheck,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};
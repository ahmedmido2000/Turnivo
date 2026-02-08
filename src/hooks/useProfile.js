import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile } from '../api/authApi';
import { getAccessToken, updateUserData } from '../utils/authStorage';

/**
 * Custom hook to fetch user profile
 * @returns {Object} Query object with profile data and states
 */
export const useUserProfile = () => {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: ['userProfile', accessToken],
    queryFn: () => getUserProfile(accessToken),
    enabled: false, // Disable auto-fetch since API might not support GET
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: false, // Don't retry on error
    onError: (error) => {
      console.error('Profile fetch error:', error);
      // Don't show error toast since we're using localStorage data
    },
  });
};

/**
 * Custom hook to update user profile
 * @returns {Object} Mutation object with mutate function and states
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  return useMutation({
    mutationFn: (profileData) => updateUserProfile(profileData, accessToken),
    onSuccess: (data, variables) => {
      console.log('Profile update response:', data);
      
      // Check if update was successful
      if (data.status === 1) {
        toast.success(data.message || 'Profile updated successfully!');
        
        // Update localStorage with the new data
        updateUserData(variables);
        
        // Invalidate and refetch profile data
        queryClient.invalidateQueries(['userProfile']);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

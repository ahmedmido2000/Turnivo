import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getUserInfo, submitContactForm } from '../api/authApi';
import { getAccessToken, getUserData } from '../utils/authStorage';

/**
 * Custom hook to fetch user info
 * @returns {Object} Query object with user info data and states
 */
export const useUserInfo = () => {
  const accessToken = getAccessToken();
  const storedUserData = getUserData();
  const userId = storedUserData?.user_id;

  return useQuery({
    queryKey: ['userInfo', accessToken, userId],
    queryFn: () => getUserInfo(accessToken, userId),
    enabled: !!(accessToken && userId), // Only run if we have both token and user ID
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    onError: (error) => {
      console.error('User info fetch error:', error);
    },
  });
};

/**
 * Custom hook to submit contact form
 * @returns {Object} Mutation object with mutate function and states
 */
export const useContactForm = () => {
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data) => {
      console.log('Contact form response:', data);
      
      if (data.status === 1) {
        toast.success(data.message || 'Message sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    },
    onError: (error) => {
      console.error('Contact form error:', error);
      toast.error(error.message || 'Failed to send message');
    },
  });
};

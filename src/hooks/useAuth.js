import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginUser, activateUser } from '../api/authApi';
import { saveUserEmail, saveActivationCode } from '../utils/authStorage';
import { setCredentials } from '../store/authSlice';

const resolveDashboardPath = (roleId) => {
  const id = Number(roleId);
  if (id === 3) return '/client/dashboard';
  if (id === 4) return '/cleaner/cleaning-requests';
  if (id === 5) return '/supervisor/dashboard';
  if (id === 6) return '/guest/list';
  return '/';
};

/**
 * Custom hook for login mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('Login API Response:', data); // Debug log
      
      // Check if login was successful
      if (data.status === 1 && data.data && data.data.length > 0) {
        const responseData = data.data[0];
        
        // Check inner status as well
        if (responseData.status === "0" || responseData.status === 0) {
          toast.error(responseData.message || 'Login failed. Please try again.');
          return;
        }
        
        // Save email for activation step
        saveUserEmail(responseData.email || '');
        
        // Save activation code (for development/debugging)
        if (responseData.activation_code) {
          saveActivationCode(responseData.activation_code);
          console.log('Activation code:', responseData.activation_code); // For development
        }
        
        // Show success message
        toast.success(responseData.message || 'Code sent to your email!');
        
        // Navigate to activation page
        navigate('/activation-code');
      } else {
        toast.error('Login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Login API Error:', error); // Debug log
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};

/**
 * Custom hook for activation mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export const useActivate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: activateUser,
    onSuccess: (data) => {
      console.log('Activation API Response:', data); // Debug log to see full response
      
      // Check if activation was successful
      if (data.status === 1 && data.data && data.data.length > 0) {
        const responseData = data.data[0];
        
        // Check the inner status field - it should be 1 for success
        // Some APIs return status as string "1" or "0", others as number 1 or 0
        const innerStatus = responseData.status;
        
        if (innerStatus === "0" || innerStatus === 0) {
          // Activation failed - show error and DON'T navigate
          toast.error(responseData.message || 'Invalid activation code. Please try again.');
          return; // Important: return here to prevent navigation
        }
        
        // Only proceed if inner status is success (1 or "1")
        if (innerStatus === 1 || innerStatus === "1") {
          // Save user data and token to Redux + localStorage
          dispatch(setCredentials(responseData));
          const roleId = responseData?.data?.user_type;
          const destination = resolveDashboardPath(roleId);
          
          // Show success message
          toast.success(responseData.message || 'Login successful!');
          
          // Clear session storage
          sessionStorage.removeItem('user_email');
          sessionStorage.removeItem('activation_code');
          
          // Navigate to dashboard
          navigate(destination);
        } else {
          toast.error(responseData.message || 'Activation failed. Please try again.');
        }
      } else {
        toast.error('Activation failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Activation API Error:', error); // Debug log
      toast.error(error.message || 'Invalid activation code. Please try again.');
    },
  });
};

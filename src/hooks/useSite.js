import { useQuery, useMutation } from '@tanstack/react-query';
import { getServicesData, sendContactForm, getTermsAndConditions, getCities } from '../api/generalSiteApi';

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServicesData,
    staleTime: 0, // Mark data as stale immediately
    refetchOnMount: 'always', // Always refetch when component mounts
  });
};

export const useContactMutation = () => {
  return useMutation({
    mutationFn: sendContactForm,
  });
};

export const useTerms = () => {
  return useQuery({
    queryKey: ['terms'],
    queryFn: getTermsAndConditions,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};

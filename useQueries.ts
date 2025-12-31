import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CustomerContact } from '../backend';

interface SaveCustomerDataParams {
  email: string;
  mobile: string;
}

export function useSaveCustomerData() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, mobile }: SaveCustomerDataParams) => {
      // Wait for actor to be available if it's still fetching
      if (actorFetching) {
        throw new Error('Actor is still initializing. Please try again.');
      }
      
      if (!actor) {
        throw new Error('Unable to connect to the backend. Please refresh the page and try again.');
      }
      
      return actor.saveCustomerContact(email, mobile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerContacts'] });
    },
  });
}

export function useGetAllCustomerContacts(enabled: boolean = false) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CustomerContact[]>({
    queryKey: ['customerContacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllCustomerContacts();
    },
    enabled: !!actor && !actorFetching && enabled,
    retry: false,
  });
}

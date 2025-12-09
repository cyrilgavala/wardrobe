import { useQuery } from '@tanstack/react-query';
import { itemService } from '../services/itemService';

export function useItems(category?: string) {
  return useQuery({
    queryKey: ['items', category],
    queryFn: () => itemService.getAllItems(category)
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => itemService.getItem(id),
    enabled: !!id
  });
}

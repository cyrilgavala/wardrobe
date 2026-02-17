import { useQuery } from '@tanstack/react-query';
import { itemService } from '../services/itemService';

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => itemService.getAllItems()
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => itemService.getItem(id),
    enabled: !!id
  });
}

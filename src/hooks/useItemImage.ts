import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { itemService } from '../services/itemService';

/**
 * Custom hook to load and manage item images with authentication
 * Fetches images from the service which handles API communication
 * Handles blob conversion to object URLs and cleanup
 * @param itemId - The ID of the item to load the image for
 * @returns Object containing imageSrc (blob URL) and imageError (boolean)
 */
export function useItemImage(itemId: string) {
  const objectUrlRef = useRef<string | null>(null);

  const { data: blob, isLoading, isError } = useQuery({
    queryKey: ['itemImage', itemId],
    queryFn: () => itemService.getItemImage(itemId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Convert blob to object URL and handle cleanup
  useEffect(() => {
    // Cleanup previous URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // Create new URL if blob exists
    if (blob) {
      objectUrlRef.current = URL.createObjectURL(blob);
    }

    // Cleanup on unmount
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [blob]);

  return { imageSrc: objectUrlRef.current, isLoading, imageError: isError };
}
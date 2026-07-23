import { useQuery } from '@tanstack/react-query';
import client from '../api/client';

export function useCatalogList(params) {
  return useQuery({
    queryKey: ['catalog', params],
    queryFn: async () => {
      const { data } = await client.get('/catalog', { params });
      return data;
    },
    keepPreviousData: true,
  });
}

export function useCatalogItem(id) {
  return useQuery({
    queryKey: ['catalog-item', id],
    queryFn: async () => {
      const { data } = await client.get(`/catalog/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data } = await client.get('/collections');
      return data;
    },
  });
}

export function useRatings(itemId) {
  return useQuery({
    queryKey: ['ratings', itemId],
    queryFn: async () => {
      const { data } = await client.get(`/ratings/${itemId}`);
      return data;
    },
    enabled: Boolean(itemId),
  });
}

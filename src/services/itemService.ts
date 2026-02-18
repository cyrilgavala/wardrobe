// Item service for wardrobe items management

import type { CreateItemRequest, ItemResponse, UpdateItemRequest } from '../types/item';
import { api } from './api';
import { getCookie } from '../utils/cookies.ts';

class ItemService {
  private objectToFormData(obj: CreateItemRequest | UpdateItemRequest): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (typeof value === 'number') {
          formData.append(key, String(value));
        } else {
          formData.append(key, String(value));
        }
      }
    }

    return formData;
  }

  async getAllItems(): Promise<ItemResponse[]> {
    return api.get<ItemResponse[]>('/items', { headers: { Authorization: `Bearer ${getCookie('accessToken')}` } });
  }

  async getItem(id: string): Promise<ItemResponse> {
    return api.get<ItemResponse>(`/items/${id}`, { headers: { Authorization: `Bearer ${getCookie('accessToken')}` } });
  }

  async createItem(data: CreateItemRequest): Promise<ItemResponse> {
    const formData = this.objectToFormData(data);
    return api.post<ItemResponse>('/items', formData, { headers: { Authorization: `Bearer ${getCookie('accessToken')}` } });
  }

  async updateItem(id: string, data: UpdateItemRequest): Promise<ItemResponse> {
    const formData = this.objectToFormData(data);
    return api.put<ItemResponse>(`/items/${id}`, formData, { headers: { Authorization: `Bearer ${getCookie('accessToken')}` } });
  }

  async deleteItem(id: string): Promise<void> {
    return api.delete<void>(`/items/${id}`, { headers: { Authorization: `Bearer ${getCookie('accessToken')}` } });
  }

  async getItemImage(id: string): Promise<Blob> {
    return api.client.get(`/items/${id}/image`, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
    }).then(response => response.data);
  }
}

export const itemService = new ItemService();

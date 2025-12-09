// Item service for wardrobe items management

import type { CreateItemRequest, ItemResponse, UpdateItemRequest } from '../types/item';
import { api } from './api';

class ItemService {
  async getAllItems(category?: string): Promise<ItemResponse[]> {
    const params = category ? { category } : {};
    return api.get<ItemResponse[]>('/items', { params });
  }

  async getItem(id: string): Promise<ItemResponse> {
    return api.get<ItemResponse>(`/items/${id}`);
  }

  async createItem(data: CreateItemRequest): Promise<ItemResponse> {
    return api.post<ItemResponse>('/items', data);
  }

  async updateItem(id: string, data: UpdateItemRequest): Promise<ItemResponse> {
    return api.put<ItemResponse>(`/items/${id}`, data);
  }

  async deleteItem(id: string): Promise<void> {
    return api.delete<void>(`/items/${id}`);
  }
}

export const itemService = new ItemService();

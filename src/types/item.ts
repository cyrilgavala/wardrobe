// Wardrobe item types based on API documentation

export interface ItemResponse {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  brand?: string;
  size?: string;
  washingTemperature?: number;
  canBeIroned?: boolean;
  canBeDried?: boolean;
  canBeBleached?: boolean;
  imageUrl?: string;
  boxNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  color?: string;
  brand?: string;
  size?: string;
  washingTemperature?: number;
  canBeIroned?: boolean;
  canBeDried?: boolean;
  canBeBleached?: boolean;
  imageUrl?: string;
  boxNumber?: number;
}

export interface UpdateItemRequest {
  name: string;
  description?: string;
  color?: string;
  brand?: string;
  size?: string;
  washingTemperature?: number;
  canBeIroned?: boolean;
  canBeDried?: boolean;
  canBeBleached?: boolean;
  imageUrl?: string;
  boxNumber?: number;
}

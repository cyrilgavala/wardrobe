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
  imageId?: string;
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
  image?: File;
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
  image?: File;
  boxNumber?: number;
}

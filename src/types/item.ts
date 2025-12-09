// Wardrobe item types based on API documentation

export const ItemCategory = {
  TOPS: 'TOPS',
  BOTTOMS: 'BOTTOMS',
  DRESSES: 'DRESSES',
  OUTERWEAR: 'OUTERWEAR',
  SHOES: 'SHOES',
  ACCESSORIES: 'ACCESSORIES',
  UNDERWEAR: 'UNDERWEAR',
  SPORTSWEAR: 'SPORTSWEAR',
  SLEEPWEAR: 'SLEEPWEAR',
  FORMAL: 'FORMAL',
  OTHER: 'OTHER'
} as const;

export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory];

export const ItemRoom = {
  BEDROOM: 'BEDROOM',
  WARDROBE: 'WARDROBE',
  CLOSET: 'CLOSET',
  BATHROOM: 'BATHROOM',
  LAUNDRY_ROOM: 'LAUNDRY_ROOM',
  HALLWAY: 'HALLWAY',
  GARAGE: 'GARAGE',
  STORAGE: 'STORAGE',
  OTHER: 'OTHER'
} as const;

export type ItemRoom = (typeof ItemRoom)[keyof typeof ItemRoom];

export interface ItemResponse {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: ItemCategory;
  room: ItemRoom;
  color?: string;
  brand?: string;
  size?: string;
  washingTemperature?: number;
  canBeIroned?: boolean;
  canBeTumbleDried?: boolean;
  canBeDryCleaned?: boolean;
  canBeBleached?: boolean;
  imageUrl?: string;
  boxNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  category: ItemCategory;
  room: ItemRoom;
  color?: string;
  brand?: string;
  size?: string;
  washingTemperature?: number;
  canBeIroned?: boolean;
  canBeTumbleDried?: boolean;
  canBeDryCleaned?: boolean;
  canBeBleached?: boolean;
  imageUrl?: string;
  boxNumber?: number;
}

export interface UpdateItemRequest {
  name: string;
  description?: string;
  category: ItemCategory;
  room: ItemRoom;
  color?: string;
  brand?: string;
  size?: string;
  washingTemperature?: number;
  canBeIroned?: boolean;
  canBeTumbleDried?: boolean;
  canBeDryCleaned?: boolean;
  canBeBleached?: boolean;
  imageUrl?: string;
  boxNumber?: number;
}

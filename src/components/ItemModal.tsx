import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { itemService } from '../services/itemService';
import type {
  CreateItemRequest,
  ItemCategory,
  ItemResponse,
  ItemRoom,
  UpdateItemRequest
} from '../types/item';
import './ItemModal.css';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ItemResponse;
}

export function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!item;

  const [formData, setFormData] = useState<CreateItemRequest>({
    name: '',
    description: '',
    category: 'TOPS' as ItemCategory,
    room: 'WARDROBE' as ItemRoom,
    color: '',
    brand: '',
    size: '',
    washingTemperature: undefined,
    canBeIroned: false,
    canBeTumbleDried: false,
    canBeDryCleaned: false,
    canBeBleached: false,
    imageUrl: '',
    boxNumber: undefined
  });

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        category: item.category,
        room: item.room,
        color: item.color || '',
        brand: item.brand || '',
        size: item.size || '',
        washingTemperature: item.washingTemperature,
        canBeIroned: item.canBeIroned || false,
        canBeTumbleDried: item.canBeTumbleDried || false,
        canBeDryCleaned: item.canBeDryCleaned || false,
        canBeBleached: item.canBeBleached || false,
        imageUrl: item.imageUrl || '',
        boxNumber: item.boxNumber
      });
    } else {
      // Reset form when creating new item
      setFormData({
        name: '',
        description: '',
        category: 'TOPS' as ItemCategory,
        room: 'WARDROBE' as ItemRoom,
        color: '',
        brand: '',
        size: '',
        washingTemperature: undefined,
        canBeIroned: false,
        canBeTumbleDried: false,
        canBeDryCleaned: false,
        canBeBleached: false,
        imageUrl: '',
        boxNumber: undefined
      });
    }
    setError('');
  }, [item, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreateItemRequest) => itemService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to create item');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateItemRequest) =>
      itemService.updateItem(item!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', item!.id] });
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to update item');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name || !formData.category || !formData.room) {
      setError('Please fill in all required fields');
      return;
    }

    // Clean up empty strings and convert to undefined
    const cleanedData = {
      ...formData,
      description: formData.description || undefined,
      color: formData.color || undefined,
      brand: formData.brand || undefined,
      size: formData.size || undefined,
      imageUrl: formData.imageUrl || undefined,
      washingTemperature: formData.washingTemperature || undefined,
      boxNumber: formData.boxNumber || undefined
    };

    if (isEditMode) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = value === '' ? undefined : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="item-modal-overlay" onClick={onClose}>
      <div className="item-modal" onClick={(e) => e.stopPropagation()}>
        <div className="item-modal-header">
          <h2 className="item-modal-title">
            {isEditMode ? 'Edit Item' : 'Create New Item'}
          </h2>
          <button className="item-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="item-modal-content">
          {error && <div className="item-modal-error">{error}</div>}

          <form onSubmit={handleSubmit} className="item-modal-form">
            {/* Basic Information */}
            <div className="item-modal-form-group">
              <label className="item-modal-form-label required" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="item-modal-form-input"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={100}
                required
              />
            </div>

            <div className="item-modal-form-group">
              <label className="item-modal-form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="item-modal-form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={500}
              />
            </div>

            <div className="item-modal-form-group">
              <label
                className="item-modal-form-label required"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="item-modal-form-select"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="TOPS">Tops</option>
                <option value="BOTTOMS">Bottoms</option>
                <option value="DRESSES">Dresses</option>
                <option value="OUTERWEAR">Outerwear</option>
                <option value="SHOES">Shoes</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="UNDERWEAR">Underwear</option>
                <option value="SPORTSWEAR">Sportswear</option>
                <option value="SLEEPWEAR">Sleepwear</option>
                <option value="FORMAL">Formal</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="item-modal-form-group">
              <label className="item-modal-form-label required" htmlFor="room">
                Room
              </label>
              <select
                id="room"
                name="room"
                className="item-modal-form-select"
                value={formData.room}
                onChange={handleInputChange}
                required
              >
                <option value="BEDROOM">Bedroom</option>
                <option value="WARDROBE">Wardrobe</option>
                <option value="CLOSET">Closet</option>
                <option value="BATHROOM">Bathroom</option>
                <option value="LAUNDRY_ROOM">Laundry Room</option>
                <option value="HALLWAY">Hallway</option>
                <option value="GARAGE">Garage</option>
                <option value="STORAGE">Storage</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Item Details */}
            <div className="item-modal-form-section">
              <h3 className="item-modal-form-section-title">Item Details</h3>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="color">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  className="item-modal-form-input"
                  value={formData.color}
                  onChange={handleInputChange}
                  maxLength={50}
                />
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="brand">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  className="item-modal-form-input"
                  value={formData.brand}
                  onChange={handleInputChange}
                  maxLength={50}
                />
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="size">
                  Size
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  className="item-modal-form-input"
                  value={formData.size}
                  onChange={handleInputChange}
                  maxLength={20}
                />
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="item-modal-form-input"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="boxNumber">
                  Box Number
                </label>
                <input
                  type="number"
                  id="boxNumber"
                  name="boxNumber"
                  className="item-modal-form-input"
                  value={formData.boxNumber || ''}
                  onChange={handleInputChange}
                  min={1}
                />
              </div>
            </div>

            {/* Care Instructions */}
            <div className="item-modal-form-section">
              <h3 className="item-modal-form-section-title">
                Care Instructions
              </h3>

              <div className="item-modal-form-group">
                <label
                  className="item-modal-form-label"
                  htmlFor="washingTemperature"
                >
                  Washing Temperature (°C)
                </label>
                <input
                  type="number"
                  id="washingTemperature"
                  name="washingTemperature"
                  className="item-modal-form-input"
                  value={formData.washingTemperature || ''}
                  onChange={handleInputChange}
                  min={0}
                  max={95}
                />
                <div className="item-modal-form-help">
                  Maximum washing temperature in Celsius (0-95)
                </div>
              </div>

              <div className="item-modal-form-checkboxes">
                <div className="item-modal-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="canBeIroned"
                    name="canBeIroned"
                    className="item-modal-form-checkbox"
                    checked={formData.canBeIroned}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="canBeIroned"
                    className="item-modal-form-checkbox-label"
                  >
                    Can be ironed
                  </label>
                </div>

                <div className="item-modal-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="canBeTumbleDried"
                    name="canBeTumbleDried"
                    className="item-modal-form-checkbox"
                    checked={formData.canBeTumbleDried}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="canBeTumbleDried"
                    className="item-modal-form-checkbox-label"
                  >
                    Can be tumble dried
                  </label>
                </div>

                <div className="item-modal-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="canBeDryCleaned"
                    name="canBeDryCleaned"
                    className="item-modal-form-checkbox"
                    checked={formData.canBeDryCleaned}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="canBeDryCleaned"
                    className="item-modal-form-checkbox-label"
                  >
                    Can be dry cleaned
                  </label>
                </div>

                <div className="item-modal-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="canBeBleached"
                    name="canBeBleached"
                    className="item-modal-form-checkbox"
                    checked={formData.canBeBleached}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="canBeBleached"
                    className="item-modal-form-checkbox-label"
                  >
                    Can be bleached
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="item-modal-footer">
          <button
            type="button"
            className="item-modal-btn item-modal-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="item-modal-btn item-modal-btn-submit"
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

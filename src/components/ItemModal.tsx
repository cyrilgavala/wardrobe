import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { itemService } from '../services/itemService';
import type { CreateItemRequest, ItemResponse, UpdateItemRequest } from '../types/item';
import './ItemModal.css';

const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
const formatSizeMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ItemResponse;
}

export function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!item;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
    setError: setFieldError,
    clearErrors
  } = useForm<CreateItemRequest>({
    defaultValues: {
      name: '',
      description: '',
      color: '',
      brand: '',
      size: '',
      washingTemperature: undefined,
      canBeIroned: false,
      canBeDried: false,
      canBeBleached: false,
      boxNumber: undefined
    }
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description || '',
        color: item.color || '',
        brand: item.brand || '',
        size: item.size || '',
        washingTemperature: item.washingTemperature,
        canBeIroned: item.canBeIroned || false,
        canBeDried: item.canBeDried || false,
        canBeBleached: item.canBeBleached || false,
        boxNumber: item.boxNumber
      });
      setImagePreview(null);
    } else {
      // Reset form when creating new item
      reset({
        name: '',
        description: '',
        color: '',
        brand: '',
        size: '',
        washingTemperature: undefined,
        canBeIroned: false,
        canBeDried: false,
        canBeBleached: false,
        boxNumber: undefined
      });
      setImagePreview(null);
    }
  }, [item, isOpen, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setFieldError('root', {
          type: 'manual',
          message: `Image is too large (${formatSizeMB(file.size)} MB). Max is ${formatSizeMB(MAX_IMAGE_SIZE_BYTES)} MB.`
        });
        setImagePreview(null);
        e.target.value = '';
        return;
      }
      clearErrors('root');
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateItemRequest) => itemService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      onClose();
    },
    onError: (error: any) => {
      setFieldError('root', {
        type: 'manual',
        message: error.message || 'Failed to create item'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateItemRequest) =>
      itemService.updateItem(item!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', item!.id] });
      queryClient.invalidateQueries({ queryKey: ['itemImage', item!.id] });
      onClose();
    },
    onError: (error: any) => {
      setFieldError('root', {
        type: 'manual',
        message: error.message || 'Failed to update item'
      });
    }
  });

  const onSubmit = handleFormSubmit((data) => {
    // Get the file from the input element
    const imageInput = document.getElementById('image') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    if (imageFile && imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      setFieldError('root', {
        type: 'manual',
        message: `Image is too large (${formatSizeMB(imageFile.size)} MB). Max is ${formatSizeMB(MAX_IMAGE_SIZE_BYTES)} MB.`
      });
      return;
    }
    // Clean up empty strings and convert to undefined
    const cleanedData: CreateItemRequest | UpdateItemRequest = {
      ...data,
      description: data.description || undefined,
      color: data.color || undefined,
      brand: data.brand || undefined,
      size: data.size || undefined,
      washingTemperature: data.washingTemperature,
      boxNumber: data.boxNumber || undefined,
      image: imageFile
    };

    if (isEditMode) {
      updateMutation.mutate(cleanedData as UpdateItemRequest);
    } else {
      createMutation.mutate(cleanedData as CreateItemRequest);
    }
  });

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
          {errors.root && (
            <div className="item-modal-error">{errors.root.message}</div>
          )}

          <form id="item-form" onSubmit={onSubmit} className="item-modal-form">
            {/* Basic Information */}
            <div className="item-modal-form-group">
              <label className="item-modal-form-label required" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', {
                  required: 'Name is required',
                  maxLength: {
                    value: 100,
                    message: 'Name must be less than 100 characters'
                  }
                })}
                className="item-modal-form-input"
              />
              {errors.name && (
                <div className="item-modal-form-error">{errors.name.message}</div>
              )}
            </div>

            <div className="item-modal-form-group">
              <label className="item-modal-form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message: 'Description must be less than 500 characters'
                  }
                })}
                className="item-modal-form-textarea"
              />
              {errors.description && (
                <div className="item-modal-form-error">{errors.description.message}</div>
              )}
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
                  {...register('color', {
                    maxLength: {
                      value: 50,
                      message: 'Color must be less than 50 characters'
                    }
                  })}
                  className="item-modal-form-input"
                />
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="brand">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  {...register('brand', {
                    maxLength: {
                      value: 50,
                      message: 'Brand must be less than 50 characters'
                    }
                  })}
                  className="item-modal-form-input"
                />
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="size">
                  Size
                </label>
                <input
                  type="text"
                  id="size"
                  {...register('size', {
                    maxLength: {
                      value: 20,
                      message: 'Size must be less than 20 characters'
                    }
                  })}
                  className="item-modal-form-input"
                />
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="image">
                  Image
                </label>
                {imagePreview && (
                  <div className="item-modal-image-preview">
                    <img src={imagePreview} alt="Preview"
                         className="item-modal-image-preview-img" />
                    <button
                      type="button"
                      className="item-modal-image-preview-remove"
                      onClick={() => {
                        setImagePreview(null);
                        const input = document.getElementById('image') as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="item-modal-form-input"
                  onChange={handleImageChange}
                />
                <div className="item-modal-form-help">
                  Max {formatSizeMB(MAX_IMAGE_SIZE_BYTES)}MB. Supported formats: JPEG, PNG, WebP
                  <br />
                </div>
              </div>

              <div className="item-modal-form-group">
                <label className="item-modal-form-label" htmlFor="boxNumber">
                  Box Number
                </label>
                <input
                  type="number"
                  id="boxNumber"
                  {...register('boxNumber', {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Box number must be at least 1'
                    }
                  })}
                  className="item-modal-form-input"
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
                <select
                  id="washingTemperature"
                  {...register('washingTemperature', {
                    setValueAs: (v) => {
                      return v === '' ? undefined : Number(v);
                    }
                  })}
                  className="item-modal-form-input"
                >
                  <option value="">None</option>
                  <option value={0}>0°C</option>
                  <option value={30}>30°C</option>
                  <option value={40}>40°C</option>
                  <option value={60}>60°C</option>
                  <option value={90}>90°C</option>
                </select>
                <div className="item-modal-form-help">
                  Maximum washing temperature in Celsius (0-90)
                </div>
                {errors.washingTemperature && (
                  <div className="item-modal-form-error">
                    {errors.washingTemperature.message}
                  </div>
                )}
              </div>

              <div className="item-modal-form-checkboxes">
                <div className="item-modal-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="canBeIroned"
                    {...register('canBeIroned')}
                    className="item-modal-form-checkbox"
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
                    id="canBeDried"
                    {...register('canBeDried')}
                    className="item-modal-form-checkbox"
                  />
                  <label
                    htmlFor="canBeDried"
                    className="item-modal-form-checkbox-label"
                  >
                    Can be dried
                  </label>
                </div>

                <div className="item-modal-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="canBeBleached"
                    {...register('canBeBleached')}
                    className="item-modal-form-checkbox"
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
            form="item-form"
            className="item-modal-btn item-modal-btn-submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

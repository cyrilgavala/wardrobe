import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { itemService } from '../services/itemService';
import type { CreateItemRequest, ItemResponse, UpdateItemRequest } from '../types/item';
import './ItemModal.css';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ItemResponse;
}

export function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!item;

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
    setError: setFieldError
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
      imageUrl: '',
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
        imageUrl: item.imageUrl || '',
        boxNumber: item.boxNumber
      });
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
        imageUrl: '',
        boxNumber: undefined
      });
    }
  }, [item, isOpen, reset]);

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
    // Clean up empty strings and convert to undefined
    const cleanedData = {
      ...data,
      description: data.description || undefined,
      color: data.color || undefined,
      brand: data.brand || undefined,
      size: data.size || undefined,
      imageUrl: data.imageUrl || undefined,
      washingTemperature: data.washingTemperature || undefined,
      boxNumber: data.boxNumber || undefined
    };

    if (isEditMode) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
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
                <label className="item-modal-form-label" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  {...register('imageUrl', {
                    maxLength: {
                      value: 500,
                      message: 'Image URL must be less than 500 characters'
                    }
                  })}
                  className="item-modal-form-input"
                />
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
                <input
                  type="number"
                  id="washingTemperature"
                  {...register('washingTemperature', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Temperature must be at least 0°C'
                    },
                    max: {
                      value: 95,
                      message: 'Temperature must be at most 95°C'
                    }
                  })}
                  className="item-modal-form-input"
                />
                <div className="item-modal-form-help">
                  Maximum washing temperature in Celsius (0-95)
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

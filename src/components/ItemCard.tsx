import { useState } from 'react';
import type { ItemResponse } from '../types/item';
import { ImagePreviewModal } from './ImagePreviewModal';
import './ItemCard.css';

interface ItemCardProps {
  item: ItemResponse;
  onEdit: (item: ItemResponse) => void;
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  return (
    <div className="item-card">
      <div className="item-card-content">
        <div className="item-card-header">
          <h3 className="item-card-name">{item.name}</h3>
        </div>

        {item.description && (
          <p className="item-card-description">{item.description}</p>
        )}

        <div className="item-card-details">
          {item.color && (
            <div className="item-card-detail">
              <span className="item-card-detail-label">Color:</span>
              <span>{item.color}</span>
            </div>
          )}
          {item.size && (
            <div className="item-card-detail">
              <span className="item-card-detail-label">Size:</span>
              <span>{item.size}</span>
            </div>
          )}
          {item.brand && (
            <div className="item-card-detail">
              <span className="item-card-detail-label">Brand:</span>
              <span>{item.brand}</span>
            </div>
          )}
          {item.boxNumber && (
            <div className="item-card-detail">
              <span className="item-card-detail-label">Box:</span>
              <span>#{item.boxNumber}</span>
            </div>
          )}
        </div>

        <div className="item-card-care-icons">
          {item.washingTemperature !== undefined && (
            <div className="item-card-care-icon active">
              🌡️ {item.washingTemperature}°C
            </div>
          )}
          {item.canBeIroned && (
            <div className="item-card-care-icon active">✓ Iron</div>
          )}
          {item.canBeDried && (
            <div className="item-card-care-icon active">✓ Dry</div>
          )}
          {item.canBeBleached && (
            <div className="item-card-care-icon active">✓ Bleach</div>
          )}
        </div>

        <div className="item-card-footer">
          <div className="item-card-actions">
            <button
              onClick={handleEdit}
              className="item-card-btn item-card-btn-edit"
            >
              Edit
            </button>
            <button
              onClick={handlePreview}
              className="item-card-btn item-card-btn-preview"
            >
              Image Preview
            </button>
            <button
              onClick={handleDelete}
              className="item-card-btn item-card-btn-delete"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageId={item.id}
        itemName={item.name}
      />
    </div>
  );
}

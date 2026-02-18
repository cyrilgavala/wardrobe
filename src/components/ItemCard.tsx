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
        <div className="item-card-main">
          <h5 className="item-card-name">{item.name}</h5>
          {item.description && (
            <p className="item-card-description">{item.description}</p>
          )}
        </div>

        <div className="item-card-details">
          <div className="item-card-details-wrapper">
            <div className="item-card-detail">
              <span className="item-card-detail-label">Color:</span>
              <span>{item.color ?? 'N/A'}</span>
            </div>
            <div className="item-card-detail">
              <span className="item-card-detail-label">Size:</span>
              <span>{item.size ?? 'N/A'}</span>
            </div>
            <div className="item-card-detail">
              <span className="item-card-detail-label">Brand:</span>
              <span>{item.brand ?? 'N/A'}</span>
            </div>
            <div className="item-card-detail">
              <span className="item-card-detail-label">Box:</span>
              <span>#{item.boxNumber ?? 'N/A'}</span>
            </div>
          </div>
          <div className="item-card-care-icons">
            <div
              className={`item-card-care-icon ${item.washingTemperature !== undefined ? 'active' : 'inactive'}`}>
              {item.washingTemperature}°C
            </div>
            <div className={`item-card-care-icon ${item.canBeIroned ? 'active' : 'inactive'}`}>
              Iron
            </div>
            <div className={`item-card-care-icon ${item.canBeDried ? 'active' : 'inactive'}`}>
              Dry
            </div>
            <div className={`item-card-care-icon ${item.canBeBleached ? 'active' : 'inactive'}`}>
              Bleach
            </div>
          </div>
        </div>
      </div>

      <div className="item-card-actions">
        <button
          onClick={handleEdit}
          className="item-card-btn item-card-btn-edit"
          title="Edit"
          aria-label="Edit item"
        />
        <button
          onClick={handlePreview}
          className="item-card-btn item-card-btn-preview"
          title="Preview image"
          aria-label="Preview image"
        />
        <button
          onClick={handleDelete}
          className="item-card-btn item-card-btn-delete"
          title="Delete"
          aria-label="Delete item"
        />
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

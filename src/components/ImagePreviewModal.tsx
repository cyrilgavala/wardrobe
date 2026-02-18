import './ImagePreviewModal.css';
import { useItemImage } from '../hooks/useItemImage.ts';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string;
  itemName: string;
}

export function ImagePreviewModal({
                                    isOpen,
                                    onClose,
                                    imageId,
                                    itemName
                                  }: ImagePreviewModalProps) {
  const { imageSrc, isLoading, imageError } = useItemImage(imageId);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="image-preview-overlay"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div
        className="image-preview-container"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        <button
          className="image-preview-close"
          onClick={onClose}
          type="button"
          aria-label="Close preview"
        >
          ×
        </button>
        {isLoading && <div className="image-preview-loading">Loading...</div>}
        {imageError && <div className="image-preview-error">Failed to load image</div>}
        {!imageError && !isLoading && imageSrc && (
          <img src={imageSrc} alt={itemName} className="image-preview-img" />
        )}
        <div className="image-preview-caption">{itemName}</div>
      </div>
    </div>
  );
}

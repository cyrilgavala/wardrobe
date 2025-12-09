import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import { UserDetailsModal } from '../components/UserDetailsModal';
import { useItems } from '../hooks/useItems';
import { authService } from '../services/authService';
import { itemService } from '../services/itemService';
import type { ItemResponse } from '../types/item';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingItem, setEditingItem] = useState<ItemResponse | undefined>(
    undefined
  );

  const {
    data: items,
    isLoading,
    error
  } = useItems(selectedCategory || undefined);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => itemService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (error: any) => {
      alert(`Failed to delete item: ${error.message}`);
    }
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      authService.clearTokens();
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/login');
    }
  };

  const openUserModal = () => {
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  const handleCreateClick = () => {
    setEditingItem(undefined);
    setIsItemModalOpen(true);
  };

  const handleEditClick = (item: ItemResponse) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItem(undefined);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <UserDetailsModal isOpen={isUserModalOpen} onClose={closeUserModal} />
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={handleCloseItemModal}
        item={editingItem}
      />

      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <h1>My Wardrobe</h1>
            <select
              className="dashboard-filter-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
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
            <button onClick={handleCreateClick} className="btn-add-item">
              <span>+</span>
              <span>Add Item</span>
            </button>
          </div>
          <div className="dashboard-header-actions">
            <button onClick={openUserModal} className="btn-profile">
              Profile
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {isLoading && <div className="dashboard-loading">Loading items...</div>}

        {error && (
          <div className="dashboard-error">
            <div className="dashboard-error-title">Error loading items</div>
            <div>{(error as any).message || 'Failed to load items'}</div>
          </div>
        )}

        {!isLoading && !error && items && (
          <>
            {items.length > 0 ? (
              <>
                <div className="dashboard-items-count">
                  {items.length} {items.length === 1 ? 'item' : 'items'} found
                  {selectedCategory && ` in ${selectedCategory.toLowerCase()}`}
                </div>
                <div className="dashboard-items-grid">
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="dashboard-empty">
                <div className="dashboard-empty-icon">👔</div>
                <div className="dashboard-empty-title">No items found</div>
                <p className="dashboard-empty-text">
                  {selectedCategory
                    ? `No items in the ${selectedCategory.toLowerCase()} category. Try a different category or add a new item.`
                    : 'Start building your wardrobe by adding your first item!'}
                </p>
                <button onClick={handleCreateClick} className="btn-add-item">
                  <span>+</span>
                  <span>Add Your First Item</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

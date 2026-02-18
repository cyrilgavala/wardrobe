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
  const [editingItem, setEditingItem] = useState<ItemResponse | undefined>(
    undefined
  );

  const {
    data: items,
    isLoading,
    error
  } = useItems();

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
            <button onClick={handleCreateClick} className="btn-add-item">
              <span>+</span>
              <span>Add Item</span>
            </button>
          </div>
          <div className="dashboard-header-actions">
            <button
              onClick={openUserModal}
              className="btn-icon btn-profile"
              title="Profile"
              aria-label="Profile"
            />
            <button
              onClick={handleLogout}
              className="btn-icon btn-logout"
              title="Logout"
              aria-label="Logout"
            />
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
                  'Start building your wardrobe by adding your first item!'
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

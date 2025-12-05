import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { UserDetailsModal } from '../components/UserDetailsModal';
import { authService } from '../services/authService';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Remove user query to clear cached data completely
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear tokens anyway
      authService.clearTokens();
      // Remove user query even on error
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/login');
    }
  };

  const openUserModal = () => {
    setIsModalOpen(true);
  };

  const closeUserModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      <UserDetailsModal isOpen={isModalOpen} onClose={closeUserModal} />

      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Wardrobe Dashboard</h1>
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
        <div className="dashboard-welcome">
          <h2>Welcome to Wardrobe!</h2>
          <p>
            Here you can manage your wardrobes and their content easily. Organize your clothing items,
            create outfits, and keep track of everything in your closet.
          </p>
        </div>
      </main>
    </div>
  );
}


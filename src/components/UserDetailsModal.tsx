import { useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import './UserDetailsModal.css';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ isOpen, onClose }: UserDetailsModalProps) {
  const { data: user, isLoading: loading, error, refetch } = useCurrentUser();

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-container ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-header">
          <h2>User Profile</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-content">
          {loading && (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Loading user details...</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <span className="error-icon">⚠️</span>
              <p>{error.message || 'Failed to load user details'}</p>
              <button onClick={() => refetch()} className="btn-retry">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && user && (
            <div className="user-details">
              <div className="user-avatar">
                <div className="avatar-circle">
                  {user.firstName.charAt(0).toUpperCase()}
                  {user.lastName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="user-info-section">
                <h3 className="user-name">
                  {user.firstName} {user.lastName}
                </h3>
                <span className="user-role-badge">{user.role}</span>
              </div>

              <div className="user-details-grid">
                <div className="detail-item">
                  <span className="detail-label">
                    <span className="detail-icon">👤</span>
                    Username
                  </span>
                  <span className="detail-value">{user.username}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <span className="detail-icon">📧</span>
                    Email
                  </span>
                  <span className="detail-value">{user.email}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <span className="detail-icon">📅</span>
                    Member Since
                  </span>
                  <span className="detail-value">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <span className="detail-icon">🕐</span>
                    Last Login
                  </span>
                  <span className="detail-value">
                    {(() => {
                      // Try to use lastLoginAt, fallback to createdAt for freshly registered users
                      const loginDate = user.lastLoginAt && user.lastLoginAt !== 'null' && user.lastLoginAt !== ''
                        ? user.lastLoginAt
                        : user.createdAt;

                      const date = new Date(loginDate);

                      // Check if date is valid (not epoch and not Invalid Date)
                      return !isNaN(date.getTime()) && date.getTime() > 0
                        ? date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Never';
                    })()}
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={onClose} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


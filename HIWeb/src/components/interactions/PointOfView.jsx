import React, { useState } from 'react';
import Button from '../common/Button';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import './Interactions.css';

const PointOfView = ({ postId, onClose }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { addPointOfView } = usePosts();
  const { currentUser } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter your point of view');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await addPointOfView(postId, currentUser.id, currentUser.identity, content);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error adding point of view:', error);
      setError('Failed to add your point of view. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="interaction-form">
      <h3 className="interaction-form__title">Share Your Point of View</h3>
      
      {error && <div className="interaction-form__error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="interaction-form__form-group">
          <textarea
            className="interaction-form__textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's your perspective on this?"
            rows={4}
          />
        </div>
        
        <div className="interaction-form__actions">
          <Button type="button" variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PointOfView;
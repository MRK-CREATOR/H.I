import React, { useState } from 'react';
import Button from '../common/Button';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import './Interactions.css';

const ProposeSolution = ({ postId, onClose }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { addSolution } = usePosts();
  const { currentUser } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter your solution');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await addSolution(postId, currentUser.id, currentUser.identity, content);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error proposing solution:', error);
      setError('Failed to submit your solution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="interaction-form">
      <h3 className="interaction-form__title">Propose a Solution</h3>
      
      {error && <div className="interaction-form__error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="interaction-form__form-group">
          <textarea
            className="interaction-form__textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How would you solve this market gap?"
            rows={4}
          />
        </div>
        
        <div className="interaction-form__actions">
          <Button type="button" variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProposeSolution;
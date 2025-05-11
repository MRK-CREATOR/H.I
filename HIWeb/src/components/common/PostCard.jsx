import React, { useState } from 'react';
import Button from './Button';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import './PostCard.css';

// Import SVG icons
import { ReactComponent as IdeaIcon } from '../../assets/images/icons/idea.svg';
import { ReactComponent as ProblemIcon } from '../../assets/images/icons/problem.svg';
import { ReactComponent as ThoughtIcon } from '../../assets/images/icons/thought.svg';

const PostCard = ({ post }) => {
  const [showPOVForm, setShowPOVForm] = useState(false);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [comment, setComment] = useState('');
  
  const { addPointOfView, addSolution, likePost } = usePosts();
  const { currentUser } = useAuth();
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    if (showPOVForm) {
      addPointOfView(post.id, currentUser.id, currentUser.identity, comment);
      setShowPOVForm(false);
    } else if (showSolutionForm) {
      addSolution(post.id, currentUser.id, currentUser.identity, comment);
      setShowSolutionForm(false);
    } else if (showDiscussionForm) {
      addPointOfView(post.id, currentUser.id, currentUser.identity, comment);
      setShowDiscussionForm(false);
    }
    
    setComment('');
  };
  
  const getPostIcon = () => {
    switch (post.type) {
      case 'ideaSnap':
        return <IdeaIcon className="post-icon" />;
      case 'marketGap':
        return <ProblemIcon className="post-icon" />;
      case 'thought':
        return <ThoughtIcon className="post-icon" />;
      default:
        return null;
    }
  };
  
  const getPostTypeLabel = () => {
    switch (post.type) {
      case 'ideaSnap':
        return 'Idea Snap';
      case 'marketGap':
        return 'Market Gap';
      case 'thought':
        if (post.thoughtType === 'whatIf') return 'What If';
        if (post.thoughtType === 'whyNot') return 'Why Not';
        if (post.thoughtType === 'observation') return 'Observation';
        return 'Thought';
      default:
        return 'Post';
    }
  };

  return (
    <div className="post-card">
      <div className="post-card__header">
        <div className="post-card__type">
          {getPostIcon()}
          <span>{getPostTypeLabel()}</span>
        </div>
        <div className="post-card__author">
          {post.identity}
        </div>
      </div>
      
      {post.industry && (
        <div className="post-card__industry">{post.industry}</div>
      )}
      
      <div className="post-card__content">
        {post.content}
      </div>
      
      <div className="post-card__footer">
        <div className="post-card__actions">
          <button 
            className="post-card__like-btn" 
            onClick={() => likePost(post.id, currentUser.id)}
          >
            {post.likes} Endorse
          </button>
          
          <button 
            className="post-card__pov-btn"
            onClick={() => {
              setShowPOVForm(!showPOVForm);
              setShowSolutionForm(false);
              setShowDiscussionForm(false);
            }}
          >
            P.O.V
          </button>
          
          {post.type === 'marketGap' && (
            <button 
              className="post-card__solution-btn"
              onClick={() => {
                setShowSolutionForm(!showSolutionForm);
                setShowPOVForm(false);
                setShowDiscussionForm(false);
              }}
            >
              Propose Solution
            </button>
          )}
          
          {post.type === 'thought' && (post.thoughtType === 'whatIf' || post.thoughtType === 'whyNot') && (
            <button 
              className="post-card__discussion-btn"
              onClick={() => {
                setShowDiscussionForm(!showDiscussionForm);
                setShowPOVForm(false);
                setShowSolutionForm(false);
              }}
            >
              {post.thoughtType === 'whatIf' ? 'Join Discussion' : 'Join Debate'}
            </button>
          )}
        </div>
        
        {(showPOVForm || showSolutionForm || showDiscussionForm) && (
          <form className="post-card__comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                showPOVForm
                  ? "Share your point of view..."
                  : showSolutionForm
                  ? "Propose your solution..."
                  : "Join the conversation..."
              }
              rows={3}
            />
            <div className="post-card__form-actions">
              <Button 
                type="button" 
                variant="text" 
                onClick={() => {
                  setShowPOVForm(false);
                  setShowSolutionForm(false);
                  setShowDiscussionForm(false);
                  setComment('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
        
        {/* Points of View Section */}
        {post.pointsOfView && post.pointsOfView.length > 0 && (
          <div className="post-card__comments">
            <h4>Points of View</h4>
            {post.pointsOfView.map((pov) => (
              <div key={pov.id} className="post-card__comment">
                <div className="post-card__comment-author">{pov.identity}</div>
                <div className="post-card__comment-content">{pov.content}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Solutions Section */}
        {post.type === 'marketGap' && post.solutions && post.solutions.length > 0 && (
          <div className="post-card__solutions">
            <h4>Proposed Solutions</h4>
            {post.solutions.map((solution) => (
              <div key={solution.id} className="post-card__solution">
                <div className="post-card__solution-author">{solution.identity}</div>
                <div className="post-card__solution-content">{solution.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
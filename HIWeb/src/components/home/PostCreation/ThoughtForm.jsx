import React, { useState } from 'react';
import Button from '../../common/Button';
import { usePosts } from '../../../contexts/PostContext';
import { useAuth } from '../../../contexts/AuthContext';
import './PostForm.css';

const industryOptions = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Entertainment',
  'Retail',
  'Manufacturing',
  'Transportation',
  'Energy',
  'Agriculture',
  'Real Estate',
  'Food & Beverage',
  'Artificial Intelligence',
  'Sustainability',
  'Media',
  'Sports',
  'Fashion',
  'Art & Culture',
  'Travel & Tourism',
  'Other'
];

const ThoughtForm = ({ onClose }) => {
  const [thoughtType, setThoughtType] = useState('');
  const [content, setContent] = useState('');
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  
  const { createPost } = usePosts();
  const { currentUser } = useAuth();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!thoughtType) {
      newErrors.thoughtType = 'Please select a thought type';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (thoughtType !== 'observation' && !industry) {
      newErrors.industry = 'Industry is required';
    }
    
    if (industry === 'Other' && !customIndustry.trim()) {
      newErrors.customIndustry = 'Please specify the industry';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedIndustry = industry === 'Other' ? customIndustry : industry;
      
      await createPost({
        type: 'thought',
        thoughtType,
        userId: currentUser.id,
        identity: currentUser.identity,
        content,
        industry: selectedIndustry || undefined
      });
      
      setThoughtType('');
      setContent('');
      setIndustry('');
      setCustomIndustry('');
      setIsPreview(false);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePreview = () => {
    if (!content.trim() || !thoughtType || (thoughtType !== 'observation' && !industry)) {
      validateForm();
      return;
    }
    
    setIsPreview(!isPreview);
  };
  
  const getPlaceholder = () => {
    switch (thoughtType) {
      case 'whatIf':
        return "Start with 'What if...' and share a speculative idea";
      case 'whyNot':
        return "Start with 'Why not...' and challenge conventional thinking";
      case 'observation':
        return "Share an observation or insight you've had";
      default:
        return "Choose a thought type above to get started";
    }
  };
  
  const getThoughtTypeLabel = () => {
    switch (thoughtType) {
      case 'whatIf':
        return "What If";
      case 'whyNot':
        return "Why Not";
      case 'observation':
        return "Observation";
      default:
        return "Thought";
    }
  };
  
  return (
    <div className="post-form">
      {isPreview ? (
        <div className="post-form__preview">
          <div className="post-form__preview-header">
            <h3>Preview</h3>
          </div>
          
          <div className="post-form__preview-content">
            <div className="post-form__preview-type">{getThoughtTypeLabel()}</div>
            {industry && (
              <div className="post-form__preview-industry">
                {industry === 'Other' ? customIndustry : industry}
              </div>
            )}
            <div className="post-form__preview-text">{content}</div>
          </div>
          
          <div className="post-form__actions">
            <Button variant="text" onClick={togglePreview}>
              Edit
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Thought'}
            </Button>
          </div>
        </div>
      ) : (
        <form className="post-form__form" onSubmit={handleSubmit}>
          <div className="post-form__thought-types">
            <div 
              className={`post-form__thought-type ${thoughtType === 'whatIf' ? 'post-form__thought-type--active' : ''}`}
              onClick={() => setThoughtType('whatIf')}
            >
              <div className="post-form__thought-type-label">What If</div>
              <div className="post-form__thought-type-description">Speculative possibilities</div>
            </div>
            
            <div 
              className={`post-form__thought-type ${thoughtType === 'whyNot' ? 'post-form__thought-type--active' : ''}`}
              onClick={() => setThoughtType('whyNot')}
            >
              <div className="post-form__thought-type-label">Why Not</div>
              <div className="post-form__thought-type-description">Challenge the status quo</div>
            </div>
            
            <div 
              className={`post-form__thought-type ${thoughtType === 'observation' ? 'post-form__thought-type--active' : ''}`}
              onClick={() => setThoughtType('observation')}
            >
              <div className="post-form__thought-type-label">Observation</div>
              <div className="post-form__thought-type-description">Share an insight</div>
            </div>
          </div>
          
          {errors.thoughtType && (
            <div className="post-form__error">{errors.thoughtType}</div>
          )}
          
          <div className="post-form__form-group">
            <textarea
              className={`post-form__textarea ${errors.content ? 'post-form__textarea--error' : ''}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={getPlaceholder()}
              rows={4}
              disabled={!thoughtType}
            />
            {errors.content && (
              <div className="post-form__error">{errors.content}</div>
            )}
          </div>
          
          {thoughtType && thoughtType !== 'observation' && (
            <div className="post-form__form-group">
              <select
                className={`post-form__select ${errors.industry ? 'post-form__select--error' : ''}`}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Select Industry</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <div className="post-form__error">{errors.industry}</div>
              )}
            </div>
          )}
          
          {industry === 'Other' && (
            <div className="post-form__form-group">
              <input
                type="text"
                className={`post-form__input ${errors.customIndustry ? 'post-form__input--error' : ''}`}
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                placeholder="Specify Industry"
              />
              {errors.customIndustry && (
                <div className="post-form__error">{errors.customIndustry}</div>
              )}
            </div>
          )}
          
          <div className="post-form__actions">
            <Button type="button" variant="text" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={togglePreview}
              disabled={!thoughtType || !content.trim()}
            >
              Preview
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ThoughtForm;
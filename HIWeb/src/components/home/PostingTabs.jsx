import React, { useState } from 'react';
import IdeaSnapForm from './PostCreation/IdeaSnapForm';
import MarketGapForm from './PostCreation/MarketGapForm';
import ThoughtForm from './PostCreation/ThoughtForm';
import { ReactComponent as IdeaIcon } from '../../assets/images/icons/idea.svg';
import { ReactComponent as ProblemIcon } from '../../assets/images/icons/problem.svg';
import { ReactComponent as ThoughtIcon } from '../../assets/images/icons/thought.svg';
import './PostingTabs.css';

const PostingTabs = () => {
  const [activeTab, setActiveTab] = useState('');
  
  const handleTabClick = (tab) => {
    if (activeTab === tab) {
      setActiveTab('');
    } else {
      setActiveTab(tab);
    }
  };
  
  return (
    <div className="posting-tabs">
      <div className="posting-tabs__buttons">
        <button 
          className={`posting-tabs__button ${activeTab === 'idea' ? 'posting-tabs__button--active' : ''}`}
          onClick={() => handleTabClick('idea')}
        >
          <IdeaIcon className="posting-tabs__icon" />
          <span>Idea Snap</span>
        </button>
        
        <button 
          className={`posting-tabs__button ${activeTab === 'problem' ? 'posting-tabs__button--active' : ''}`}
          onClick={() => handleTabClick('problem')}
        >
          <ProblemIcon className="posting-tabs__icon" />
          <span>Problem / Market Gap</span>
        </button>
        
        <button 
          className={`posting-tabs__button ${activeTab === 'thought' ? 'posting-tabs__button--active' : ''}`}
          onClick={() => handleTabClick('thought')}
        >
          <ThoughtIcon className="posting-tabs__icon" />
          <span>Thought</span>
        </button>
      </div>
      
      <div className={`posting-tabs__content ${activeTab ? 'posting-tabs__content--active' : ''}`}>
        {activeTab === 'idea' && <IdeaSnapForm onClose={() => setActiveTab('')} />}
        {activeTab === 'problem' && <MarketGapForm onClose={() => setActiveTab('')} />}
        {activeTab === 'thought' && <ThoughtForm onClose={() => setActiveTab('')} />}
      </div>
    </div>
  );
};

export default PostingTabs;
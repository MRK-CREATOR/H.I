import React, { useState } from 'react';
import Header from '../common/Header';
import NavigationBar from '../common/NavigationBar';
import ProfileHeader from './ProfileHeader';
import ContributionsTab from './ContributionsTab';
import InteractionsTab from './InteractionsTab';
import EndorsementsTab from './EndorsementsTab';
import { useAuth } from '../../contexts/AuthContext';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('contributions');
  const { currentUser, logout } = useAuth();
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="profile-screen">
      <Header minimized={true} />
      
      <main className="profile-screen__content">
        <div className="profile-screen__container">
          <ProfileHeader currentUser={currentUser} onLogout={handleLogout} />
          
          <div className="profile-screen__tabs">
            <button 
              className={`profile-screen__tab-btn ${activeTab === 'contributions' ? 'profile-screen__tab-btn--active' : ''}`}
              onClick={() => handleTabChange('contributions')}
            >
              My Contributions
            </button>
            <button 
              className={`profile-screen__tab-btn ${activeTab === 'interactions' ? 'profile-screen__tab-btn--active' : ''}`}
              onClick={() => handleTabChange('interactions')}
            >
              My Interactions
            </button>
            <button 
              className={`profile-screen__tab-btn ${activeTab === 'endorsements' ? 'profile-screen__tab-btn--active' : ''}`}
              onClick={() => handleTabChange('endorsements')}
            >
              My Endorsements
            </button>
          </div>
          
          <div className="profile-screen__tab-content">
            {activeTab === 'contributions' && <ContributionsTab userId={currentUser.id} />}
            {activeTab === 'interactions' && <InteractionsTab userId={currentUser.id} />}
            {activeTab === 'endorsements' && <EndorsementsTab userId={currentUser.id} />}
          </div>
        </div>
      </main>
      
      <NavigationBar />
    </div>
  );
};

export default ProfileScreen;
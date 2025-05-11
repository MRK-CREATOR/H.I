import React, { useState, useEffect } from 'react';
import './MotivationalHeader.css';

const motivationalPhrases = [
  "Stay Hungry. Stay Foolish.",
  "Ideas shape the world.",
  "What if… you're the one?",
  "Be curious about everything.",
  "Ideas worth sharing.",
  "Dream big. Start small.",
  "Question the ordinary.",
  "Challenge conventional wisdom.",
  "Think differently.",
  "Genius is seeing what others don't.",
  "Innovation begins with curiosity.",
  "The future belongs to the bold.",
  "Create what doesn't exist yet.",
];

const MotivationalHeader = () => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Set initial phrase
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    setCurrentPhrase(motivationalPhrases[randomIndex]);

    // Setup interval to change phrases
    const interval = setInterval(() => {
      setIsChanging(true);
      
      setTimeout(() => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * motivationalPhrases.length);
        } while (motivationalPhrases[newIndex] === currentPhrase);
        
        setCurrentPhrase(motivationalPhrases[newIndex]);
        setIsChanging(false);
      }, 500); // Time for fade-out animation
      
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [currentPhrase]);

  return (
    <div className="motivational-header">
      <p className={`motivational-header__text ${isChanging ? 'fade-out' : 'fade-in'}`}>
        {currentPhrase}
      </p>
    </div>
  );
};

export default MotivationalHeader;
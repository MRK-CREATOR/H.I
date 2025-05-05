import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../../theme';

// Post Type Components
import IdeaSnapCard from './IdeaSnapCard';
import MarketGapCard from './MarketGapCard';
import ThoughtCard from './ThoughtCard';
import ObservationCard from './ObservationCard';

/**
 * FeedItem component
 * Container for different post types in the feed
 * Acts as a router that displays the appropriate card based on post type
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data
 * @param {Function} props.onPress - Function to handle post press
 */
const FeedItem = ({ data, onPress }) => {
  // Render appropriate card based on post type
  const renderPostCard = () => {
    switch (data.type) {
      case 'ideaSnap':
        return <IdeaSnapCard data={data} onPress={onPress} />;
      case 'marketGap':
        return <MarketGapCard data={data} onPress={onPress} />;
      case 'thought':
        return <ThoughtCard data={data} onPress={onPress} />;
      case 'observation':
        return <ObservationCard data={data} onPress={onPress} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderPostCard()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FeedItem;
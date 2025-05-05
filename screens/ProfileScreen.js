import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../theme';

// Components
import IdeaSnapCard from '../components/Feed/IdeaSnapCard';
import MarketGapCard from '../components/Feed/MarketGapCard';
import ThoughtCard from '../components/Feed/ThoughtCard';
import ObservationCard from '../components/Feed/ObservationCard';
import TextAvatar from '../components/UI/TextAvatar';

/**
 * User profile screen
 * Displays user information and their contributions
 */
const ProfileScreen = () => {
  // State
  const [activeTab, setActiveTab] = useState('contributions');
  const [userPosts, setUserPosts] = useState([]);
  const [userInteractions, setUserInteractions] = useState([]);
  const [userEndorsements, setUserEndorsements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redux
  const user = useSelector((state) => state.auth.user) || {
    fullName: 'Musk', // Demo data
    hiIdentityName: 'AlienX', // Demo data
  };
  
  useEffect(() => {
    // Fetch user data (simulated)
    fetchUserData();
  }, [activeTab]);
  
  // Simulated fetch user data
  const fetchUserData = () => {
    setLoading(true);
    
    // Simulated delay
    setTimeout(() => {
      if (activeTab === 'contributions') {
        // Mock user posts
        setUserPosts([
          {
            id: '1',
            type: 'ideaSnap',
            author: user.hiIdentityName,
            content: 'An AI co-founder for solopreneurs that can plan, market, and launch products.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            industry: 'Technology',
            expressions: 128,
            povCount: 14,
          },
          {
            id: '2',
            type: 'marketGap',
            author: user.hiIdentityName,
            content: 'There\'s no easy way for novice developers to contribute to open source. An onboarding path is needed.',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            industry: 'Software Development',
            expressions: 75,
            povCount: 12,
            solutionCount: 8,
          },
          {
            id: '3',
            type: 'thought',
            thoughtType: 'whatIf',
            author: user.hiIdentityName,
            content: 'What if city architecture was designed by AI using happiness metrics as success criteria?',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            industry: 'Urban Planning',
            expressions: 92,
            discussionCount: 21,
          },
        ]);
      } else if (activeTab === 'interactions') {
        // Mock user interactions
        setUserInteractions([
          {
            id: '1',
            type: 'pov',
            content: 'This could be revolutionary if paired with data analytics to predict customer needs.',
            parentPost: {
              id: '5',
              type: 'ideaSnap',
              author: 'InnovationGuru',
              content: 'A marketplace where corporations can invest in indie creators to develop products.',
              timestamp: new Date(Date.now() - 21600000).toISOString(),
              industry: 'Business',
            },
            timestamp: new Date(Date.now() - 18000000).toISOString(),
          },
          {
            id: '2',
            type: 'solution',
            content: 'Implement micro-credentials with real-world projects throughout courses. Smaller wins keep people motivated.',
            parentPost: {
              id: '6',
              type: 'marketGap',
              author: 'MindHacker',
              content: 'So many people buy online courses but never finish them. What\'s the missing link?',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              industry: 'Education',
            },
            timestamp: new Date(Date.now() - 5400000).toISOString(),
          },
          {
            id: '3',
            type: 'debate',
            content: 'It could create bias toward different kinds of thinkers. Not everyone performs well in sprint conditions.',
            parentPost: {
              id: '7',
              type: 'thought',
              thoughtType: 'whyNot',
              author: 'CriticalThinker',
              content: 'Why not replace resume screening with 5-minute idea tests?',
              timestamp: new Date(Date.now() - 14400000).toISOString(),
              industry: 'Human Resources',
            },
            timestamp: new Date(Date.now() - 10800000).toISOString(),
          },
        ]);
      } else if (activeTab === 'endorsements') {
        // Mock user endorsements
        setUserEndorsements([
          {
            id: '8',
            type: 'ideaSnap',
            author: 'TechVisionary',
            content: 'A platform that creates personalized nutrition plans based on your DNA, gut biome, and fitness goals.',
            timestamp: new Date(Date.now() - 36000000).toISOString(),
            industry: 'Health',
            expressions: 156,
            povCount: 23,
          },
          {
            id: '9',
            type: 'observation',
            author: 'TrendSpotter',
            content: 'Gen Z isn\'t abandoning email—they\'re just using it differently, primarily for official communications.',
            timestamp: new Date(Date.now() - 28800000).toISOString(),
            industry: 'Digital Trends',
            expressions: 87,
            povCount: 14,
          },
        ]);
      }
      
      setLoading(false);
    }, 800);
  };
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      );
    }
    
    switch (activeTab) {
      case 'contributions':
        return (
          <FlatList
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You haven't posted anything yet.</Text>
                <Text style={styles.emptySubText}>Share your ideas and thoughts with the community!</Text>
              </View>
            }
          />
        );
      case 'interactions':
        return (
          <FlatList
            data={userInteractions}
            renderItem={renderInteraction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No interactions yet.</Text>
                <Text style={styles.emptySubText}>Engage with posts to see your interactions here!</Text>
              </View>
            }
          />
        );
      case 'endorsements':
        return (
          <FlatList
            data={userEndorsements}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No endorsements yet.</Text>
                <Text style={styles.emptySubText}>Like and endorse posts to see them here!</Text>
              </View>
            }
          />
        );
      default:
        return null;
    }
  };
  
  // Render post based on type
  const renderPost = ({ item }) => {
    switch (item.type) {
      case 'ideaSnap':
        return <IdeaSnapCard data={item} />;
      case 'marketGap':
        return <MarketGapCard data={item} />;
      case 'thought':
        return <ThoughtCard data={item} />;
      case 'observation':
        return <ObservationCard data={item} />;
      default:
        return null;
    }
  };
  
  // Render interaction item
  const renderInteraction = ({ item }) => {
    return (
      <View style={styles.interactionContainer}>
        <View style={styles.interactionHeader}>
          <View style={styles.interactionTypeContainer}>
            <Text style={styles.interactionType}>
              {item.type === 'pov' ? 'Point of View' :
                item.type === 'solution' ? 'Solution' :
                item.type === 'debate' ? 'Debate' : 'Discussion'}
            </Text>
          </View>
          <Text style={styles.interactionTime}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        
        <View style={styles.interactionParent}>
          <Text style={styles.interactionParentAuthor}>{item.parentPost.author}</Text>
          <Text style={styles.interactionParentContent} numberOfLines={2}>
            {item.parentPost.content}
          </Text>
        </View>
        
        <View style={styles.interactionContent}>
          <Text style={styles.interactionContentText}>{item.content}</Text>
        </View>
      </View>
    );
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };
  
  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'HI';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  
  return (
    <View style={styles.container}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <TextAvatar 
          text={getInitials(user.hiIdentityName)} 
          size={80} 
          backgroundColor={theme.colors.accent}
        />
        
        <View style={styles.profileInfo}>
          {/* Original name (visible only to user) */}
          <Text style={styles.originalName}>{user.fullName}</Text>
          
          {/* H.I. Identity (visible to all) */}
          <Text style={styles.identityName}>{user.hiIdentityName}</Text>
        </View>
      </View>
      
      {/* Tab navigation */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'contributions' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('contributions')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'contributions' && styles.activeTabButtonText
              ]}
            >
              My Contributions
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'interactions' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('interactions')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'interactions' && styles.activeTabButtonText
              ]}
            >
              My Interactions
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'endorsements' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('endorsements')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'endorsements' && styles.activeTabButtonText
              ]}
            >
              My Endorsements & Likes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Tab content */}
      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  profileInfo: {
    marginLeft: theme.spacing.large,
  },
  originalName: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  identityName: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.xlarge,
    color: theme.colors.white,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  tabsScroll: {
    paddingHorizontal: theme.spacing.medium,
  },
  tabButton: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    marginRight: theme.spacing.medium,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.accent,
  },
  tabButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
  activeTabButtonText: {
    color: theme.colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.medium,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxlarge,
  },
  emptyContainer: {
    padding: theme.spacing.xxlarge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  emptySubText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  interactionContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  interactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.primary,
  },
  interactionTypeContainer: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.tiny,
    borderRadius: theme.borderRadius.small,
  },
  interactionType: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.tiny,
    color: theme.colors.white,
  },
  interactionTime: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.tiny,
    color: theme.colors.textSecondary,
  },
  interactionParent: {
    padding: theme.spacing.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  interactionParentAuthor: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.accent,
    marginBottom: 4,
  },
  interactionParentContent: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
  },
  interactionContent: {
    padding: theme.spacing.medium,
  },
  interactionContentText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.white,
    lineHeight: 22,
  },
});
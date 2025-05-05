import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../theme';

// Components
import IdeaSnapCard from '../components/Feed/IdeaSnapCard';
import MarketGapCard from '../components/Feed/MarketGapCard';
import ThoughtCard from '../components/Feed/ThoughtCard';
import ObservationCard from '../components/Feed/ObservationCard';

/**
 * Trending content screen
 * Displays trending posts from across the platform
 */
const TrendingScreen = ({ navigation }) => {
  // State
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Fetch trending data (simulated)
    fetchTrendingData();
  }, [activeTab]);
  
  // Simulated fetch trending data
  const fetchTrendingData = () => {
    setLoading(true);
    
    // Simulated delay
    setTimeout(() => {
      // Mock trending data
      const mockData = [
        {
          id: '1',
          type: 'ideaSnap',
          author: 'InnovationGuru',
          content: 'A marketplace where corporations can invest in indie creators to develop products.',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          industry: 'Business',
          expressions: 235,
          povCount: 42,
          trending: true,
        },
        {
          id: '2',
          type: 'marketGap',
          author: 'TechVisionary',
          content: 'There\'s no effective way to visually compare and contrast NFT collections for potential investment.',
          timestamp: new Date(Date.now() - 36000000).toISOString(),
          industry: 'Crypto/Blockchain',
          expressions: 188,
          povCount: 31,
          solutionCount: 27,
          trending: true,
        },
        {
          id: '3',
          type: 'thought',
          thoughtType: 'whatIf',
          author: 'FutureNaut',
          content: 'What if we could subscribe to public transportation like we do to Netflix?',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          industry: 'Transportation',
          expressions: 176,
          discussionCount: 39,
          trending: true,
        },
        {
          id: '4',
          type: 'observation',
          author: 'TrendSpotter',
          content: 'Burger King ran a campaign where they roasted their own failed ads. Viral and honest.',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          industry: 'Marketing',
          expressions: 155,
          povCount: 27,
          trending: true,
        },
        {
          id: '5',
          type: 'thought',
          thoughtType: 'whyNot',
          author: 'CriticalThinker',
          content: 'Why not replace resume screening with 5-minute idea tests?',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          industry: 'Human Resources',
          expressions: 143,
          debateCount: 36,
          trending: true,
        },
        {
          id: '6',
          type: 'ideaSnap',
          author: 'AlienX',
          content: 'An AI co-founder for solopreneurs that can plan, market, and launch products.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          industry: 'Technology',
          expressions: 138,
          povCount: 24,
          trending: true,
        },
      ];
      
      // Filter by active tab if not "all"
      let filteredData = mockData;
      
      if (activeTab !== 'all') {
        filteredData = mockData.filter(item => {
          if (activeTab === 'ideas') return item.type === 'ideaSnap';
          if (activeTab === 'marketGaps') return item.type === 'marketGap';
          if (activeTab === 'thoughts') return item.type === 'thought';
          if (activeTab === 'observations') return item.type === 'observation';
          return true;
        });
      }
      
      // Sort by expression count (higher = more trending)
      filteredData.sort((a, b) => b.expressions - a.expressions);
      
      setTrendingData(filteredData);
      setLoading(false);
    }, 1000);
  };
  
  // Render post based on type
  const renderTrendingItem = ({ item }) => {
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
  
  // Navigate back to home screen
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Trending Now</Text>
        
        <View style={styles.placeholderRight} />
      </View>
      
      {/* Filter tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'all' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'all' && styles.activeTabButtonText
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'ideas' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('ideas')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'ideas' && styles.activeTabButtonText
              ]}
            >
              Idea Snaps
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'marketGaps' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('marketGaps')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'marketGaps' && styles.activeTabButtonText
              ]}
            >
              Market Gaps
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'thoughts' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('thoughts')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'thoughts' && styles.activeTabButtonText
              ]}
            >
              Thoughts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'observations' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('observations')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'observations' && styles.activeTabButtonText
              ]}
            >
              Observations
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Trending content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Finding trending content...</Text>
        </View>
      ) : (
        <FlatList
          data={trendingData}
          renderItem={renderTrendingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No trending content found</Text>
              <Text style={styles.emptySubText}>
                Check back later for trending content in this category
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.medium,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: theme.colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.small,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
  },
  placeholderRight: {
    width: 40,
  },
  tabsContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabsContent: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  tabButton: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    marginRight: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
  },
  activeTabButton: {
    backgroundColor: theme.colors.accent,
  },
  tabButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
  },
  activeTabButtonText: {
    color: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxlarge,
  },
  loadingText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.medium,
  },
  listContent: {
    padding: theme.spacing.medium,
    paddingBottom: 40,
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
});

const ScrollView = require('react-native').ScrollView;

export default TrendingScreen;
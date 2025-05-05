import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../theme';

// Components
import IdeaSnapCard from '../components/Feed/IdeaSnapCard';
import MarketGapCard from '../components/Feed/MarketGapCard';
import ThoughtCard from '../components/Feed/ThoughtCard';
import ObservationCard from '../components/Feed/ObservationCard';
import FilterBar from '../components/Feed/FilterBar';

/**
 * WTF! (What The Future) main feed screen
 * Displays user-generated content in a scrollable feed
 */
const HomeScreen = ({ navigation }) => {
  // State
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [feedData, setFeedData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  // Redux
  const user = useSelector((state) => state.auth.user);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const logoScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });
  const logoTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });
  const logoTranslateX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });
  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  
  useEffect(() => {
    // Fetch feed data (simulated)
    fetchFeedData();
    
    // Set random motivational quote
    const quotes = theme.motivationalQuotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationalQuote(randomQuote);
    
    // Change quote every 20 seconds
    const quoteInterval = setInterval(() => {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setMotivationalQuote(newQuote);
    }, 20000);
    
    return () => clearInterval(quoteInterval);
  }, []);
  
  // Simulated fetch feed data
  const fetchFeedData = () => {
    setIsRefreshing(true);
    
    // Simulated data for MVP
    const mockData = [
      {
        id: '1',
        type: 'ideaSnap',
        author: 'AlienX',
        content: 'An AI co-founder for solopreneurs that can plan, market, and launch products.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        industry: 'Technology',
        expressions: 128,
        povCount: 14,
      },
      {
        id: '2',
        type: 'marketGap',
        author: 'MindHacker',
        content: 'So many people buy online courses but never finish them. What\'s the missing link?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        industry: 'Education',
        expressions: 85,
        povCount: 22,
        solutionCount: 17,
      },
      {
        id: '3',
        type: 'thought',
        thoughtType: 'whatIf',
        author: 'FutureNaut',
        content: 'What if we could subscribe to public transportation like we do to Netflix?',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        industry: 'Transportation',
        expressions: 56,
        discussionCount: 19,
      },
      {
        id: '4',
        type: 'thought',
        thoughtType: 'whyNot',
        author: 'CriticalThinker',
        content: 'Why not replace resume screening with 5-minute idea tests?',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        industry: 'Human Resources',
        expressions: 73,
        debateCount: 31,
      },
      {
        id: '5',
        type: 'observation',
        author: 'TrendSpotter',
        content: 'Burger King ran a campaign where they roasted their own failed ads. Viral and honest.',
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        industry: 'Marketing',
        expressions: 95,
        povCount: 27,
      },
      {
        id: '6',
        type: 'ideaSnap',
        author: 'InnovationGuru',
        content: 'A marketplace where corporations can invest in indie creators to develop products.',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        industry: 'Business',
        expressions: 112,
        povCount: 8,
      },
    ];
    
    // Filter data based on active filter
    let filteredData = mockData;
    if (activeFilter !== 'all') {
      filteredData = mockData.filter(item => {
        if (activeFilter === 'ideas') return item.type === 'ideaSnap';
        if (activeFilter === 'marketGaps') return item.type === 'marketGap';
        if (activeFilter === 'thoughts') return item.type === 'thought';
        if (activeFilter === 'observations') return item.type === 'observation';
        return true;
      });
    }
    
    setTimeout(() => {
      setFeedData(filteredData);
      setIsRefreshing(false);
    }, 800);
  };
  
  // Refresh feed data
  const handleRefresh = () => {
    fetchFeedData();
  };
  
  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Apply filter
  const applyFilter = (filter) => {
    setActiveFilter(filter);
    setShowFilters(false);
    fetchFeedData();
  };
  
  // Navigate to trending screen when logo is tapped
  const handleLogoPress = () => {
    navigation.navigate('Trending');
  };
  
  // Navigate to post creation
  const navigateToPostCreation = (type) => {
    navigation.navigate('PostCreation', { screen: 'CreatePost', params: { initialType: type } });
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
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Animated header */}
      <Animated.View style={styles.header}>
        {/* Logo and title */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.8}>
            <Animated.View 
              style={[
                styles.logoContainer, 
                { 
                  transform: [
                    { scale: logoScale },
                    { translateY: logoTranslateY },
                    { translateX: logoTranslateX }
                  ] 
                }
              ]}
            >
              <Text style={styles.logoText}>H.I.</Text>
            </Animated.View>
          </TouchableOpacity>
          
          <Animated.Text 
            style={[
              styles.headerTitle,
              {
                transform: [
                  { scale: titleScale },
                  { translateY: titleTranslateY }
                ]
              }
            ]}
          >
            WHAT THE FUTURE!
          </Animated.Text>
        </View>
        
        {/* Motivational quote */}
        <Text style={styles.quoteText}>{motivationalQuote}</Text>
        
        {/* Post type tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => navigateToPostCreation('ideaSnap')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabButtonText}>Idea Snap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => navigateToPostCreation('marketGap')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabButtonText}>Problem / Market Gap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => navigateToPostCreation('thought')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabButtonText}>Thought</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => navigateToPostCreation('observation')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabButtonText}>Observation</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
      
      {/* Main feed */}
      <FlatList
        data={feedData}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
      
      {/* Filter button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={toggleFilters}
        activeOpacity={0.8}
      >
        <Icon name="filter" size={24} color={theme.colors.white} />
      </TouchableOpacity>
      
      {/* Filter overlay */}
      {showFilters && (
        <FilterBar
          activeFilter={activeFilter}
          onSelectFilter={applyFilter}
          onClose={() => setShowFilters(false)}
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
    backgroundColor: theme.colors.backgroundLight,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing.large,
    marginBottom: 5,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.white,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.white,
    marginLeft: 16,
    letterSpacing: 1,
  },
  quoteText: {
    fontFamily: theme.fonts.italic || theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: theme.spacing.large,
  },
  tabsContainer: {
    paddingHorizontal: theme.spacing.medium,
  },
  tabsContent: {
    paddingHorizontal: theme.spacing.small,
  },
  tabButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: 4,
  },
  tabButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.white,
  },
  feedContent: {
    padding: theme.spacing.medium,
    paddingBottom: 80, // Extra padding at bottom for filter button
  },
  filterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
});

export default HomeScreen;
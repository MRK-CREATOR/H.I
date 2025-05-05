import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../theme';

/**
 * Generic post creation screen
 * Serves as a router to specific post creation components based on selected type
 */
const CreatePostScreen = ({ navigation, route }) => {
  // Get initial type from route params if available
  const initialType = route.params?.initialType || null;
  
  // State
  const [selectedType, setSelectedType] = useState(initialType);
  
  useEffect(() => {
    // If initial type is provided, navigate directly to that creator
    if (initialType) {
      navigateToCreator(initialType);
    }
  }, [initialType]);
  
  // Navigate to specific post creator based on type
  const navigateToCreator = (type) => {
    switch (type) {
      case 'ideaSnap':
        navigation.navigate('IdeaSnapCreator');
        break;
      case 'marketGap':
        navigation.navigate('MarketGapCreator');
        break;
      case 'thought':
        navigation.navigate('ThoughtCreator');
        break;
      case 'observation':
        navigation.navigate('ObservationCreator');
        break;
      default:
        // Stay on this screen if no valid type
        setSelectedType(null);
    }
  };
  
  // Handle type selection
  const handleSelectType = (type) => {
    setSelectedType(type);
    navigateToCreator(type);
  };
  
  // Navigate back to home screen
  const handleCancel = () => {
    navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Icon name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <View style={styles.placeholderRight} />
        </View>
        
        <Text style={styles.selectTypeTitle}>Select Post Type</Text>
        <Text style={styles.selectTypeSubtitle}>
          Choose the type of content you want to share with the community
        </Text>
        
        <View style={styles.typesList}>
          {/* Idea Snap */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              selectedType === 'ideaSnap' && styles.selectedTypeCard
            ]}
            onPress={() => handleSelectType('ideaSnap')}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: '#4ECCA3' }]}>
              <Icon name="bulb" size={28} color={theme.colors.white} />
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Idea Snap</Text>
              <Text style={styles.typeDescription}>
                Quick, innovative ideas that could shape the future
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {/* Market Gap */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              selectedType === 'marketGap' && styles.selectedTypeCard
            ]}
            onPress={() => handleSelectType('marketGap')}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: '#FF6868' }]}>
              <Icon name="alert-circle" size={28} color={theme.colors.white} />
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Problem / Market Gap</Text>
              <Text style={styles.typeDescription}>
                Pain points or untapped opportunities in the market
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {/* Thought */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              selectedType === 'thought' && styles.selectedTypeCard
            ]}
            onPress={() => handleSelectType('thought')}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: '#64C1FF' }]}>
              <Icon name="help-circle" size={28} color={theme.colors.white} />
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Thought</Text>
              <Text style={styles.typeDescription}>
                "What If" and "Why Not" questions that challenge the status quo
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {/* Observation */}
          <TouchableOpacity
            style={[
              styles.typeCard,
              selectedType === 'observation' && styles.selectedTypeCard
            ]}
            onPress={() => handleSelectType('observation')}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: '#FFD369' }]}>
              <Icon name="eye" size={28} color={theme.colors.white} />
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>Observation</Text>
              <Text style={styles.typeDescription}>
                Interesting trends, patterns, or anomalies you've noticed
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Post Guidelines</Text>
          <View style={styles.infoRow}>
            <Icon name="checkmark-circle" size={18} color={theme.colors.success} />
            <Text style={styles.infoText}>
              Be concise and clear in your writing
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="checkmark-circle" size={18} color={theme.colors.success} />
            <Text style={styles.infoText}>
              Select the appropriate industry or category
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="checkmark-circle" size={18} color={theme.colors.success} />
            <Text style={styles.infoText}>
              Preview your post before submitting
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="close-circle" size={18} color={theme.colors.error} />
            <Text style={styles.infoText}>
              No external links allowed in posts
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.large,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  cancelButton: {
    padding: theme.spacing.small,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
  },
  placeholderRight: {
    width: 40,
    height: 40,
  },
  selectTypeTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.xxlarge,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  selectTypeSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.large,
  },
  typesList: {
    marginBottom: theme.spacing.large,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedTypeCard: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(91, 110, 247, 0.1)',
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.medium,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    marginBottom: 4,
  },
  typeDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.large,
  },
  infoTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    marginBottom: theme.spacing.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  infoText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.small,
  },
});

export default CreatePostScreen;
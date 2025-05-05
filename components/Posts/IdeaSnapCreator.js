import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

// Components
import IndustrySelector from './IndustrySelector';
import PostPreview from '../UI/PostPreview';

/**
 * Idea Snap creation form component
 * Allows users to create and submit new idea snap posts
 */
const IdeaSnapCreator = ({ navigation }) => {
  // User data from Redux
  const user = useSelector(state => state.auth.user) || {
    hiIdentityName: 'Anonymous' // Fallback name
  };
  
  // Form state
  const [content, setContent] = useState('');
  const [industry, setIndustry] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Character limit
  const MAX_CHARS = 280;
  
  // Validate form
  const isFormValid = () => {
    return content.trim().length > 0 && industry.trim().length > 0;
  };
  
  // Check if over character limit
  const isOverCharLimit = content.length > MAX_CHARS;
  
  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    
    if (isOverCharLimit) {
      Alert.alert(
        'Character Limit Exceeded',
        `Your idea snap must be ${MAX_CHARS} characters or less.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Simulate API request
    setIsSubmitting(true);
    
    setTimeout(() => {
      // In a real app, this would be an API call to create the post
      console.log('Creating Idea Snap:', {
        type: 'ideaSnap',
        author: user.hiIdentityName,
        content,
        industry,
        timestamp: new Date().toISOString(),
      });
      
      setIsSubmitting(false);
      
      // Show success alert
      Alert.alert(
        'Idea Snap Submitted',
        'Your idea has been shared with the community.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form and navigate back to home screen
              setContent('');
              setIndustry('');
              navigation.navigate('Main');
            },
          },
        ]
      );
    }, 1500);
  };
  
  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (content.trim() || industry) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your idea snap?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Icon name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            {showPreview ? 'Preview' : 'Create Idea Snap'}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.previewButton,
              !isFormValid() && styles.disabledButton,
            ]}
            onPress={togglePreview}
            disabled={!isFormValid() || isSubmitting}
          >
            <Text
              style={[
                styles.previewButtonText,
                !isFormValid() && styles.disabledButtonText,
              ]}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {showPreview ? (
          // Preview mode
          <View style={styles.previewContainer}>
            <PostPreview
              type="ideaSnap"
              author={user.hiIdentityName}
              content={content}
              industry={industry}
              timestamp={new Date().toISOString()}
            />
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Share Idea Snap</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // Edit mode
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Your Idea <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Share a quick, innovative idea..."
                placeholderTextColor={theme.colors.placeholder}
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={MAX_CHARS + 50} // Allow typing a bit over to show error
                autoFocus
              />
              <View style={styles.charCounter}>
                <Text
                  style={[
                    styles.charCountText,
                    isOverCharLimit && styles.charCountError,
                  ]}
                >
                  {content.length}/{MAX_CHARS}
                </Text>
              </View>
            </View>
            
            <IndustrySelector
              selectedIndustry={industry}
              onSelectIndustry={setIndustry}
              required={true}
            />
            
            <View style={styles.guidelinesContainer}>
              <Text style={styles.guidelinesTitle}>Tips for a Great Idea Snap:</Text>
              <View style={styles.guidelineItem}>
                <Icon name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={styles.guidelineText}>Be concise and clear</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Icon name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={styles.guidelineText}>Focus on innovative solutions</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Icon name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={styles.guidelineText}>Consider practical applications</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Icon name="information-circle" size={16} color={theme.colors.info} />
                <Text style={styles.guidelineText}>
                  Example: "An AI co-founder for solopreneurs that can plan, market, and launch products."
                </Text>
              </View>
            </View>
          </View>
        )}
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
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.large,
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
  previewButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  previewButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.accent,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: theme.colors.textDisabled,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing.large,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  required: {
    color: theme.colors.error,
  },
  contentInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    minHeight: 150,
    textAlignVertical: 'top',
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  charCounter: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.small,
  },
  charCountText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
  },
  charCountError: {
    color: theme.colors.error,
  },
  guidelinesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.large,
    marginTop: theme.spacing.large,
  },
  guidelinesTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    marginBottom: theme.spacing.medium,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  guidelineText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.small,
    flex: 1,
  },
  previewContainer: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginTop: theme.spacing.large,
    ...theme.shadows.small,
  },
  submitButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
  },
});

export default IdeaSnapCreator;
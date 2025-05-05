import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

/**
 * POVInput component
 * Allows users to add their point of view (comment) to a post
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to handle POV submission
 * @param {string} props.postId - ID of the post being commented on
 * @param {string} props.postType - Type of the post (ideaSnap, marketGap, etc.)
 * @param {Function} props.onCancel - Function to handle cancellation
 */
const POVInput = ({ onSubmit, postId, postType, onCancel }) => {
  // User data from Redux
  const user = useSelector(state => state.auth.user) || {
    hiIdentityName: 'Anonymous' // Fallback name
  };
  
  // State
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Character limit
  const MAX_CHARS = 500;
  const isOverLimit = text.length > MAX_CHARS;
  
  // Handle text input
  const handleTextChange = (value) => {
    setText(value);
  };
  
  // Handle POV submission
  const handleSubmit = async () => {
    if (!text.trim() || isOverLimit) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare POV data
      const povData = {
        postId,
        postType,
        author: user.hiIdentityName,
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      
      // Call onSubmit prop with POV data
      await onSubmit(povData);
      
      // Clear input and hide keyboard
      setText('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to submit POV:', error);
      // In a real app, show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get placeholder text based on post type
  const getPlaceholderText = () => {
    switch (postType) {
      case 'ideaSnap':
        return 'Share your perspective on this idea...';
      case 'marketGap':
        return 'Share your thoughts on this market gap...';
      case 'observation':
        return 'Add your point of view to this observation...';
      default:
        return 'Add your point of view...';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Point of View</Text>
        
        <TextInput
          style={styles.textInput}
          placeholder={getPlaceholderText()}
          placeholderTextColor={theme.colors.placeholder}
          value={text}
          onChangeText={handleTextChange}
          multiline
          maxLength={MAX_CHARS + 50} // Allow typing slightly over the limit
          autoFocus
        />
        
        <View style={styles.inputFooter}>
          <Text 
            style={[
              styles.charCount,
              isOverLimit && styles.charCountError
            ]}
          >
            {text.length}/{MAX_CHARS}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!text.trim() || isOverLimit || isSubmitting) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={!text.trim() || isOverLimit || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <>
              <Icon name="paper-plane" size={16} color={theme.colors.white} style={styles.submitIcon} />
              <Text style={styles.submitButtonText}>Submit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.guidelines}>
        <Text style={styles.guidelinesText}>
          Share your perspective respectfully. Focus on adding value to the conversation.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
  },
  inputContainer: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  textInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    minHeight: 120,
    textAlignVertical: 'top',
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.small,
  },
  charCount: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
  },
  charCountError: {
    color: theme.colors.error,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
  },
  cancelButton: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
  },
  cancelButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
  submitButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    ...theme.shadows.small,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitIcon: {
    marginRight: theme.spacing.small,
  },
  submitButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.white,
  },
  guidelines: {
    paddingVertical: theme.spacing.small,
  },
  guidelinesText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default POVInput;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import TextAvatar from '../UI/TextAvatar';
import theme from '../../theme';

/**
 * SolutionProposal component
 * Allows users to propose solutions to market gap posts
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to handle solution submission
 * @param {string} props.postId - ID of the post being solved
 * @param {Array} props.solutions - List of existing solutions
 * @param {Function} props.onClose - Function to close the solution component
 */
const SolutionProposal = ({ onSubmit, postId, solutions = [], onClose }) => {
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
  
  // Handle solution submission
  const handleSubmit = async () => {
    if (!text.trim() || isOverLimit) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare solution data
      const solutionData = {
        postId,
        type: 'solution',
        author: user.hiIdentityName,
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      
      // Call onSubmit prop with solution data
      await onSubmit(solutionData);
      
      // Clear input and hide keyboard
      setText('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to submit solution:', error);
      // In a real app, show error message to user
    } finally {
      setIsSubmitting(false);
    }
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
  
  // Render solution item
  const renderSolution = ({ item }) => {
    return (
      <View style={styles.solutionItem}>
        <View style={styles.solutionHeader}>
          <View style={styles.solutionAuthor}>
            <TextAvatar
              text={getInitials(item.author)}
              size={28}
              backgroundColor={theme.colors.accent}
            />
            <Text style={styles.authorName}>{item.author}</Text>
          </View>
          <Text style={styles.solutionTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <Text style={styles.solutionContent}>{item.content}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Propose a Solution</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {solutions.length > 0 ? (
        <FlatList
          data={solutions}
          renderItem={renderSolution}
          keyExtractor={(item, index) => `${item.id || index}`}
          style={styles.solutionsList}
          contentContainerStyle={styles.solutionsContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="construct-outline" size={40} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>
            Be the first to propose a solution!
          </Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Your Solution</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Suggest a solution to this market gap..."
          placeholderTextColor={theme.colors.placeholder}
          value={text}
          onChangeText={handleTextChange}
          multiline
          maxLength={MAX_CHARS + 50} // Allow typing slightly over the limit
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
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
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
              <Icon name="bulb" size={16} color={theme.colors.white} style={styles.submitIcon} />
              <Text style={styles.submitButtonText}>Submit Solution</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.guidelines}>
        <View style={styles.guidelineItem}>
          <Icon name="checkmark-circle" size={14} color={theme.colors.success} />
          <Text style={styles.guidelineText}>
            Be specific and actionable
          </Text>
        </View>
        <View style={styles.guidelineItem}>
          <Icon name="checkmark-circle" size={14} color={theme.colors.success} />
          <Text style={styles.guidelineText}>
            Focus on solving the core problem
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.large,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    paddingTop: 0,
  },
  cancelButton: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
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
    padding: theme.spacing.medium,
    paddingTop: 0,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  guidelineText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.small,
  },
});

export default SolutionProposal;
  },
  solutionsList: {
    flex: 1,
    maxHeight: 250, // Limit height to leave room for input
  },
  solutionsContent: {
    padding: theme.spacing.medium,
  },
  emptyContainer: {
    padding: theme.spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.medium,
  },
  solutionItem: {
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  solutionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  solutionAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.accent,
    marginLeft: theme.spacing.small,
  },
  solutionTime: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.tiny,
    color: theme.colors.textSecondary,
  },
  solutionContent: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.white,
    lineHeight: 22,
  },
  inputContainer: {
    padding: theme.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  textInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    
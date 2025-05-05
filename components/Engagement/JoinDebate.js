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
 * JoinDebate component
 * Allows users to participate in discussions or debates on "What If" or "Why Not" thoughts
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to handle comment submission
 * @param {string} props.postId - ID of the post being commented on
 * @param {string} props.thoughtType - Type of thought ('whatIf' or 'whyNot')
 * @param {Array} props.comments - List of existing comments
 * @param {Function} props.onClose - Function to close the debate component
 */
const JoinDebate = ({ onSubmit, postId, thoughtType, comments = [], onClose }) => {
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
  
  // Handle comment submission
  const handleSubmit = async () => {
    if (!text.trim() || isOverLimit) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare comment data
      const commentData = {
        postId,
        type: thoughtType === 'whatIf' ? 'discussion' : 'debate',
        author: user.hiIdentityName,
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      
      // Call onSubmit prop with comment data
      await onSubmit(commentData);
      
      // Clear input and hide keyboard
      setText('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      // In a real app, show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get component title based on thought type
  const getTitle = () => {
    return thoughtType === 'whatIf' ? 'Join the Discussion' : 'Join the Debate';
  };
  
  // Get placeholder text based on thought type
  const getPlaceholderText = () => {
    return thoughtType === 'whatIf'
      ? 'Share your thoughts on this idea...'
      : 'Share your perspective on this challenge...';
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
  
  // Render comment item
  const renderComment = ({ item }) => {
    return (
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAuthor}>
            <TextAvatar
              text={getInitials(item.author)}
              size={28}
              backgroundColor={theme.colors.accent}
            />
            <Text style={styles.authorName}>{item.author}</Text>
          </View>
          <Text style={styles.commentTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <Text style={styles.commentContent}>{item.content}</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {comments.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item, index) => `${item.id || index}`}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon 
            name={thoughtType === 'whatIf' ? 'chatbubbles-outline' : 'git-compare-outline'} 
            size={40} 
            color={theme.colors.textSecondary} 
          />
          <Text style={styles.emptyText}>
            {thoughtType === 'whatIf'
              ? 'Be the first to join this discussion!'
              : 'Be the first to join this debate!'}
          </Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={getPlaceholderText()}
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
              <Icon name="paper-plane" size={18} color={theme.colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.guidelines}>
        <Text style={styles.guidelinesText}>
          {thoughtType === 'whatIf'
            ? 'Focus on exploring possibilities and building on ideas.'
            : 'Challenge ideas respectfully. Focus on concepts, not people.'}
        </Text>
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
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    padding: theme.spacing.medium,
  },
  emptyContainer: {
    padding: theme.spacing.xxlarge,
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
  commentItem: {
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.accent,
    marginLeft: theme.spacing.small,
  },
  commentTime: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.tiny,
    color: theme.colors.textSecondary,
  },
  commentContent: {
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
  textInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    minHeight: 80,
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  submitButton: {
    backgroundColor: theme.colors.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  disabledButton: {
    opacity: 0.5,
  },
  guidelines: {
    padding: theme.spacing.medium,
    paddingTop: 0,
  },
  guidelinesText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default JoinDebate;
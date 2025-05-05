import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TextAvatar from '../UI/TextAvatar';
import theme from '../../theme';

/**
 * ThoughtCard component
 * Displays a Thought post (What If/Why Not) in the feed
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Thought data
 * @param {Function} props.onPress - Function to handle post press
 */
const ThoughtCard = ({ data, onPress }) => {
  // State
  const [liked, setLiked] = useState(false);
  const [expressionCount, setExpressionCount] = useState(data.expressions || 0);
  const [discussionInputVisible, setDiscussionInputVisible] = useState(false);
  const [discussionText, setDiscussionText] = useState('');
  
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
  
  // Handle like button press
  const toggleLike = () => {
    if (liked) {
      setExpressionCount(expressionCount - 1);
    } else {
      setExpressionCount(expressionCount + 1);
    }
    setLiked(!liked);
  };
  
  // Show discussion input modal
  const showDiscussionInput = () => {
    setDiscussionInputVisible(true);
  };
  
  // Hide discussion input modal
  const hideDiscussionInput = () => {
    setDiscussionInputVisible(false);
    setDiscussionText('');
  };
  
  // Handle submitting discussion or debate
  const submitDiscussion = () => {
    if (discussionText.trim()) {
      // In a real app, this would send the discussion to an API
      console.log('Submitted Discussion/Debate:', discussionText);
      setDiscussionText('');
      setDiscussionInputVisible(false);
      
      // Here you could update the discussion count or show a success message
      // This is just a mock implementation
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
  
  // Get post type tag text
  const getPostTypeText = () => {
    return data.thoughtType === 'whatIf' ? 'What If' : 'Why Not';
  };
  
  // Get post type tag color
  const getPostTypeColor = () => {
    return data.thoughtType === 'whatIf' ? theme.colors.info : theme.colors.warning;
  };
  
  // Get discussion or debate text
  const getDiscussionText = () => {
    if (data.thoughtType === 'whatIf') {
      return data.discussionCount ? `Join Discussion (${data.discussionCount})` : 'Join Discussion';
    } else {
      return data.debateCount ? `Join Debate (${data.debateCount})` : 'Join Debate';
    }
  };
  
  // Get modal title
  const getModalTitle = () => {
    return data.thoughtType === 'whatIf' ? 'Join the Discussion' : 'Join the Debate';
  };
  
  // Get modal placeholder
  const getModalPlaceholder = () => {
    return data.thoughtType === 'whatIf' 
      ? 'Share your thoughts on this idea...'
      : 'Share your perspective on this challenge...';
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.postTypeTag, { backgroundColor: getPostTypeColor() }]}>
            <Text style={styles.postTypeText}>{getPostTypeText()}</Text>
          </View>
          <Text style={styles.timestamp}>{formatTimestamp(data.timestamp)}</Text>
        </View>
        
        <TouchableOpacity style={styles.authorContainer}>
          <TextAvatar
            text={getInitials(data.author)}
            size={36}
            backgroundColor={theme.colors.accent}
          />
          <Text style={styles.authorName}>{data.author}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Text style={styles.content}>{data.content}</Text>
      </TouchableOpacity>
      
      {/* Industry Tag */}
      {data.industry && (
        <View style={styles.industryContainer}>
          <Text style={styles.industryText}>{data.industry}</Text>
        </View>
      )}
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerActions}>
          {/* Expression Button */}
          <TouchableOpacity
            style={[styles.actionButton, liked && styles.actionButtonActive]}
            onPress={toggleLike}
          >
            <Icon
              name={liked ? 'help-circle' : 'help-circle-outline'}
              size={20}
              color={liked ? getPostTypeColor() : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.actionText,
                liked && { color: getPostTypeColor() }
              ]}
            >
              {expressionCount}
            </Text>
          </TouchableOpacity>
          
          {/* Discussion/Debate Button */}
          <TouchableOpacity
            style={styles.discussionButton}
            onPress={showDiscussionInput}
          >
            <Icon 
              name={data.thoughtType === 'whatIf' ? 'chatbubbles-outline' : 'git-compare-outline'} 
              size={18} 
              color={theme.colors.textSecondary}
            />
            <Text style={styles.actionText}>{getDiscussionText()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Discussion/Debate Input Modal */}
      <Modal
        visible={discussionInputVisible}
        transparent
        animationType="slide"
        onRequestClose={hideDiscussionInput}
      >
        <TouchableWithoutFeedback onPress={hideDiscussionInput}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                  <TouchableOpacity onPress={hideDiscussionInput}>
                    <Icon name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  style={styles.modalInput}
                  placeholder={getModalPlaceholder()}
                  placeholderTextColor={theme.colors.placeholder}
                  value={discussionText}
                  onChangeText={setDiscussionText}
                  multiline
                  autoFocus
                />
                
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !discussionText.trim() && styles.disabledButton
                  ]}
                  onPress={submitDiscussion}
                  disabled={!discussionText.trim()}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTypeTag: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.tiny,
    borderRadius: theme.borderRadius.small,
    marginRight: theme.spacing.medium,
  },
  postTypeText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.tiny,
    color: theme.colors.white,
  },
  timestamp: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.tiny,
    color: theme.colors.textSecondary,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.accent,
    marginLeft: theme.spacing.small,
  },
  contentContainer: {
    padding: theme.spacing.large,
  },
  content: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    lineHeight: 24,
  },
  industryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'flex-start',
    marginHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.tiny,
    borderRadius: theme.borderRadius.medium,
  },
  industryText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.tiny,
    color: theme.colors.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(100, 193, 255, 0.1)',
    borderRadius: theme.borderRadius.small,
  },
  actionText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.small,
  },
  discussionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundDark,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    paddingBottom: 30, // Extra padding for iOS home indicator
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  modalTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
  },
  modalInput: {
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
    marginBottom: theme.spacing.large,
  },
  submitButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
  },
});

export default ThoughtCard;
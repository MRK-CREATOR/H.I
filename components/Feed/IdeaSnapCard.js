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
 * IdeaSnapCard component
 * Displays an Idea Snap post in the feed
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Idea Snap data
 * @param {Function} props.onPress - Function to handle post press
 */
const IdeaSnapCard = ({ data, onPress }) => {
  // State
  const [liked, setLiked] = useState(false);
  const [expressionCount, setExpressionCount] = useState(data.expressions || 0);
  const [povInputVisible, setPovInputVisible] = useState(false);
  const [povText, setPovText] = useState('');
  const [isEndorsing, setIsEndorsing] = useState(false);
  
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
  
  // Show POV input modal
  const showPovInput = () => {
    setPovInputVisible(true);
  };
  
  // Hide POV input modal
  const hidePovInput = () => {
    setPovInputVisible(false);
    setPovText('');
  };
  
  // Handle submitting POV
  const submitPov = () => {
    if (povText.trim()) {
      // In a real app, this would send the POV to an API
      console.log('Submitted POV:', povText);
      setPovText('');
      setPovInputVisible(false);
      
      // Here you could update the POV count or show a success message
      // This is just a mock implementation
    }
  };
  
  // Toggle endorsement
  const toggleEndorsement = () => {
    setIsEndorsing(!isEndorsing);
    // In a real app, this would make an API call to endorse the post
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.postTypeTag}>
            <Text style={styles.postTypeText}>Idea Snap</Text>
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
              name={liked ? 'bulb' : 'bulb-outline'}
              size={20}
              color={liked ? theme.colors.accent : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.actionText,
                liked && styles.actionTextActive
              ]}
            >
              {expressionCount}
            </Text>
          </TouchableOpacity>
          
          {/* POV Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={showPovInput}
          >
            <Icon name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>
              {data.povCount ? `POV (${data.povCount})` : 'POV'}
            </Text>
          </TouchableOpacity>
          
          {/* Endorsement Button */}
          <TouchableOpacity
            style={[styles.actionButton, isEndorsing && styles.actionButtonActive]}
            onPress={toggleEndorsement}
          >
            <Icon
              name={isEndorsing ? 'star' : 'star-outline'}
              size={20}
              color={isEndorsing ? theme.colors.accent : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.actionText,
                isEndorsing && styles.actionTextActive
              ]}
            >
              Endorse
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* POV Input Modal */}
      <Modal
        visible={povInputVisible}
        transparent
        animationType="slide"
        onRequestClose={hidePovInput}
      >
        <TouchableWithoutFeedback onPress={hidePovInput}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Your Point of View</Text>
                  <TouchableOpacity onPress={hidePovInput}>
                    <Icon name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  style={styles.povInput}
                  placeholder="Share your thoughts on this idea..."
                  placeholderTextColor={theme.colors.placeholder}
                  value={povText}
                  onChangeText={setPovText}
                  multiline
                  autoFocus
                />
                
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !povText.trim() && styles.disabledButton
                  ]}
                  onPress={submitPov}
                  disabled={!povText.trim()}
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
    backgroundColor: theme.colors.success,
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
    backgroundColor: 'rgba(91, 110, 247, 0.1)',
    borderRadius: theme.borderRadius.small,
  },
  actionText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.small,
  },
  actionTextActive: {
    color: theme.colors.accent,
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
  povInput: {
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

export default IdeaSnapCard;
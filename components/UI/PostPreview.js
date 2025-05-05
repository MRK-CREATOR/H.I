import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TextAvatar from './TextAvatar';
import theme from '../../theme';

/**
 * PostPreview component
 * Displays a preview of the post before publishing
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of post (ideaSnap, marketGap, thought, observation)
 * @param {string} props.thoughtType - Type of thought (whatIf, whyNot) when type is 'thought'
 * @param {string} props.author - Author's H.I Identity name
 * @param {string} props.content - Post content
 * @param {string} props.industry - Post industry
 * @param {string} props.timestamp - Post timestamp
 */
const PostPreview = ({ 
  type, 
  thoughtType, 
  author, 
  content, 
  industry, 
  timestamp 
}) => {
  // Get post type tag text
  const getPostTypeText = () => {
    switch (type) {
      case 'ideaSnap':
        return 'Idea Snap';
      case 'marketGap':
        return 'Market Gap';
      case 'thought':
        return thoughtType === 'whatIf' ? 'What If' : 'Why Not';
      case 'observation':
        return 'Observation';
      default:
        return 'Post';
    }
  };
  
  // Get post type tag color
  const getPostTypeColor = () => {
    switch (type) {
      case 'ideaSnap':
        return theme.colors.success;
      case 'marketGap':
        return theme.colors.error;
      case 'thought':
        return thoughtType === 'whatIf' 
          ? theme.colors.info 
          : theme.colors.warning;
      case 'observation':
        return theme.colors.warning;
      default:
        return theme.colors.accent;
    }
  };
  
  // Get icon name based on post type
  const getIconName = () => {
    switch (type) {
      case 'ideaSnap':
        return 'bulb';
      case 'marketGap':
        return 'alert-circle';
      case 'thought':
        return 'help-circle';
      case 'observation':
        return 'eye';
      default:
        return 'document-text';
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
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.previewContainer}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Post Preview</Text>
          <Text style={styles.previewSubtitle}>
            Here's how your post will appear
          </Text>
        </View>
        
        <View style={styles.postContainer}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <View style={styles.headerLeft}>
              <View 
                style={[
                  styles.postTypeTag, 
                  { backgroundColor: getPostTypeColor() }
                ]}
              >
                <Text style={styles.postTypeText}>
                  {getPostTypeText()}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {formatTimestamp(timestamp)}
              </Text>
            </View>
            
            <View style={styles.authorContainer}>
              <TextAvatar
                text={getInitials(author)}
                size={36}
                backgroundColor={theme.colors.accent}
              />
              <Text style={styles.authorName}>{author}</Text>
            </View>
          </View>
          
          {/* Post Content */}
          <View style={styles.postContent}>
            <Text style={styles.contentText}>{content}</Text>
          </View>
          
          {/* Industry Tag */}
          {industry && (
            <View style={styles.industryContainer}>
              <Text style={styles.industryText}>{industry}</Text>
            </View>
          )}
          
          {/* Post Footer (Mocked) */}
          <View style={styles.postFooter}>
            <View style={styles.footerAction}>
              <Icon 
                name={getIconName()} 
                size={20} 
                color={theme.colors.textSecondary} 
              />
              <Text style={styles.footerActionText}>0</Text>
            </View>
            
            {type === 'ideaSnap' && (
              <>
                <View style={styles.footerAction}>
                  <Icon name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.footerActionText}>POV</Text>
                </View>
                <View style={styles.footerAction}>
                  <Icon name="star-outline" size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.footerActionText}>Endorse</Text>
                </View>
              </>
            )}
            
            {type === 'marketGap' && (
              <>
                <View style={styles.footerAction}>
                  <Icon name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.footerActionText}>POV</Text>
                </View>
                <View style={styles.footerAction}>
                  <Icon name="construct-outline" size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.footerActionText}>Solution</Text>
                </View>
              </>
            )}
            
            {type === 'thought' && (
              <View style={styles.footerAction}>
                <Icon 
                  name={thoughtType === 'whatIf' ? 'chatbubbles-outline' : 'git-compare-outline'} 
                  size={18} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={styles.footerActionText}>
                  {thoughtType === 'whatIf' ? 'Join Discussion' : 'Join Debate'}
                </Text>
              </View>
            )}
            
            {type === 'observation' && (
              <View style={styles.footerAction}>
                <Icon name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.footerActionText}>POV</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  previewTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  previewSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
  },
  postContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  postHeader: {
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
  postContent: {
    padding: theme.spacing.large,
  },
  contentText: {
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
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.large,
    paddingVertical: theme.spacing.small,
  },
  footerActionText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.small,
  },
});

export default PostPreview;
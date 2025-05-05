import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

/**
 * Bottom Navigation component
 * App navigation bar with tab buttons
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabPress - Function to handle tab press
 */
const BottomNavigation = ({ activeTab, onTabPress }) => {
  // Get safe area insets
  const insets = useSafeAreaInsets();
  
  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  
  // Define tab items
  const tabs = [
    {
      id: 'home',
      label: 'WTF!',
      icon: 'home',
      iconActive: 'home',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: 'person-outline',
      iconActive: 'person',
    },
  ];
  
  // Calculate bottom padding based on safe area insets
  const bottomPadding = Math.max(insets.bottom, 10);
  
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              {
                width: screenWidth / tabs.length,
              },
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Icon
              name={activeTab === tab.id ? tab.iconActive : tab.icon}
              size={24}
              color={
                activeTab === tab.id
                  ? theme.colors.accent
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  activeTabLabel: {
    color: theme.colors.accent,
  },
});

export default BottomNavigation;
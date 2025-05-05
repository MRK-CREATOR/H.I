import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

/**
 * FilterBar component
 * Provides content filtering interface for the feed
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeFilter - Currently active filter
 * @param {Function} props.onSelectFilter - Function to handle filter selection
 * @param {Function} props.onClose - Function to close filter bar
 */
const FilterBar = ({ activeFilter, onSelectFilter, onClose }) => {
  // Filter options
  const filters = [
    { id: 'all', label: 'All Content', icon: 'apps-outline' },
    { id: 'ideas', label: 'Idea Snaps', icon: 'bulb-outline', color: theme.colors.success },
    { id: 'marketGaps', label: 'Market Gaps', icon: 'alert-circle-outline', color: theme.colors.error },
    { id: 'thoughts', label: 'Thoughts', icon: 'help-circle-outline', color: theme.colors.info },
    { id: 'observations', label: 'Observations', icon: 'eye-outline', color: theme.colors.warning },
  ];
  
  // Handle filter selection
  const handleSelectFilter = (filterId) => {
    onSelectFilter(filterId);
  };
  
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Content</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filtersList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterItem,
                  activeFilter === filter.id && styles.activeFilterItem
                ]}
                onPress={() => handleSelectFilter(filter.id)}
                activeOpacity={0.7}
              >
                <View style={styles.filterLeft}>
                  <Icon
                    name={filter.icon
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

/**
 * Industry selector component for post creation forms
 * Allows users to select from a list of industries or add a custom one
 * @param {Object} props - Component props
 * @param {string} props.selectedIndustry - Currently selected industry
 * @param {Function} props.onSelectIndustry - Function to handle industry selection
 * @param {boolean} props.required - Whether selection is required
 */
const IndustrySelector = ({ selectedIndustry, onSelectIndustry, required = true }) => {
  // State
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // List of predefined industries
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Entertainment',
    'Marketing',
    'E-commerce',
    'Manufacturing',
    'Transportation',
    'Real Estate',
    'Food & Beverage',
    'Energy',
    'Agriculture',
    'Fashion',
    'Sports',
    'Travel',
    'Media',
    'Telecommunications',
    'Construction',
    'Automotive',
    'Human Resources',
    'Legal',
    'Crypto/Blockchain',
    'Artificial Intelligence',
    'Sustainability',
    'Fitness & Wellness',
    'Gaming',
    'Social Media',
    'Retail',
    'Logistics',
    'Non-profit',
    'Design',
    'Urban Planning',
    'Science',
    'Business Services',
    'Music',
    'Art',
    'Digital Trends',
    'Software Development',
  ];
  
  // Open industry selector modal
  const openModal = () => {
    setModalVisible(true);
    setSearchTerm('');
    setShowCustomInput(false);
  };
  
  // Close industry selector modal
  const closeModal = () => {
    setModalVisible(false);
    setCustomIndustry('');
  };
  
  // Handle selecting an industry from the list
  const handleSelectItem = (industry) => {
    onSelectIndustry(industry);
    closeModal();
  };
  
  // Handle adding a custom industry
  const handleAddCustom = () => {
    if (customIndustry.trim()) {
      onSelectIndustry(customIndustry.trim());
      closeModal();
    }
  };
  
  // Show custom industry input
  const showAddCustom = () => {
    setShowCustomInput(true);
  };
  
  // Filter industries based on search term
  const filteredIndustries = searchTerm
    ? industries.filter(
        item => item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : industries;
    
  // Render industry item
  const renderIndustryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.industryItem}
        onPress={() => handleSelectItem(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.industryItemText}>{item}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Industry {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={styles.selector}
        onPress={openModal}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectorText,
            !selectedIndustry && styles.placeholderText,
          ]}
        >
          {selectedIndustry || 'Select an industry'}
        </Text>
        <Icon name="chevron-down" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Industry</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Icon name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.searchContainer}>
                  <Icon name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search industries"
                    placeholderTextColor={theme.colors.placeholder}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    autoCapitalize="none"
                  />
                </View>
                
                {showCustomInput ? (
                  <View style={styles.customInputContainer}>
                    <TextInput
                      style={styles.customInput}
                      placeholder="Enter custom industry"
                      placeholderTextColor={theme.colors.placeholder}
                      value={customIndustry}
                      onChangeText={setCustomIndustry}
                      autoCapitalize="words"
                      autoFocus
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddCustom}
                      disabled={!customIndustry.trim()}
                    >
                      <Text
                        style={[
                          styles.addButtonText,
                          !customIndustry.trim() && styles.disabledText,
                        ]}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.customButton}
                    onPress={showAddCustom}
                  >
                    <Icon name="add" size={20} color={theme.colors.accent} />
                    <Text style={styles.customButtonText}>Add custom industry</Text>
                  </TouchableOpacity>
                )}
                
                <FlatList
                  data={filteredIndustries}
                  renderItem={renderIndustryItem}
                  keyExtractor={(item) => item}
                  contentContainerStyle={styles.industryList}
                  showsVerticalScrollIndicator={true}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>
                      No industries found. Try a different search term or add a custom industry.
                    </Text>
                  }
                />
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
    marginBottom: theme.spacing.medium,
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
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.medium,
    minHeight: 54,
  },
  selectorText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
  },
  placeholderText: {
    color: theme.colors.placeholder,
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
    paddingBottom: 20, // Extra padding for iOS devices with home indicator
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.large,
    color: theme.colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    margin: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  searchIcon: {
    marginRight: theme.spacing.small,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    padding: theme.spacing.medium,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  customButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.accent,
    marginLeft: theme.spacing.small,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    margin: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  customInput: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    padding: theme.spacing.medium,
  },
  addButton: {
    paddingHorizontal: theme.spacing.medium,
  },
  addButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.accent,
  },
  disabledText: {
    color: theme.colors.textDisabled,
  },
  industryList: {
    paddingHorizontal: theme.spacing.medium,
  },
  industryItem: {
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  industryItemText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
  },
  emptyText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.large,
  },
});

export default IndustrySelector;
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';

interface Props {
  selectedTab: 'available' | 'delivered';
  onTabChange: React.Dispatch<React.SetStateAction<'available' | 'delivered'>>;
}

const TabBar: FC<Props> = ({ selectedTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'available' && styles.activeTab]}
        onPress={() => onTabChange('available')}
      >
        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={[
            styles.tabText,
            selectedTab === 'available'
              ? styles.activeTabText
              : styles.inactiveTabText,
          ]}
        >
          Available
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'delivered' && styles.activeTab]}
        onPress={() => onTabChange('delivered')}
      >
        <CustomText
          variant="h8"
          fontFamily={Fonts.SemiBold}
          style={[
            styles.tabText,
            selectedTab === 'delivered'
              ? styles.activeTabText
              : styles.inactiveTabText,
          ]}
        >
          Delivered
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    width: '38%',
    margin: 10,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  tabText: {
    color: Colors.text,
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: Colors.disabled,
  },
});

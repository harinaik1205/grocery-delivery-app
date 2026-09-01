import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { goBack } from '@utils/NavigationUtils';
import CustomText from './CustomText';
import { RFValue } from 'react-native-responsive-fontsize';

interface CustomHeaderProps {
  title: string;
  search?: boolean;
}

const CustomHeader: FC<CustomHeaderProps> = ({ title, search }) => {
  return (
    <SafeAreaView>
      <View style={styles.flexRow}>
        <Pressable onPress={() => goBack()}>
          <IonIcon name="chevron-back" color={Colors.text} />
        </Pressable>
        <CustomText
          variant="h5"
          style={styles.text}
          fontFamily={Fonts.SemiBold}
        >
          {title}
        </CustomText>
        <View>
          {search && (
            <IonIcon name="search" color={Colors.text} size={RFValue(16)} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'space-between',
    padding: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
  },
  text: {
    textAlign: 'center',
  },
});

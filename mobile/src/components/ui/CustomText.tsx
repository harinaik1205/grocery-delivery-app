import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React, { FC } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@utils/Constants';

interface Props {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'h7'
    | 'h8'
    | 'h9'
    | 'body';
  fontFamily?: string;
  fonSize?: number;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: Object) => void;
}
const CustomText: FC<Props> = ({
  variant,
  fontFamily,
  fonSize,
  style,
  children,
  numberOfLines,
  onLayout,
  ...props
}) => {
  let computedSize = RFValue(fonSize || 12);

  switch (variant) {
    case 'h1':
      computedSize = RFValue(fonSize || 22);
      break;
    case 'h2':
      computedSize = RFValue(fonSize || 20);
      break;
    case 'h3':
      computedSize = RFValue(fonSize || 18);
      break;
    case 'h4':
      computedSize = RFValue(fonSize || 16);
      break;
    case 'h5':
      computedSize = RFValue(fonSize || 14);
      break;
    case 'h6':
      computedSize = RFValue(fonSize || 12);
      break;
    case 'h7':
      computedSize = RFValue(fonSize || 12);
      break;
    case 'h8':
      computedSize = RFValue(fonSize || 10);
      break;
    case 'h9':
      computedSize = RFValue(fonSize || 9);
      break;
    case 'body':
      computedSize = RFValue(fonSize || 12);
      break;
  }

  return (
    <Text
      style={[
        styles.text,
        { color: Colors.text, fontSize: computedSize, fontFamily },
        style,
      ]}
      onLayout={onLayout}
      numberOfLines={numberOfLines || undefined}
    >
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

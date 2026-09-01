import { Image, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import ScalePress from './ScalePress';
import CustomText from '@components/ui/CustomText';
import { navigate } from '@utils/NavigationUtils';

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  discountPrice: number;
  quantity: string;
};

type Category = {
  id: number;
  name: string;
  image: any;
  products?: Product[];
};

interface Props {
  categories: Category[];
}

const CategoryContainer: FC<Props> = ({ categories }) => {
  const renderItems = (items?: Category[]) => {
    return (
      <>
        {items?.map((item, index) => {
          return (
            <ScalePress
              key={index}
              style={styles.item}
              onPress={() => {
                console.log('category pressed', item);
                navigate('ProductCategories');
              }}
            >
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
              </View>
              <CustomText style={styles.text}>{item.name}</CustomText>
            </ScalePress>
          );
        })}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>{renderItems(categories?.slice(0, 4))}</View>
      <View style={styles.row}>{renderItems(categories?.slice(4))}</View>
    </View>
  );
};

export default CategoryContainer;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  text: {
    textAlign: 'center',
  },
  item: {
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 6,
    backgroundColor: '#e5f3f3',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

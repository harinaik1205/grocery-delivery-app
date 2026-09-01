import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { Colors } from '@utils/Constants';
import ProductItem from './ProductItem';
import { FlashList } from '@shopify/flash-list';

interface ProductListProps {
  products: any[];
}

const ProductList: FC<ProductListProps> = ({ products }) => {
  const renderItem = ({ item, index }: any) => {
    return <ProductItem item={item} index={index} />;
  };

  return (
    <FlashList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item, index) => item._id}
      style={styles.container}
      contentContainerStyle={styles.content}
      numColumns={2}
    />
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    paddingVertical: 10,
    paddingBottom: 100,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect } from 'react';
import { getProductsByCategoryId } from '@services/productServices';
import { Colors } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import ProductItem from './ProductItem';
import ProductList from './ProductList';
import { FlashList } from '@shopify/flash-list';

interface CategoryProductsProps {
  categoryId: string | undefined;
}

const CategoryProducts: FC<CategoryProductsProps> = ({ categoryId }) => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [productsLoading, setProductsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await getProductsByCategoryId(categoryId!);
      // console.log('===========');
      // console.log('prods reponse', response);
      // console.log('===========');
      setProducts(response.products);
    } catch (error) {
      console.log('error while fetching products', error);
    } finally {
      setProductsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <CustomText variant="h6" style={styles.heading}>
        Top products in this category
      </CustomText>
      <FlashList
        data={products.slice(0, 6)}
        renderItem={({ item, index }) => (
          <ProductItem index={index} item={item} />
        )}
        keyExtractor={item => item?._id}
        style={{ flex: 1 }}
        numColumns={2}
      />
    </View>
  );
};

export default CategoryProducts;

const styles = StyleSheet.create({
  flexRowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  container: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    margin: 10,
  },
  heading: {
    color: Colors.text,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
});

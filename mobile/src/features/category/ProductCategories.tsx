import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors } from '@utils/Constants';
import Sidebar from './Sidebar';
import {
  getAllCategories,
  getProductsByCategoryId,
} from '../../services/productServices';
import ProductList from './ProductList';
import axios from 'axios';
import withCart from '@features/cart/WithCart';

const ProductCategories = () => {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getAllCategories();
        // console.log('cats data', data);
        setCategories(data.categories);
        if (data && data?.categories?.length > 0) {
          setSelectedCategory(data.categories[0]);
        }
      } catch (error) {
        console.log('error while fetching categories', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await getProductsByCategoryId(selectedCategory?._id);
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

  // console.log('cats', selectedCategory);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={selectedCategory?.name} search={true} />
      <View style={styles.subContainer}>
        {categoriesLoading ? (
          <ActivityIndicator size={'small'} color={Colors.border} />
        ) : (
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryPress={(category: any) => setSelectedCategory(category)}
          />
        )}
        {productsLoading ? (
          <ActivityIndicator
            size={'large'}
            color={Colors.border}
            style={styles.center}
          />
        ) : (
          <ProductList products={products || []} />
        )}
      </View>
    </View>
  );
};

export default withCart(ProductCategories);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

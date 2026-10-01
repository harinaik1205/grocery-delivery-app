import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  // Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { Suspense, useEffect, useState } from 'react';
import { getProductDetails } from '@services/productServices';
import { Colors } from '@utils/Constants';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { screenHeight, screenWidth } from '@utils/Scaling';
import CustomText from '@components/ui/CustomText';
import UniversalAdd from '@components/ui/UniversalAdd';
const CategoryProducts = React.lazy(() => import('./CategoryProducts'));

import Share from 'react-native-share';
import { downloadImage, urlToBase64Fetch } from '@utils/utility';

interface ProductType {
  _id: string;
  name: string;
  image: string;
  price: number;
  discountPrice: number;
  quantity: string;
  category: {
    _id: string;
    name: string;
    image: string;
  };
}

const ProductDetails = ({ route }: any) => {
  const productId = route?.params?.productId;
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState<ProductType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductById();
  }, [productId]);

  const fetchProductById = async () => {
    setLoading(true);
    try {
      const response = await getProductDetails(productId);
      console.log(response);
      if (response?.success == false) {
        setError(response?.message);
      }
      setProduct(response?.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onShare = async () => {
    // Alert.alert('share clicked');
    const base64Url = await urlToBase64Fetch(product?.image!);
    try {
      const { path, mime } = await downloadImage(
        product?.image!,
        product?._id!,
      );
      await Share.open({
        title: product?.name,
        message: `Check out this product on LocalMart - ${product?.name}\nhttps://grocery-delivery-app-deeplinking.vercel.app/product/${product?._id}\n`,
        url: Platform.OS === 'android' ? `file://${path}` : path,
        type: mime,
      });
    } catch (error) {
      Alert.alert(JSON.stringify(error));
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={Colors.secondary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}>
      <StatusBar barStyle="dark-content" />

      {/* content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: product?.image }} style={styles.img} />
          {/* header */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <View style={styles.iconContainer}>
              <Feather name="chevron-left" size={20} />
            </View>
            <View style={styles.headerRight}>
              <View style={styles.iconContainer}>
                <Feather name="heart" size={20} />
              </View>
              <TouchableOpacity onPress={onShare} style={styles.iconContainer}>
                <Feather name="share" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ padding: 10 }}>
          <View style={styles.content}>
            <CustomText variant="h5" style={styles.productName}>
              {product?.name}
            </CustomText>
            <CustomText variant="h8" style={styles.quantity}>
              {product?.quantity}
            </CustomText>
            <View style={styles.flexRowGap}>
              <CustomText fonSize={16} style={styles.price}>
                ₹{product?.price}
              </CustomText>
              <CustomText variant="h8" style={styles.discountPrice}>
                MRP{' '}
                <Text style={{ textDecorationLine: 'line-through' }}>
                  ₹{product?.discountPrice}
                </Text>
              </CustomText>
            </View>
            <View style={styles.category}>
              <View style={styles.flexRowGap}>
                <View style={styles.categoryImgContainer}>
                  <Image
                    source={{ uri: product?.category?.image }}
                    style={styles.categoryImg}
                  />
                </View>
                <View>
                  <CustomText variant="h8" style={styles.categoryName}>
                    {product?.category?.name}
                  </CustomText>
                  <CustomText variant="h8" style={styles.explore}>
                    Explore all products
                  </CustomText>
                </View>
              </View>
              <Feather name="chevron-right" size={20} />
            </View>
          </View>
        </View>

        {/* Top products in this category */}
        <Suspense
          fallback={
            <ActivityIndicator size={'large'} color={Colors.secondary} />
          }
        >
          {/* seperate component for top products in this category can be added here, which will be lazy loaded. This will improve the performance of the ProductDetails screen by loading this section only when needed. */}
          <CategoryProducts categoryId={product?.category?._id} />
        </Suspense>
      </ScrollView>

      {/* action button */}
      <View
        style={[
          styles.actionBtnContainer,
          {
            paddingBottom: insets.bottom,
            paddingLeft: insets.left + 10,
            paddingRight: insets.right + 10,
          },
        ]}
      >
        <View>
          <CustomText
            variant="h8"
            style={[styles.quantity, { paddingBottom: 0 }]}
          >
            {product?.quantity}
          </CustomText>
          <View style={styles.flexRowGap}>
            <CustomText fonSize={12} style={styles.price}>
              ₹{product?.price}
            </CustomText>
            <CustomText variant="h9" style={styles.discountPrice}>
              MRP{' '}
              <Text style={{ textDecorationLine: 'line-through' }}>
                ₹{product?.discountPrice}
              </Text>
            </CustomText>
          </View>
          <CustomText variant="h8" style={styles.quantity}>
            Inclusive of all taxes
          </CustomText>
        </View>
        <UniversalAdd item={product} title="ADD TO CART" variant="primary" />
      </View>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  addToCartBtn: {
    width: 150,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionBtnContainer: {
    // height: 70,
    width: screenWidth,
    // borderTopWidth: 1,
    // borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: Colors.text,
    elevation: 10,
  },
  explore: {
    color: Colors.text,
    opacity: 0.8,
  },
  categoryImgContainer: {
    width: 40,
    height: 40,
    borderRadius: 5,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  category: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    color: Colors.text,
    fontWeight: '700',
  },
  about: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.disabled,
    fontWeight: 'semibold',
  },
  content: {
    backgroundColor: '#fff',
    // borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.border,
    padding: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowColor: Colors.border,
    elevation: 10,
  },
  productName: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  quantity: {
    fontWeight: 'semibold',
    paddingBottom: 10,
    opacity: 0.8,
  },
  price: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  discountPrice: {
    color: Colors.disabled,
    // textDecorationLine: 'line-through',
  },

  flexRowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    // height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    // backgroundColor: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: Colors.border,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowColor: Colors.text,
    elevation: 2,
  },
  imgContainer: {
    width: screenWidth,
    height: screenHeight * 0.6,
    // alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

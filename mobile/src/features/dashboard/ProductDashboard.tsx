import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NoticeHeight, screenHeight } from '@utils/Scaling';

import {
  CollapsibleContainer,
  CollapsibleScrollView,
  useCollapsibleContext,
  CollapsibleHeaderContainer,
  withCollapsibleContext,
} from '@r0b0t3d/react-native-collapsible';
import { useAuthStore } from '@state/authStore';
import Geolocation from '@react-native-community/geolocation';
import { reverseGeocode } from '../../services/mapServices';
import NoticeAnimation from './NoticeAnimation';
import Visuals from '@components/dashboard/Visuals';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AnimatedReanimated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import AnimatedHeader from '@components/dashboard/AnimatedHeader';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import StickySearchBar from '@components/dashboard/StickySearchBar';
import Content from '@components/dashboard/Content';

const NOTICE_HEIGHT = -(NoticeHeight + 12);

const ProductDashboard = () => {
  const { setUser, user } = useAuthStore();
  const noticePosition = useRef(new Animated.Value(NOTICE_HEIGHT)).current;
  const { scrollY, expand } = useCollapsibleContext();
  const insets = useSafeAreaInsets();
  const previousScroll = useRef<number>(0);

  const backToTopStyle = useAnimatedStyle(() => {
    const isScrollingUp =
      scrollY.value < previousScroll.current && scrollY.value > 180;
    const opacity = withTiming(isScrollingUp ? 1 : 0, { duration: 300 });
    const translateY = withTiming(isScrollingUp ? 0 : 10, { duration: 300 });

    previousScroll.current = scrollY.value;

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const slideUp = () => {
    Animated.timing(noticePosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(noticePosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    const updateUser = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude, setUser);
        },
        err => console.error(err),
        {
          enableHighAccuracy: true,
          timeout: 15000,
        },
      );
    };

    updateUser();
  }, []);

  useEffect(() => {
    slideDown();
    const timeoutId = setTimeout(() => {
      slideUp();
    }, 3500);
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <NoticeAnimation noticePosition={noticePosition}>
      <>
        <Visuals />
        {/* <SafeAreaView /> */}

        <AnimatedReanimated.View
          style={[styles.backToTopButton, backToTopStyle]}
        >
          <TouchableOpacity
            onPress={() => {
              scrollY.value = 0;
              expand();
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <IonIcon
              name="arrow-up-circle-outline"
              color={'white'}
              size={RFValue(12)}
            />
            <CustomText
              variant="h9"
              style={{ color: 'white' }}
              fontFamily={Fonts.SemiBold}
            >
              Back to top
            </CustomText>
          </TouchableOpacity>
        </AnimatedReanimated.View>

        <CollapsibleContainer
          style={[styles.panelContainer, { marginTop: insets.top }]}
        >
          <CollapsibleHeaderContainer containerStyle={[styles.transparent]}>
            <AnimatedHeader
              showNotice={() => {
                slideDown();
                const timeoutId = setTimeout(() => {
                  slideUp();
                }, 3500);
                return () => clearTimeout(timeoutId);
              }}
            />
            <StickySearchBar />
          </CollapsibleHeaderContainer>

          <CollapsibleScrollView
            nestedScrollEnabled
            style={styles.panelContainer}
            showsVerticalScrollIndicator={false}
          >
            <Content />
            <View
              style={{
                backgroundColor: '#f8f8f8',
              }}
            >
              <CustomText
                fonSize={RFValue(32)}
                fontFamily={Fonts.Bold}
                style={{ opacity: 0.2 }}
              >
                Grocery Delivery App 🛒
              </CustomText>
              <CustomText
                fontFamily={Fonts.Bold}
                style={{ marginTop: 10, paddingBottom: 100, opacity: 0.2 }}
              >
                Developed by 💖 Hari Naik
              </CustomText>
            </View>
          </CollapsibleScrollView>
        </CollapsibleContainer>
      </>
    </NoticeAnimation>
  );
};

export default withCollapsibleContext(ProductDashboard);

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
    // backgroundColor: 'red',
  },
  backToTopButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? screenHeight * 0.18 : 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 999,
  },
});

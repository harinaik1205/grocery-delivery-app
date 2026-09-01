import { Image, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { screenHeight, screenWidth } from '@utils/Scaling';

import { Carousel, Pagination } from 'react-native-reanimated-carousel';
import ScalePress from './ScalePress';
import { useSharedValue } from 'react-native-reanimated';
import { CarouselRef } from 'react-native-reanimated-carousel';

interface AdCarouselProps {
  adData: any[];
}

const AdCarousel: FC<AdCarouselProps> = ({ adData }) => {
  const baseOptions = {
    vertical: false,
    width: screenWidth,
    height: screenHeight * 0.5,
  };

  const ref = React.useRef<CarouselRef>(null);
  const progress = useSharedValue<number>(0);

  return (
    <View style={{ marginVertical: 20 }}>
      <Carousel
        ref={ref}
        style={{
          width: screenWidth,
          height: screenHeight * 0.3,
        }}
        loop={true}
        autoplay
        autoplayInterval={3000}
        autoplayDirection="forward"
        layout={{
          type: 'parallax',
          scale: 0.9,
          offset: 50,
        }}
        progress={progress}
        data={adData}
        renderItem={({ item }: any) => {
          return (
            <ScalePress style={styles.imageContainer}>
              <Image source={item} style={styles.img} />
            </ScalePress>
          );
        }}
      />

      <Pagination
        count={adData?.length}
        progress={progress}
        containerStyle={{ gap: 8, justifyContent: 'center', marginTop: 12 }}
        dotStyle={{ width: 8, height: 8, backgroundColor: '#CBD5E1' }}
        activeDotStyle={{ width: 20, backgroundColor: '#0F172A' }}
        onPress={index => ref.current?.scrollTo({ index })}
        getItemAccessibilityLabel={(index, count) =>
          `Featured item ${index + 1} of ${count}`
        }
      />
    </View>
  );
};

export default AdCarousel;

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
});

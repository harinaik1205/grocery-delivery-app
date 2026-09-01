import { StyleSheet, Text, View, Animated } from 'react-native';
import React, { FC } from 'react';
import { NoticeHeight } from '@utils/Scaling';
import Notice from '@components/dashboard/Notice';

const NOTICE_HEIGHT = -(NoticeHeight + 12);

interface NoticeAnimationProps {
  noticePosition: any;
  children: React.ReactElement;
}
const NoticeAnimation: FC<NoticeAnimationProps> = ({
  noticePosition,
  children,
}) => {
  // const contentTranslateY = noticePosition.interpolate({
  //   inputRange: [-NOTICE_HEIGHT, 0],
  //   outputRange: [0, NOTICE_HEIGHT + 20],
  //   extrapolate: 'clamp',
  // });
  return (
    <View style={styles.contianer}>
      <Animated.View
        style={[
          styles.noticeContainer,
          { transform: [{ translateY: noticePosition }] },
        ]}
      >
        <Notice />
      </Animated.View>
      <Animated.View
        style={[
          styles.contentContainer,
          // {
          //   transform: [{ translateY: contentTranslateY }],
          // },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default NoticeAnimation;

const styles = StyleSheet.create({
  noticeContainer: {
    width: '100%',
    zIndex: 999,
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  contianer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

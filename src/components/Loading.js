import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const Loading = () => {
  const dotCount = 3;
  const animations = useRef(Array(dotCount).fill().map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = animations.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.stagger(100, loops).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dotWrapper}>
        {animations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: anim,
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.7, 1.5],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffaa', // bunu #ffffffaa gibi yarı saydam da yapabilirsin
    zIndex: 9999,
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4eb5',
    marginHorizontal: 6,
  },
});

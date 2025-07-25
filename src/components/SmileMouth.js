import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SmileMouth = () => {
  const animation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Yaklaşık path uzunluğu (deneme-yanılmayla bulunur veya tahmini verilir)
  const pathLength = 300;

  const strokeDashoffset = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, pathLength],
  });

  return (
    <View style={styles.container}>
      <Svg height="60" width="160" viewBox="0 0 160 60">
        <Defs>
          <LinearGradient id="smileGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#ffa500" />
            <Stop offset="25%" stopColor="#ff4eb5" />
            <Stop offset="50%" stopColor="#a64dff" />
            <Stop offset="75%" stopColor="#00c2ff" />
            <Stop offset="100%" stopColor="#3ab44a" />
          </LinearGradient>
        </Defs>
        <AnimatedPath
          d="M30,0 C50,55 110,55 130,0"
          stroke="url(#smileGradient)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SmileMouth;

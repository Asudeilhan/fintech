import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {GradientHeader, SmileMouth} from '../components';

const { width, height } = Dimensions.get('window');

const keywords = ['SU', 'DOĞALGAZ', 'ELEKTRİK', 'İNTERNET', 'TELEFON'];

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderBackgroundWords = () => {
    const gapX = 100;
    const gapY = 80;
    const words = [];

    const cols = Math.floor(width / gapX);
    const rows = Math.floor(height / gapY);

    let wordIndex = 0;

    // Faturam yazısının bulunduğu merkezi bölgeyi boş bırakmak için
    const centerX = width / 2;
    const centerY = height / 2;
    const safeZoneWidth = 220;
    const safeZoneHeight = 130;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gapX + 10;
        const y = row * gapY + 10;

        const isInSafeZone =
          x > centerX - safeZoneWidth / 2 &&
          x < centerX + safeZoneWidth / 2 &&
          y > centerY - safeZoneHeight / 2 &&
          y < centerY + safeZoneHeight / 2;

        if (isInSafeZone) continue;

        const word = keywords[wordIndex % keywords.length];
        wordIndex++;

        words.push(
          <Text
            key={`word-${row}-${col}`}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontSize: 14,
              color: 'rgba(0, 0, 0, 0.05)',
              fontWeight: 'bold',
              letterSpacing: 1,
            }}
          >
            {word}
          </Text>
        );
      }
    }

    return words;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      {renderBackgroundWords()}

      <View style={styles.textWrapper}>
        <GradientHeader />
        <SmileMouth />
        <Text style={styles.subtitle}>Faturanı Öde, Kazan!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  textWrapper: {
    alignItems: 'center',
    zIndex: 10,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default SplashScreen;

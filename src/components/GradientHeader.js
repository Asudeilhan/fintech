import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants'; // doğru path'e göre ayarla (örneğin ../../constants olabilir)

const GradientHeader = () => (
  <MaskedView maskElement={<Text style={styles.text}>F A T U R A M</Text>}>
    <LinearGradient
      colors={Colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[styles.text, { opacity: 0 }]}>F A T U R A M</Text>
    </LinearGradient>
  </MaskedView>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary, // sadece mask için
    textAlign: 'center',
  },
});

export default GradientHeader;

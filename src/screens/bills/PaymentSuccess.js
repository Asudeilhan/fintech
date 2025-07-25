import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Circle, Path, G } from 'react-native-svg';

const billColors = {
  Elektrik: '#a64dff',
  Doğalgaz: '#ffa500',
  İnternet: '#ff4eb5',
  Su: '#00c2ff',
  Mobil: '#3ab44a',
};

const PaymentSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billType } = route.params || {};

  const buttonColor = billColors[billType] || '#3ab44a';

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'BillTypeSelect' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Svg width={140} height={140} viewBox="0 0 140 140">
          {/* Konfeti SVG'leri */}
          <G>
            <Circle cx="15" cy="20" r="4" fill="#ff0055" />
            <Circle cx="125" cy="25" r="4" fill="#4b22ff" />
            <Circle cx="100" cy="10" r="3" fill="#00c2ff" />
            <Circle cx="25" cy="120" r="5" fill="#6c5ce7" />
            <Circle cx="120" cy="110" r="4" fill="#00b894" />
            <Circle cx="20" cy="90" r="4" fill="#e84393" />
            <Path d="M130 40 A10 10 0 0 1 140 50" stroke="#6c5ce7" strokeWidth="2" />
            <Path d="M10 100 A10 10 0 0 1 20 110" stroke="#00c2ff" strokeWidth="2" />
          </G>

          {/* Yeşil daire */}
          <Circle cx="70" cy="70" r="45" fill="#27ae60" />

          {/* Tik işareti */}
          <Path
            d="M50 70 L62 82 L90 54"
            stroke="#fff"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      <Text style={styles.successHeader}>Teşekkürler!</Text>
      <Text style={styles.successSub}>Ödeme Başarılı</Text>

      <TouchableOpacity
        style={[styles.doneButton, { backgroundColor: buttonColor }]}
        onPress={handleDone}
      >
        <Text style={styles.doneButtonText}>Tamamlandı</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconWrapper: {
    marginBottom: 30,
  },
  successHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  successSub: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  doneButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

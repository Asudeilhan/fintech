import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const paymentOptions = [
  { icon: 'flame-outline', color: '#f59324' }, //dogalgaz
  { icon: 'wifi-outline', color: '#e81f89' },  //internet
  { icon: 'flash-outline', color: '#6610f2' }, //elektrik
  { icon: 'water-outline', color: '#02aeef' }, //su
  { icon: 'call-outline', color: '#3ab44a' },  //telefon
  
];

const LogoIconBar = ({ size = 42, spacing = 14 }) => {
  return (
    <View style={[styles.container, { gap: spacing }]}>
      {paymentOptions.map((item, index) => (
        <Ionicons
          key={index}
          name={item.icon}
          size={size}
          color={item.color}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
});

export default LogoIconBar;

// components/WelcomeHeader.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WelcomeHeader = ({ title, subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default WelcomeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 2,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e81f89',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: 'black',
    marginTop: 2,
    textAlign: 'left',
  },
});

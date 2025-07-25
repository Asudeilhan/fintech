import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomLink = ({ text, buttonText, onPress }) => {
  return (
    <View style={styles.linkContainer}>
      <Text style={styles.linkText}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.linkButton}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomLink

const styles = StyleSheet.create({
    linkContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
      },
      linkText: {
        fontSize: 16,
      },
      linkButton: {
        color: '#02aeef',
        fontSize: 16,
        fontWeight: 'bold',
      },
})
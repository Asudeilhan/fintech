import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const CustomTextMessage = ({ message, type, onDismiss }) => {
  if (!message) return null;

  const messageStyle = type === 'error' ? styles.errorText : styles.infoText;

  return (
    <Pressable onPress={onDismiss}>
      <View style={styles.container}>
        <Text style={[styles.message, messageStyle]}>{message}</Text>
      </View>
    </Pressable>
  );
};

export default CustomTextMessage;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  message: {
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
  },
});

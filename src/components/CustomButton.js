import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title, style, textStyle,}) => {
  return (
    <TouchableOpacity
      onPress={onPress} 
      style={[styles.button, style]} // dışarıdan gelen stil ile birleştirildi
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text> 
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e81f89',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

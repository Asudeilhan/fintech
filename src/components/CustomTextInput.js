import { StyleSheet, View, TextInput } from 'react-native';
import React, { useState } from 'react';

const CustomTextInput = ({
  isSecureText = false,
  handleOnChange,
  handleValue,
  handlePlaceholder,
  handleKeyboardType,
  leftComponent,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { borderColor: isFocused ? '#e81f89' : '#ccc' }]}>
        {leftComponent && <View style={styles.leftComponent}>{leftComponent}</View>}
        <TextInput
          secureTextEntry={isSecureText}
          placeholder={handlePlaceholder}
          placeholderTextColor="#D3D3D3"
          keyboardType={handleKeyboardType}
          onChangeText={handleOnChange}
          value={handleValue}
          style={styles.TextInputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    marginVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fefefe', // 🔄 Daha açık renk
    paddingLeft: 10,
    fontWeight: 'bold',
    borderWidth: 1,
  },
  leftComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  TextInputStyle: {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
    fontSize: 16,
  },
});

export default CustomTextInput;

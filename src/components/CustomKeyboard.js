import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const CustomKeyboard = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboard;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingBottom: 80,  // Alt boşluk ekleyerek bileşenlerin görünmesini sağlar
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',  // İçeriği yukarı hizalar
  },
});

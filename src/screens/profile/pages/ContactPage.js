import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import CustomButton from '../../../components/CustomButton';

const ContactPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!email || !message) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      await addDoc(collection(db, 'contacts'), {
        email,
        message,
        isRead: false, // 🔥 Bu alan gerekli
        createdAt: serverTimestamp(),
      });

      Alert.alert('Başarılı', 'Mesajınız iletildi.');
      setEmail('');
      setMessage('');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Bize Ulaşın</Text>

        <TextInput
          style={styles.input}
          placeholder="E-posta adresiniz"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mesajınız..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />

        <CustomButton
          title="Gönder"
          onPress={handleSubmit}
          style={styles.buttonStyle}
          textStyle={styles.buttonText}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactPage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#000',
    width: '100%',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonStyle: {
    backgroundColor: '#3ab44a',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

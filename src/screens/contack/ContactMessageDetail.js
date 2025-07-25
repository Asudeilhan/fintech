import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ContactMessageDetail = () => {
  const { params } = useRoute();
  const { message } = params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gönderen:</Text>
      <Text style={styles.value}>{message.email}</Text>

      <Text style={styles.label}>Mesaj:</Text>
      <Text style={styles.value}>{message.message}</Text>

      <Text style={styles.label}>Tarih:</Text>
      <Text style={styles.value}>
        {message.createdAt?.toDate().toLocaleString()}
      </Text>
    </View>
  );
};

export default ContactMessageDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1, // tüm ekranı kaplasın
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: '#000',
  },
});

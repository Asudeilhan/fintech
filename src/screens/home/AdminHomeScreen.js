import { StyleSheet, View, Text, Alert } from 'react-native';
import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import cardData from '../../../card_data_50_users.json';
import CustomButton from '../../components/CustomButton';

const AdminHomeScreen = () => {
  const uploadCardsToFirestore = async () => {
    try {
      for (const card of cardData) {
        await addDoc(collection(db, 'cards'), {
          ...card,
          isUsed: false, // 🔑 kartın kullanım durumu
        });
      }
      Alert.alert('Başarılı', 'Kartlar Firestore\'a yüklendi.');
    } catch (error) {
      console.error('Kart yükleme hatası:', error);
      Alert.alert('Hata', 'Kartlar yüklenirken bir sorun oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomButton
        title="Kartları Yükle"
        onPress={uploadCardsToFirestore}
        style={{ backgroundColor: '#ff4eb5' }}
        textStyle={{ color: '#fff' }}
      />
    </View>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

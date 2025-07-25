import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

const AccountVerifyPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(docRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kişisel Bilgiler</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Ad Soyad</Text>
        <Text style={styles.value}>
          {userData?.firstName} {userData?.lastName}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Telefon Numarası</Text>
        <Text style={styles.value}>
          {userData?.phoneNumber || 'Belirtilmemiş'}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>E-posta Adresi</Text>
        <Text style={styles.value}>
          {userData?.email || 'Belirtilmemiş'}
        </Text>
      </View>
    </View>
  );
};

export default AccountVerifyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  infoBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#000',
  },
});

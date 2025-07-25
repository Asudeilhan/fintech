import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { GradientHeader } from '../../components';

const ProfileHomePage = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

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
      {/* Profil ikonu ve isim */}
      <View style={styles.profilePicContainer}>
        <TouchableOpacity
          style={styles.profileIconWrapper}
          onPress={() => navigation.navigate('AccountVerifyPage')}
        >
          <Icon name="person-outline" size={32} color="#000" />
        </TouchableOpacity>

        <View style={styles.nameEditContainer}>
          <Text style={styles.nameText}>
            {userData?.firstName} {userData?.lastName}
          </Text>
          <TouchableOpacity
            style={styles.editIconInline}
            onPress={() => navigation.navigate('AccountVerifyPage')}
          >
            <Icon name="create-outline" size={18} color="#3ab44a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menü seçenekleri */}
      <View style={styles.boxSection}>
        <View style={styles.boxThin}>
          <Option title="Ayarlar" icon="settings-outline" onPress={() => navigation.navigate('SettingsPage')} />
        </View>
        <View style={styles.boxThin}>
          <Option title="Sıkça Sorulan Sorular" icon="help-circle-outline" onPress={() => navigation.navigate('FAQPage')} />
        </View>
        <View style={styles.boxThin}>
          <Option title="Sözleşmeler" icon="document-text-outline" onPress={() => navigation.navigate('ContractsPage')} />
        </View>
        <View style={styles.boxThin}>
          <Option title="Bize Ulaşın" icon="call-outline" onPress={() => navigation.navigate('ContactPage')} />
        </View>
      </View>

      {/* Alt metin */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Tüm hakları saklıdır. 2025</Text>
        <Text style={styles.version}>Versiyon 1.11.1</Text>
      </View>

      {/* GradientHeader en altta sola hizalı */}
      <View style={styles.bottomGradient}>
        <GradientHeader />
      </View>
    </View>
  );
};

const Option = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={styles.optionLeft}>
      <Icon name={icon} size={20} color="#3ab44a" />
      <Text style={styles.optionText}>{title}</Text>
    </View>
    <Icon name="chevron-forward-outline" size={18} color="#3ab44a" />
  </TouchableOpacity>
);

export default ProfileHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'flex-start',
  },
  profilePicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 16,
  },
  profileIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editIconInline: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    elevation: 2,
  },
  boxSection: {
    gap: 12,
  },
  boxThin: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
  footerRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  bottomGradient: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/userSlice';


const SettingsPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };


  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              if (user) {
                await deleteUser(user);
                dispatch(logout());
              }
            } catch (error) {
              Alert.alert('Hata', error.message);
            }
          },
        },
      ]
    );
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    Alert.alert('Dil Değişti', lang === 'tr' ? 'Türkçe seçildi' : 'English selected');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>

      <TouchableOpacity style={styles.box} onPress={handleLogout}>
        <View style={styles.row}>
          <Icon name="log-out-outline" size={20} color="#3ab44a" style={styles.iconLeft} />
          <Text style={styles.optionText}>Çıkış Yap</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={handleDeleteAccount}>
        <View style={styles.row}>
          <Icon name="trash-outline" size={20} color="#3ab44a" style={styles.iconLeft} />
          <Text style={styles.optionText}>Hesabımı Sil</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.box}>
        <View style={styles.row}>
          <Icon name="earth-outline" size={20} color="#3ab44a" style={styles.iconLeft} />
          <Text style={styles.optionText}>Dil Seçenekleri</Text>
        </View>

        <View style={styles.languageRow}>
          <TouchableOpacity
            style={[
              styles.languageBtn,
              selectedLanguage === 'tr' && styles.languageBtnSelected,
            ]}
            onPress={() => handleLanguageChange('tr')}
          >
            <Text style={[styles.languageText, selectedLanguage !== 'tr' && styles.languageTextUnselected]}>
              Türkçe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageBtn,
              selectedLanguage === 'en' && styles.languageBtnSelected,
            ]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text style={[styles.languageText, selectedLanguage !== 'en' && styles.languageTextUnselected]}>
              English
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  box: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
  },
  languageBtn: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  languageBtnSelected: {
    backgroundColor: '#3ab44a',
  },
  languageText: {
    fontSize: 14,
    color: '#fff',
  },
  languageTextUnselected: {
    color: '#333',
  },
});

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore'; //
import { getAuth } from 'firebase/auth';
import { db } from '../../../firebaseConfig';
import StepIndicator from '../../components/StepIndicator';
import Icon from 'react-native-vector-icons/Ionicons';

const billColors = {
  Elektrik: '#a64dff',
  Doğalgaz: '#ffa500',
  İnternet: '#ff4eb5',
  Su: '#00c2ff',
  Mobil: '#3ab44a',
};

const inputLabels = {
  Elektrik: 'Tesisat Numarası',
  Doğalgaz: 'Tesisat Numarası',
  İnternet: 'Abone Numarası',
  Su: 'Abone Numarası',
  Mobil: 'Telefon Numarası',
};

const NumberEntry = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billType, institution } = route.params;

  const [inputValue, setInputValue] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const currentColor = billColors[billType] || '#00c2ff';

  useEffect(() => {
    const checkNotification = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const normalizedInput = inputValue.replace(/\D/g, '');
      const subRef = doc(db, 'users', user.uid, 'registeredSubscribers', normalizedInput);
      const subSnap = await getDoc(subRef);
      if (subSnap.exists() && subSnap.data().notified) {
        navigation.navigate('Registered');
      }
    };

    checkNotification();
  }, [inputValue]);

  const handleContinue = async () => {
    if (inputValue.trim() === '') {
      Alert.alert('Hata', 'Lütfen numarayı giriniz');
      return;
    }

    try {
      const normalizedInput = inputValue.replace(/\D/g, '');
      const billsRef = collection(db, 'bills');
      const q = query( //Bir koleksiyon üzerinde çok kriterli filtreleme sağlar.
        billsRef,
        where('billType', '==', billType),
        where('institution', '==', institution),
        where('billNumber', '==', normalizedInput),
        where('isPaid', '==', false)
      );

      const querySnapshot = await getDocs(q); //  Sorgunun sonucunu getirir

      if (!querySnapshot.empty) {
        const billData = querySnapshot.docs[0].data();

        if (isRegistered) {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const subRef = doc(db, 'users', user.uid, 'registeredSubscribers', normalizedInput);
            await setDoc(subRef, {
              billType,
              institution,
              billNumber: normalizedInput,
              createdAt: new Date(),
              notified: false,
            });
            Alert.alert('Başarılı', 'Kayıtlı abone olarak eklendi.');
          }
        }

        navigation.navigate('BillInfo', {
          billType,
          institution,
          amount: billData.amount,
          ownerName: billData.ownerName,
          dueDate: billData.dueDate,
          phoneNumber: billData.billNumber,
        });
      } else {
        if (isRegistered) {
          Alert.alert('Hata', 'Bu numara ile eşleşen fatura bulunamadı. Kayıtlı abone olarak eklenmedi.');
        } else {
          setModalVisible(true);
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Veri çekme hatası: ' + error.message);
    }
  };

  const handleInfoClick = () => {
    Alert.alert('Bilgi', 'Lütfen doğru tesisat, abone veya telefon numarasını giriniz.');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StepIndicator activeStep={1} billType={billType} />
        <Text style={styles.title}>Kurum ve Abone Bilgileri</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>{inputLabels[billType]}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={inputLabels[billType]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleInfoClick} style={styles.iconWrapper}>
              <Icon name="information-circle-outline" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Kayıtlı abone ekle</Text>
            <Switch
              value={isRegistered}
              onValueChange={setIsRegistered}
              thumbColor={isRegistered ? '#fff' : '#ccc'}
              trackColor={{
                false: `${currentColor}33`,
                true: currentColor,
              }}
            />
          </View>

          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: currentColor }]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>DEVAM</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Icon name="alert-circle-outline" size={50} color="#D50000" />
              <Text style={styles.modalText}>
                Girilen bilgilere ait kurum borcu bulunmamaktadır.
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: currentColor }]}
              >
                <Text style={styles.buttonText}>TAMAM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NumberEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#000',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  iconWrapper: {
    padding: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
  },
});

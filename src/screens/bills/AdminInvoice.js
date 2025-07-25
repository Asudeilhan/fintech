import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { CustomKeyboard } from '../../components';

LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
  today: 'Bugün',
};
LocaleConfig.defaultLocale = 'tr';

const inputLabels = {
  Elektrik: 'Tesisat Numarası',
  Doğalgaz: 'Tesisat Numarası',
  İnternet: 'Abone Numarası',
  Su: 'Abone Numarası',
  Mobil: 'Telefon Numarası',
};

const billColors = {
  Elektrik: '#a64dff',
  Doğalgaz: '#ffa500',
  İnternet: '#ff4eb5',
  Su: '#00c2ff',
  Mobil: '#3ab44a',
};

const formatPhoneNumber = (number) => {
  const digits = number.replace(/\D/g, '');
  let formatted = '';
  if (digits.length <= 3) {
    formatted = digits;
  } else if (digits.length <= 6) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else if (digits.length <= 8) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  }
  return formatted;
};

const AdminInvoice = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billType, institution } = route.params;

  const [inputValue, setInputValue] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const currentColor = billColors[billType] || '#46257e';

  const saveBillToFirestore = async () => {
    try {
      await addDoc(collection(db, 'bills'), {
        billType,
        institution,
        billNumber: inputValue.replace(/\D/g, ''),
        ownerName,
        amount: parseFloat(amount),
        dueDate,
        isPaid: false,
        createdAt: new Date().toISOString(),
      });
      setModalVisible(true);
    } catch (error) {
      alert('Fatura kaydedilemedi: ' + error.message);
    }
  };

  const handleContinue = () => {
    if (!inputValue || !ownerName || !amount || !dueDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    saveBillToFirestore();
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setInputValue('');
    setOwnerName('');
    setAmount('');
    setDueDate('');
  };

  return (
    <CustomKeyboard>
      <View style={styles.container}>
        <Text style={styles.stepTitle}>Fatura Bilgileri</Text>

        <TextInput
          style={styles.input}
          placeholder={inputLabels[billType]}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={(text) =>
            setInputValue(billType === 'Mobil' ? formatPhoneNumber(text) : text)
          }
        />
        <View style={styles.separator} />

        <TextInput
          style={styles.input}
          placeholder="Kullanıcı İsmi"
          value={ownerName}
          onChangeText={setOwnerName}
        />
        <View style={styles.separator} />

        <TextInput
          style={styles.input}
          placeholder="Fatura Tutarı"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.separator} />

        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={[styles.dateText, !dueDate && styles.placeholderText]}>
            {dueDate || 'Son Ödeme Tarihi'}
          </Text>
          <Icon name="calendar" size={24} color="#555" />
        </TouchableOpacity>
        <View style={styles.separator} />

        {showCalendar && (
          <View style={styles.calendarContainer}>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setDueDate('');
                  setShowCalendar(false);
                }}
              >
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.saveButtonText}>Tamam</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              minDate={new Date().toISOString().split('T')[0]}
              onDayPress={(day) => setDueDate(day.dateString)}
              markedDates={{ [dueDate]: { selected: true, selectedColor: currentColor } }}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: currentColor }]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>KAYDET</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Icon name="checkmark-circle" size={50} color="#4CAF50" />
              <Text style={styles.modalText}>Başarılı bir şekilde eklendi</Text>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: currentColor }]}
                onPress={handleModalClose}
              >
                <Text style={styles.modalButtonText}>TAMAM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </CustomKeyboard>
  );
};

export default AdminInvoice;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 5,
  },
  stepTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'left',
  },
  input: {
    borderWidth: 0,
    padding: 10,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  continueButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarContainer: {
    marginVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  clearButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#aaa',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#333',
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#555',
  },
  placeholderText: {
    color: '#aaa',
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
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import StepIndicator from '../../components/StepIndicator';

// Her fatura türüne göre renk eşleşmesi
const billColors = {
  Elektrik: '#a64dff',
  Doğalgaz: '#ffa500',
  İnternet: '#ff4eb5',
  Su: '#00c2ff',
  Mobil: '#3ab44a',
};

const maskName = (name) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    const firstName = nameParts[0].substring(0, 2);
    const lastName = nameParts[1].substring(0, 2);
    return `${firstName}*** ${lastName}***`;
  } else {
    const firstTwo = name.substring(0, 2);
    return `${firstTwo}***`;
  }
};

const BillInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billType, institution, amount, ownerName, dueDate, phoneNumber } = route.params;

  const handleContinue = () => {
    navigation.navigate('PaymentMaking', {
      billType,
      institution,
      amount,
      ownerName,
      dueDate,
      phoneNumber,
    });
  };

  const activeColor = billColors[billType] || '#00c2ff';

  return (
    <View style={styles.container}>
      <StepIndicator activeStep={2} billType={billType} />
      <Text style={styles.title}>Fatura Bilgileri</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>
          Kurum: <Text style={styles.value}>{institution}</Text>
        </Text>
        <View style={styles.separator} />
        <Text style={styles.label}>
          Fatura Tipi: <Text style={styles.value}>{billType}</Text>
        </Text>
        <View style={styles.separator} />
        <Text style={styles.label}>
          Tesisat No: <Text style={styles.value}>{phoneNumber}</Text>
        </Text>
        <View style={styles.separator} />
        <Text style={styles.label}>
          Müşteri Adı: <Text style={styles.value}>{maskName(ownerName)}</Text>
        </Text>
        <View style={styles.separator} />
        <Text style={styles.label}>
          Son Ödeme Tarihi: <Text style={styles.value}>{dueDate}</Text>
        </Text>
        <View style={styles.separator} />
        <Text style={styles.label}>
          Fatura Tutarı: <Text style={styles.value}>{amount} TL</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: activeColor }]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>DEVAM</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BillInfo;

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
    textAlign: 'left',
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    color: '#555',
    fontWeight: 'normal',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
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
});

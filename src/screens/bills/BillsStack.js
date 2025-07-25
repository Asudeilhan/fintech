import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import BillTypeSelect from './BillTypeSelect';
import InstitutionSelect from './InstitutionSelect';
import NumberEntry from './NumberEntry';
import BillInfo from './BillInfo';
import PaymentMaking from './PaymentMaking';
import PaymentSuccess from './/PaymentSuccess';
import AdminInvoice from './AdminInvoice';

const Stack = createNativeStackNavigator();

// 🔙 Geri butonu bileşeni
const CustomBackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>
);

const BillsStack = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="BillTypeSelect"
        component={BillTypeSelect}
        options={{
          title: 'Fatura Türü',
          headerLeft: () => null, // İlk ekranda geri butonu gösterilmez
        }}
      />

      <Stack.Screen
        name="InstitutionSelect"
        component={InstitutionSelect}
        options={({ navigation }) => ({
          title: 'Kurum Seçimi',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />

      {user?.role === 'admin' ? (
        <Stack.Screen
          name="AdminInvoice"
          component={AdminInvoice}
          options={({ navigation }) => ({
            title: 'Fatura Ekle',
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />
      ) : (
        <Stack.Screen
          name="NumberEntry"
          component={NumberEntry}
          options={({ navigation }) => ({
            title: 'Abone No Girişi',
            headerLeft: () => <CustomBackButton navigation={navigation} />,
          })}
        />
      )}

      <Stack.Screen
        name="BillInfo"
        component={BillInfo}
        options={({ navigation }) => ({
          title: 'Fatura Bilgileri',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="PaymentMaking"
        component={PaymentMaking}
        options={({ navigation }) => ({
          title: 'Fatura Ödeme',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        options={{
          title: 'Başarılı',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default BillsStack;

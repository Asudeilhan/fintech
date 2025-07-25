import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactMessagesPage from './ContactMessagesPage';
import ContactMessageDetail from './ContactMessageDetail';

import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 🔙 Özel geri butonu
const CustomBackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>
);

const Stack = createNativeStackNavigator();

const ContactMessagesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gelen Mesajlar"
        component={ContactMessagesPage}
        options={{ headerStyle: { backgroundColor: '#fff' }, headerTitleStyle: { color: '#000' } }}
      />
      <Stack.Screen
        name="Mesaj Detayı"
        component={ContactMessageDetail}
        options={({ navigation }) => ({
          title: 'Mesaj Detayı',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { color: '#000' },
        })}
      />
    </Stack.Navigator>
  );
};

export default ContactMessagesStack;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileHomePage from './ProfileHomePage';
import SettingsPage from './pages/SettingsPage';
import FAQPage from './pages/FAQPage';
import ContractsPage from './pages/ContractsPage';
import ContactPage from './pages/ContactPage';
import AccountVerifyPage from './pages/AccountVerifyPage';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

const CustomBackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
    <Ionicons name="arrow-back" size={24} />
  </TouchableOpacity>
);

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileHomePage} options={{ title: 'Profilim' }} />

      <Stack.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={({ navigation }) => ({
          title: 'Ayarlar',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="FAQPage"
        component={FAQPage}
        options={({ navigation }) => ({
          title: 'Sıkça Sorulan Sorular',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ContractsPage"
        component={ContractsPage}
        options={({ navigation }) => ({
          title: 'Sözleşmeler',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ContactPage"
        component={ContactPage}
        options={({ navigation }) => ({
          title: 'Bize Ulaşın',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AccountVerifyPage"
        component={AccountVerifyPage}
        options={({ navigation }) => ({
          title: 'Hesap Doğrulama',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

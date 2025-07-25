import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  LoginPage,
  SignupPage,
  WelcomePage,
  SplashScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

const CustomBackButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={{ marginLeft: 0 }}
  >
    <Ionicons name="arrow-back" size={24}/>
  </TouchableOpacity>
);

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      {/* Splash */}
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

      {/* Welcome */}
      <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />

      {/* Login */}
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '',

          // 🔥 Özel geri butonu
          headerLeft: () => <CustomBackButton navigation={navigation} />,

          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />

      {/* Signup */}
      <Stack.Screen
        name="Signup"
        component={SignupPage}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '',

          headerLeft: () => <CustomBackButton navigation={navigation} />,

          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

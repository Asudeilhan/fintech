// screens/expenses/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PieChartPage from './PieChartPage';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();


const ExpensesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PieChartPage"
        component={PieChartPage}
        options={({ navigation }) => ({
          title: 'Harcamalarım',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { color: '#000' },
        })}
      />
    </Stack.Navigator>
  );
};

export default ExpensesStack;

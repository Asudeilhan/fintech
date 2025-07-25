import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeStack from '../screens/home/HomeStack';
import ChartStack from '../screens/chart/ChartStack';
import ProfileStack from '../screens/profile/ProfileStack';
import BillsStack from '../screens/bills/BillsStack';
// Bildirimler stack'i artık sadece HomeStack içinde kullanılıyor
// import ContactMessagesStack from '../screens/contack/ContactMessagesStack';

const Tab = createBottomTabNavigator();

const UserStack = () => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (routeName === 'PaymentSuccess') {
      return { display: 'none' };
    }
    return styles.tabBar;
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const iconSize = 24;
        let icon;

        if (route.name === 'Home') {
          icon = focused => focused ? require('../../assets/bottom/home2.png') : require('../../assets/bottom/home1.png');
        } else if (route.name === 'Profile') {
          icon = focused => focused ? require('../../assets/bottom/user2.png') : require('../../assets/bottom/user1.png');
        } else if (route.name === 'ChartStack') {
          icon = focused => focused ? require('../../assets/bottom/purse2.png') : require('../../assets/bottom/purse1.png');
        } else if (route.name === 'BillsStack') {
          icon = focused => focused ? require('../../assets/bottom/bill2.png') : require('../../assets/bottom/bill1.png');
        }

        return {
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#e81f89',
          tabBarStyle: getTabBarStyle(route),
          tabBarLabel: ({ focused }) => {
            let label = '';
            switch (route.name) {
              case 'Home':
                label = 'Ana Sayfa';
                break;
              case 'BillsStack':
                label = 'Fatura Öde';
                break;
              case 'ChartStack':
                label = 'Harcamalarım';
                break;
              case 'Profile':
                label = 'Profilim';
                break;
            }

            return (
              <Text style={{
                fontSize: 10,
                color: focused ? '#e81f89' : '#aaa',
                textAlign: 'center',
                marginTop: 4
              }}>
                {label}
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            if (icon) {
              return (
                <View style={{ width: iconSize, height: iconSize, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={icon(focused)} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
                </View>
              );
            }
            return null;
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Ana Sayfa',
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="BillsStack"
        component={BillsStack}
        options={({ route }) => ({
          title: 'Fatura Öde',
          headerShown: false,
          tabBarStyle: getTabBarStyle(route),
        })}
      />

      {user?.role !== 'admin' && (
        <Tab.Screen
          name="ChartStack"
          component={ChartStack}
          options={{
            title: 'Harcamalar',
            headerShown: false,
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default UserStack;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

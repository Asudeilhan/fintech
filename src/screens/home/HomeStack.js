import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import GradientHeader from '../../components/GradientHeader';
import HomeScreen from './HomeScreen';
import AdminHomeScreen from './AdminHomeScreen';
import Alltransactions from './Alltransactions';
import ContactMessagesPage from '../contack/ContactMessagesPage';
import ContactMessageDetail from '../contack/ContactMessageDetail';

const Stack = createNativeStackNavigator();

const CustomBackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>
);

// 🔹 Başlık bileşeni: GradientHeader + profil + (admin için) bildirim ikonu
const HeaderWithProfile = ({ isAdmin }) => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let interval;

    const fetchUnreadMessages = async () => {
      try {
        const q = query(collection(db, 'contacts'), where('isRead', '==', false));
        const snapshot = await getDocs(q);
        setUnreadCount(snapshot.size);
      } catch (err) {
        console.log('Bildirim sorgusu hatası:', err);
      }
    };

    if (isAdmin) {
      fetchUnreadMessages();
      interval = setInterval(fetchUnreadMessages, 5000); // 5 saniyede bir güncelle
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAdmin]);

  return (
    <View style={styles.headerWrapper}>
      <GradientHeader />
      <View style={styles.rightIcons}>
        {isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ContactMessages')}
            style={styles.iconButton}
          >
            <Ionicons name="notifications-outline" size={22} color="#000" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.iconButton}
        >
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={20} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeStack = () => {
  const [initialScreen, setInitialScreen] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const role = docSnap.data().role;
          const admin = role === 'admin';
          setInitialScreen(admin ? 'AdminHomeScreen' : 'Home');
          setIsAdmin(admin);
        } else {
          setInitialScreen('Home');
        }
      }
    };

    fetchUserRole();
  }, []);

  if (!initialScreen) return null;

  return (
    <Stack.Navigator initialRouteName={initialScreen}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <HeaderWithProfile isAdmin={isAdmin} />,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="AdminHomeScreen"
        component={AdminHomeScreen}
        options={{
          headerTitle: () => <HeaderWithProfile isAdmin={isAdmin} />,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="Alltransactions"
        component={Alltransactions}
        options={({ navigation }) => ({
          title: 'Tüm Hareketler',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { color: '#000' },
        })}
      />
      <Stack.Screen
        name="ContactMessages"
        component={ContactMessagesPage}
        options={({ navigation }) => ({
          title: 'Gelen Mesajlar',
          headerLeft: () => <CustomBackButton navigation={navigation} />,
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { color: '#000' },
        })}
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

export default HomeStack;

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 10,
    paddingBottom: 6,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginLeft: 10,
    position: 'relative',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4eb5',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ContactMessagesPage = ({ setUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        isDeleted: false,
      }));
      setMessages(data);
      setFilteredMessages(data);

      const unreadCount = data.filter(item => item.isRead === false).length;
      if (typeof setUnreadCount === 'function') {
        setUnreadCount(unreadCount);
      }
    } catch (error) {
      console.log('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMessages();
    }, [])
  );

  const handlePress = async (item) => {
    if (!item.isRead) {
      try {
        const ref = doc(db, 'contacts', item.id);
        await updateDoc(ref, { isRead: true });

        setMessages(prev =>
          prev.map(m => (m.id === item.id ? { ...m, isRead: true } : m))
        );
        setFilteredMessages(prev =>
          prev.map(m => (m.id === item.id ? { ...m, isRead: true } : m))
        );

        const newUnread = messages.filter(m => m.id !== item.id && m.isRead === false).length;
        if (typeof setUnreadCount === 'function') {
          setUnreadCount(newUnread);
        }
      } catch (err) {
        console.log('Güncelleme hatası:', err);
      }
    }

    navigation.navigate('Mesaj Detayı', { message: item });
  };

  const renderItem = ({ item }) => {
    if (item.isDeleted) return null;

    return (
      <TouchableOpacity
        style={[styles.messageCard, !item.isRead && styles.unreadCard]}
        onPress={() => handlePress(item)}
      >
        <View style={styles.cardRow}>
          <Image
            source={require('../../../assets/images/megaphone.png')}
            style={styles.iconLeft}
          />
          <View style={styles.messageContent}>
            <Text style={styles.email}>{item.email}</Text>
            <Text numberOfLines={2} style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>{item.createdAt?.toDate().toLocaleString()}</Text>
          </View>
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.iconBtn}>
            <Ionicons name="chevron-forward" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.allButton}
        onPress={() => setFilteredMessages(messages)}
      >
        <Text style={styles.allButtonText}>Tümü</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredMessages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ContactMessagesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  allButton: {
    backgroundColor: '#ff4eb5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  allButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  unreadCard: {
    backgroundColor: '#ffdee8',
    borderColor: '#ff4eb5',
    borderWidth: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  email: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#000',
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  iconBtn: {
    marginLeft: 8,
  },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const Alltransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const q = query(
          collection(db, 'bills'),
          where('userId', '==', user.uid),
          where('isPaid', '==', true)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

        setTransactions(data);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <View style={styles.pageWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Son Hareketler</Text>

        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>Herhangi bir ödeme bulunamadı.</Text>
        ) : (
          transactions.map((item) => {
            const date = item.paidAt ? new Date(item.paidAt) : null;
            const formattedDate = date
              ? `${date.toLocaleDateString('tr-TR')} - ${date.toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : 'Tarih bilinmiyor';

            return (
              <View key={item.id} style={styles.card}>
                <View>
                  <Text style={styles.institution}>
                    {(item?.institution || 'Bilinmeyen Kurum')} - {(item?.billType || 'Bilinmeyen Tür')}
                  </Text>
                  <Text style={styles.date}>{formattedDate}</Text>
                </View>
                <Text style={styles.amount}>
                  - ₺{typeof item?.amount === 'number' ? item.amount.toFixed(2) : '0.00'}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default Alltransactions;

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'left',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  institution: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
  },
});

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import StepIndicator from "../../components/StepIndicator";

// Her fatura türüne göre renk eşlemesi
const billColors = {
  Elektrik: '#a64dff',
  Doğalgaz: '#ffa500',
  İnternet: '#ff4eb5',
  Su: '#00c2ff',
  Mobil: '#3ab44a',
};

const AccountSelectPage = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { billType, institution, amount, ownerName, dueDate, phoneNumber } = route.params;

  const activeColor = billColors[billType] || "#00c2ff";

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handlePayment = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (userData?.balance >= parseFloat(amount)) {
      const newBalance = userData.balance - parseFloat(amount);

      try {
        await updateDoc(doc(db, "users", user.uid), {
          balance: newBalance,
        });

        const billsRef = collection(db, "bills");
        const normalizedPhone = phoneNumber.replace(/\D/g, '');
        const q = query(
          billsRef,
          where("billType", "==", billType),
          where("institution", "==", institution),
          where("billNumber", "==", normalizedPhone)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const billDoc = snapshot.docs[0].ref;
          await updateDoc(billDoc, {
            isPaid: true,
            paidAt: new Date().toISOString(),
            userId: user.uid,
          });
        }

        navigation.replace("PaymentSuccess");
      } catch (error) {
        Alert.alert("Hata", "İşlem sırasında hata oluştu.");
        console.error(error);
      }
    } else {
      Alert.alert("Yetersiz Bakiye", "Hesabınızda yeterli bakiye bulunmamaktadır.");
    }
  };

  const getDistrict = (branch) => {
    if (!branch) return "Şube bilgisi yok";
    const parts = branch.split(" - ");
    return parts[1] || branch;
  };

  return (
    <View style={styles.container}>
      <StepIndicator activeStep={3} billType={billType} />

      <Text style={styles.title}>Ödeme Aracı Seçimi</Text>

      <View style={styles.cardContainer}>
        <Text style={styles.value}>{getDistrict(userData?.branch)}</Text>

        <Text style={styles.label}>Bakiye:</Text>
        <Text style={styles.balance}>₺ {userData?.balance?.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: activeColor }]}
        onPress={handlePayment}
      >
        <Text style={styles.payText}>Ödemeyi Tamamla</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountSelectPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 30,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  payButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

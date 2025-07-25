import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard"; // ✅ Doğru clipboard importu
import { CustomKeyboard } from "../../components";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const sliderImages = [
  require("../../../assets/images/advert2.png"),
  require("../../../assets/images/advert1.png"),
];

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [paidBills, setPaidBills] = useState([]);
  const navigation = useNavigation();
  const sliderRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }

          const q = query(
            collection(db, "bills"),
            where("userId", "==", user.uid),
            where("isPaid", "==", true)
          );
          const snapshot = await getDocs(q);
          const bills = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

          setPaidBills(bills);
        }
      };

      fetchData();
    }, [])
  );

  const formatIban = (iban) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  const copyIban = async () => {
    if (userData?.cardInfo?.iban) {
      await Clipboard.setStringAsync(userData.cardInfo.iban); // ✅ Doğru kullanım
      alert("IBAN numarası kopyalandı!");
    } else {
      alert("IBAN numarası bulunamadı!");
    }
  };

  const formatBranch = (branch) => {
    if (!branch) return "Şube bilgisi yok";
    const [city, district] = branch.split(" - ");
    return `${district}/${city} Şubesi`;
  };

  return (
    <CustomKeyboard>
      <View style={styles.container}>
        <LinearGradient colors={['#ffa500', '#ff4eb5']} style={styles.cardContainer}>
          <View style={styles.branchSection}>
            <Text style={styles.branchText}>{formatBranch(userData?.branch)}</Text>
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceText}>Bakiye:</Text>
            <Text style={styles.balanceAmount}>
              ₺ {userData?.balance?.toFixed(2) || "0.00"}
            </Text>
          </View>

          <View style={styles.ibanSection}>
            <Text style={styles.ibanNumber}>
              {userData?.cardInfo?.iban
                ? formatIban(userData.cardInfo.iban)
                : "IBAN yükleniyor..."}
            </Text>
            <TouchableOpacity onPress={copyIban} style={styles.copyButton}>
              <Icon name="copy-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={{ width: "100%" }}>
          {/* 🔹 Son Hareketler */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Son Hareketler</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Alltransactions")}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
              <Icon name="chevron-forward-outline" size={18} color="#000" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {paidBills.length === 0 ? (
            <Text style={{ color: "#888" }}>Henüz ödeme yapılmamış.</Text>
          ) : (
            paidBills.slice(0, 3).map((bill) => {
              const date = new Date(bill.paidAt);
              const day = date.getDate().toString().padStart(2, "0");
              const month = date.toLocaleDateString("tr-TR", { month: "short" }).toUpperCase();
              const time = date.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <View key={bill.id} style={styles.historyCard}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{day}</Text>
                    <Text style={styles.dateText}>{month}</Text>
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.billInstitution}>
                      {bill.institution} - {bill.billType}
                    </Text>
                  </View>
                  <Text style={styles.amount}>- ₺{bill.amount}</Text>
                </View>
              );
            })
          )}

          {/* 🔹 Slider */}
          <View style={styles.sliderContainer}>
            <ScrollView
              ref={sliderRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={320}
              decelerationRate="normal"
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {sliderImages.map((image, index) => (
                <TouchableOpacity key={index} activeOpacity={0.9} style={styles.sliderItemContainer}>
                  <View style={styles.imageWrapper}>
                    <Image source={image} style={styles.sliderImage} resizeMode="cover" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </CustomKeyboard>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  cardContainer: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowRadius: 15,
    elevation: 10,
  },
  branchSection: {
    marginBottom: 15,
  },
  branchText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 16,
    color: "#fff",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  ibanSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ibanNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  copyButton: {
    padding: 10,
  },
  viewAllText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  dateContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timeText: {
    fontSize: 14,
    color: "#777",
  },
  billInstitution: {
    fontSize: 16,
    color: "#333",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff0000",
  },
  sliderContainer: {
    width: "100%",
    height: 170,
    marginTop: 20,
    borderRadius: 16,
  },
  sliderItemContainer: {
    width: 300,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  sliderImage: {
    width: 300,
    height: 150,
  },
});

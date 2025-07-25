// Tüm component: PaymentPieChartPage.js
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const radius = 40;
const strokeWidth = 16;
const circumference = 2 * Math.PI * radius;

const chartColorMap = {
  Elektrik: "#a64dff",
  Su: "#00c2ff",
  Doğalgaz: "#ffa500",
  İnternet: "#ff4eb5",
  Mobil: "#3ab44a",
};

const chartIconMap = {
  Elektrik: "flash-outline",
  Su: "water-outline",
  Doğalgaz: "flame-outline",
  İnternet: "wifi-outline",
  Mobil: "call-outline",
};

const PieChartPage = () => {
  const [segments, setSegments] = useState([]);
  const [billList, setBillList] = useState([]);
  const [total, setTotal] = useState(0);
  const animatedValuesRef = useRef([]);

  const animateSegments = (newSegments) => {
    newSegments.forEach((segment, index) => {
      const animatedValue = new Animated.Value(circumference);
      animatedValuesRef.current[index] = animatedValue;

      Animated.timing(animatedValue, {
        toValue: circumference * (1 - segment.percent),
        duration: 1000,
        useNativeDriver: false,
      }).start();

      segment.animatedValue = animatedValue;
    });

    setSegments(newSegments);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "bills"),
          where("userId", "==", user.uid),
          where("isPaid", "==", true)
        );

        const snapshot = await getDocs(q);
        const bills = snapshot.docs.map((doc) => doc.data());

        const totals = {};
        bills.forEach((bill) => {
          const type = bill.billType;
          if (!totals[type]) totals[type] = 0;
          totals[type] += bill.amount;
        });

        const totalAmount = Object.values(totals).reduce((a, b) => a + b, 0);

        let startAngle = 0;
        const newSegments = Object.entries(totals).map(([type, amount]) => {
          const percent = amount / totalAmount;
          const segment = {
            type,
            color: chartColorMap[type] || "#999",
            rotation: startAngle,
            percent,
          };
          startAngle += 360 * percent;
          return segment;
        });

        const billTypeList = Object.entries(totals).map(([type, amount]) => ({
          type,
          amount,
          color: chartColorMap[type] || "#999",
        }));

        setTotal(totalAmount);
        setBillList(billTypeList);
        animateSegments(newSegments);
      };

      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={[styles.colorBox, { backgroundColor: item.color }]} />
      <Text style={styles.itemText}>{item.type}</Text>
      <Text style={styles.amountText}>₺ {item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg height="220" width="220" viewBox="0 0 100 100">
          <G rotation="-90" origin="50, 50">
            {segments.map((segment, i) => (
              <AnimatedCircle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={animatedValuesRef.current[i] || circumference}
                rotation={segment.rotation}
                origin="50, 50"
              />
            ))}
          </G>
        </Svg>

        {segments.map((segment, i) => {
          const angle = (segment.rotation + segment.percent * 360 / 2) * (Math.PI / 180);
          const iconX = 110 + 40 * Math.cos(angle);
          const iconY = 110 + 40 * Math.sin(angle);

          return (
            <Icon
              key={`icon-${i}`}
              name={chartIconMap[segment.type]}
              size={16}
              color="white"
              style={{ position: 'absolute', left: iconX, top: iconY }}
            />
          );
        })}

        <View style={styles.centerText}>
          <Text style={styles.centerLabel}>Toplam</Text>
          <Text style={styles.centerAmount}>₺ {total.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.label}>Toplam Harcama Grafiği</Text>

      <FlatList
        data={billList}
        renderItem={renderItem}
        keyExtractor={(item) => item.type}
        style={{ marginTop: 30, width: "90%" }}
        scrollEnabled={false}
      />
    </View>
  );
};

export default PieChartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  chartWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    fontSize: 14,
    color: "#444",
  },
  centerAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    color: "#444",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginVertical: 4,
    borderRadius: 8,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { CustomKeyboard } from "../../components";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const BillTypeSelect = () => {
  const navigation = useNavigation(); // React Navigation kullanarak navigasyonu sağlar.
  const { user } = useSelector((state) => state.user); // Redux'tan kullanıcı bilgilerini alır.
  const [searchText, setSearchText] = useState(''); // Arama metnini tutar.

  const paymentOptions = [
    { name: "Doğalgaz", icon: "flame-outline", color: "#ffa500" },
    { name: "İnternet", icon: "wifi-outline", color: "#ff4eb5" },
    { name: "Elektrik", icon: "flash-outline", color: "#a64dff" },
    { name: "Su", icon: "water-outline", color: "#00c2ff" },
    { name: "Mobil", icon: "call-outline", color: "#3ab44a" },
  ];

  const filteredOptions = paymentOptions.filter(option => // Kullanıcı arama metnini girdiğinde, seçenekleri filtreler.
    option.name.toLowerCase().includes(searchText.toLowerCase()) // Arama metni küçük harfe dönüştürülerek filtreleme yapılır.
  );

  const handleNavigation = (option) => { 
    //Kullanıcı bir fatura türüne tıklarsa, o seçeneği InstitutionSelect ekranına aktarır.
    try {
      navigation.navigate('InstitutionSelect', { billType: option.name });
    } catch (error) {
      console.error("Navigasyon hatası: ", error);
    }
  };

  return (
    <CustomKeyboard>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Fatura Türü Ara"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {filteredOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.paymentOption}
            onPress={() => handleNavigation(option)}
          >
            <Icon name={option.icon} size={30} color={option.color} />
            <Text style={styles.paymentText}>{option.name}</Text>
            <Icon name="chevron-forward-outline" size={25} color={option.color} />
          </TouchableOpacity>
        ))}
      </View>
    </CustomKeyboard>
  );
};

export default BillTypeSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: -20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  paymentText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#333",
    flex: 1,
  },
});

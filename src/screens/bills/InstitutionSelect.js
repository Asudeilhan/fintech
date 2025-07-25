import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { CustomKeyboard } from '../../components';

// Fatura türlerine özel renkler
const billColors = {
  Doğalgaz: "#ffa500",
  İnternet: "#ff4eb5",
  Elektrik: "#a64dff",
  Su: "#00c2ff",
  Mobil: "#3ab44a",
};

const institutionData = {
  Elektrik: [
    'BEDAŞ', 'AYEDAŞ', 'UEDAŞ', 'SEDAŞ', 'TREDAŞ', 'ÇEDAŞ', 'OEDAŞ', 'MEDAŞ',
    'FIRAT EDAŞ', 'ARAS EDAŞ', 'AKEDAŞ', 'AKDENİZ EDAŞ', 'DİCLE EDAŞ', 'VANGÖLÜ EDAŞ',
    'YEPAŞ', 'TOROSLAR EDAŞ', 'ADM Elektrik', 'KCETAŞ'
  ],
  Su: [
    'İSKİ', 'ASKİ', 'BUSKİ', 'SASKİ', 'İZSU', 'ESKİ', 'MASKİ (Manisa)',
    'MASKİ (Malatya)', 'KOSKİ', 'DİSKİ', 'GASKİ', 'KASKİ', 'OSKİ', 'BASKİ', 'DESKİ'
  ],
  Doğalgaz: [
    'İGDAŞ', 'BAŞKENTGAZ', 'BURSAGAZ', 'AGDAŞ', 'ESGAZ', 'AKSA Doğalgaz',
    'KARGAZ', 'ARMAGAZ', 'ENERYA', 'Sürmeligaz', 'ÇORUMGAZ', 'SİVASGAZ',
    'TRABZONGAZ', 'BATMANGAZ', 'KAYSERİGAZ', 'SAMGAZ'
  ],
  İnternet: [
    'Turk Telekom', 'Turkcell Superonline', 'Vodafone Net', 'Millenicom', 'NetSpeed',
    'KabloNet (Uydunet)', 'D-Smart Net', 'Türksat', 'Comnet', 'GIBIRNet',
    'TTNet', 'Sinet', 'SmileADSL', 'Süperonline Fiber'
  ],
  Mobil: [
    'Turkcell', 'Vodafone', 'Türk Telekom', 'Bimcell', 'Pttcell', 'Teknocell',
    'Virgin Mobile', 'Netgsm', 'Onvo Mobile'
  ]
};

const InstitutionSelect = () => {
  const navigation = useNavigation(); 
  const route = useRoute(); // React Navigation'dan route'u alır.
  const { billType } = route.params;
  const [searchText, setSearchText] = useState(''); // Arama metnini tutar.
  const { user } = useSelector((state) => state.user); // Redux'tan kullanıcı bilgilerini alır.

  const handleSelect = (institution) => {
    if (user?.role === 'admin') {
      navigation.navigate('AdminInvoice', { billType, institution });
    } else {
      navigation.navigate('NumberEntry', { billType, institution });
    }
  };

  const filteredInstitutions = institutionData[billType]?.filter(institution =>
    institution.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <CustomKeyboard>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Kurum Ara"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {filteredInstitutions?.map((institution, index) => ( // Kullanıcı arama metnini girdiğinde, seçenekleri filtreler.
          <TouchableOpacity
            key={index}
            style={styles.listItem}
            onPress={() => handleSelect(institution)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{institution}</Text>
              <Icon
                name="chevron-forward-outline"
                size={25}
                color={billColors[billType] || "#000"} // Renk fatura türüne göre
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </CustomKeyboard>
  );
};

export default InstitutionSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
});

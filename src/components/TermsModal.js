import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const TermsModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Şartlar ve Koşullar</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.content}>
              1. Hizmet Tanımı: Uygulama, kullanıcıların fatura ödemelerini yapabilmesi için dijital bir platformdur. {"\n\n"}
              2. Kayıt ve Hesap Güvenliği: Doğru ve güncel bilgilerle kayıt yapılmalı, hesap güvenliği sağlanmalıdır. {"\n\n"}
              3. Kart Bilgileri: Her kullanıcıya sistem tarafından sanal kart atanır ve bu bilgiler güvenle saklanır. {"\n\n"}
              4. Kullanıcı Yükümlülükleri: Uygulama üzerinden yasa dışı ve zararlı paylaşımlar yapılamaz. {"\n\n"}
              5. Fikri Mülkiyet: Uygulama içeriği, tasarımı ve kodları geliştiriciye aittir. {"\n\n"}
              6. Hizmet Kesintileri: Uygulama hizmetlerinde değişiklik yapılabilir, sorumluluk kabul edilmez. {"\n\n"}
              7. Sorumluluk Sınırı: Uygulama kullanımından doğan zararlardan geliştirici sorumlu değildir. {"\n\n"}
              8. Değişiklik Hakkı: Bu şartlar zamanla değiştirilebilir ve güncellenebilir. {"\n\n"}
              9. İletişim: Sorularınız için info@uygulama.com adresine yazabilirsiniz.
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00c2ff',
    marginBottom: 10,
  },
  scroll: {
    marginBottom: 20,
  },
  content: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  button: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#00c2ff',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

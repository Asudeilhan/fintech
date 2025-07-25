import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ContractsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanım Koşulları</Text>
      <View style={styles.box}>
        <Text style={styles.paragraph}>
          Bu uygulamayı kullanarak, aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Uygulamanın içeriği bilgilendirme amaçlıdır ve önceden haber verilmeden değiştirilebilir.
        </Text>
      </View>

      <Text style={styles.title}>Gizlilik Politikası</Text>
      <View style={styles.box}>
        <Text style={styles.paragraph}>
          Kullanıcı bilgileri hiçbir şekilde üçüncü şahıslarla paylaşılmaz. E-posta adresiniz yalnızca uygulama içi bildirimler ve destek için kullanılır.
        </Text>
      </View>

      <Text style={styles.title}>Veri Güvenliği</Text>
      <View style={styles.box}>
        <Text style={styles.paragraph}>
          Tüm kullanıcı verileri, güvenli Firebase altyapısında saklanmaktadır. Verilere sadece yetkili kişiler erişebilir.
        </Text>
      </View>

      <Text style={styles.title}>Sorumluluk Reddi</Text>
      <View style={styles.box}>
        <Text style={styles.paragraph}>
          Uygulamanın sunduğu bilgiler genel niteliktedir ve profesyonel tavsiye yerine geçmez. Kullanıcı, uygulamayı kullanırken kendi sorumluluğunu kabul eder.
        </Text>
      </View>
    </View>
  );
};

export default ContractsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#3ab44a',
  },
  box: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});

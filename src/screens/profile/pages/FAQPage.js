import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const faqData = [
  {
    question: 'Uygulamayı nasıl kullanabilirim?',
    answer: 'Ana sayfadan başlayarak ödeme yapabilir, para transferi gerçekleştirebilir ve hesap bilgilerinizi yönetebilirsiniz.',
  },
  {
    question: 'Dil ayarlarını nereden değiştirebilirim?',
    answer: 'Profil > Ayarlar sekmesine giderek Türkçe veya İngilizce seçeneklerinden birini seçebilirsiniz.',
  },
  {
    question: 'Hesabımı nasıl silebilirim?',
    answer: 'Ayarlar bölümünden “Hesabımı Sil” seçeneğine tıklayarak hesabınızı kalıcı olarak silebilirsiniz.',
  },
  {
    question: 'Kart bilgilerimi nereden görebilirim?',
    answer: 'Ana sayfada kartlarınızla ilgili bilgileri görüntüleyebilirsiniz.',
  },
  {
    question: 'Destek için kiminle iletişime geçebilirim?',
    answer: '“Bize Ulaşın” bölümünden destek ekibimize mesaj gönderebilirsiniz.',
  },
];

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sıkça Sorulan Sorular</Text>
      {faqData.map((item, index) => (
        <View key={index} style={styles.faqBox}>
          <TouchableOpacity
            style={styles.questionRow}
            onPress={() => toggleIndex(index)}
          >
            <Text style={styles.question}>{item.question}</Text>
            <Icon
              name={activeIndex === index ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#3ab44a"
            />
          </TouchableOpacity>
          {activeIndex === index && (
            <Text style={styles.answer}>{item.answer}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default FaqPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  faqBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3ab44a',
    flex: 1,
    marginRight: 10,
  },
  answer: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

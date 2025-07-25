import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import {
  CustomTextInput,
  CustomButton,
  CustomLink,
  Loading,
  CustomKeyboard,
  CustomTextMessage,
  WelcomeHeader,
  Custombox,
  CustomSvg
} from '../components';
import TermsModal from '../components/TermsModal';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/userSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const formatPhoneNumber = (number) => {
  const digits = number.replace(/\D/g, '');
  if (digits.length === 0) return '0';
  if (digits.length <= 1) return `0`;
  if (digits.length <= 4) return `0 (${digits.slice(1)}`;
  if (digits.length <= 7) return `0 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9) return `0 (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return `0 (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
};

const SignupPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const branches = [
    'İstanbul - Kadıköy', 'İstanbul - Beşiktaş', 'İstanbul - Üsküdar',
    'İstanbul - Bakırköy', 'İstanbul - Şişli', 'Ankara - Çankaya', 'Ankara - Keçiören',
    'Ankara - Yenimahalle', 'Ankara - Mamak', 'Ankara - Etimesgut',
    'İzmir - Karşıyaka', 'İzmir - Konak', 'İzmir - Bornova', 'İzmir - Buca',
    'İzmir - Gaziemir', 'Bursa - Osmangazi', 'Bursa - Nilüfer', 'Bursa - Yıldırım',
    'Bursa - Mudanya', 'Bursa - İnegöl', 'Antalya - Muratpaşa', 'Antalya - Kepez',
    'Antalya - Konyaaltı', 'Antalya - Alanya', 'Antalya - Manavgat',
    'Adana - Seyhan', 'Adana - Yüreğir', 'Adana - Çukurova', 'Adana - Sarıçam',
    'Gaziantep - Şahinbey', 'Gaziantep - Şehitkamil', 'Konya - Selçuklu',
    'Konya - Meram', 'Konya - Karatay', 'Samsun - İlkadım', 'Samsun - Atakum',
    'Kayseri - Melikgazi', 'Kayseri - Kocasinan', 'Mersin - Mezitli',
    'Mersin - Yenişehir', 'Mersin - Toroslar', 'Eskişehir - Tepebaşı',
    'Eskişehir - Odunpazarı', 'Trabzon - Ortahisar', 'Denizli - Pamukkale',
    'Denizli - Merkezefendi', 'Balıkesir - Altıeylül', 'Balıkesir - Karesi',
  ];

  const randomBranch = branches[Math.floor(Math.random() * branches.length)];

  const handleRegister = async () => {
    setIsSubmitted(true);

    if (!firstName || !lastName || !tcNo || !phoneNumber || !password || !email) {
      setMessage('Lütfen tüm alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      setMessage('Şifre en az 6 karakterden oluşmalıdır.');
      return;
    }
    if (tcNo.length !== 11) {
      setMessage('TCKN 11 haneli olmalıdır.');
      return;
    }
    if (phoneNumber.length !== 17) {
      setMessage('Telefon numarası formatı hatalıdır.');
      return;
    }
    if (!isChecked) {
      setMessage('Lütfen Şartlar ve Koşulları kabul ediniz.');
      return;
    }

    try {
      const cardsRef = collection(db, 'cards');
      const q = query(cardsRef, where('isUsed', '==', false));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMessage('Kullanılabilir kart kalmadı.');
        return;
      }

      const cardDoc = snapshot.docs[0];
      const cardData = cardDoc.data();

      await updateDoc(doc(db, 'cards', cardDoc.id), { isUsed: true });

      dispatch(register({
        email,
        password,
        firstName,
        lastName,
        tcNo,
        phoneNumber,
        branch: randomBranch,
        cardInfo: cardData // ✅ kart Firestore'dan geliyor
      }));
    } catch (error) {
      console.error('Kart atanırken hata oluştu:', error);
      setMessage('Kayıt sırasında bir hata oluştu.');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
    <CustomKeyboard>
      <View style={styles.container}>
        <WelcomeHeader title="Aramıza Hoşgeldin," subtitle="Yeni hesap oluştur" />

        <CustomTextInput title="İsim" handleOnChange={setFirstName} handleValue={firstName} handlePlaceholder="İsim" />
        <CustomTextInput title="Soyisim" handleOnChange={setLastName} handleValue={lastName} handlePlaceholder="Soyisim" />
        <CustomTextInput title="TCKN" handleOnChange={(text) => setTcNo(text.replace(/\D/g, ''))} handleValue={tcNo} handlePlaceholder="TCKN" handleKeyboardType="numeric" maxLength={11} />
        <CustomTextInput handleOnChange={setEmail} handleValue={email} handlePlaceholder="Email" />
        <CustomTextInput title="Telefon Numarası" handleOnChange={(text) => setPhoneNumber(text.length < phoneNumber.length ? text : formatPhoneNumber(text))} handleValue={phoneNumber} handlePlaceholder="Telefon numarası" handleKeyboardType="phone-pad" maxLength={17} />

        <View style={styles.passwordContainer}>
          <CustomTextInput title="Şifre" isSecureText={!showPassword} handleOnChange={setPassword} handleValue={password} handlePlaceholder="Şifre" handleKeyboardType="numeric" />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
        <Custombox checked={isChecked} onChange={() => setIsChecked(!isChecked)} color="#3ab44a" />
          <Text style={styles.checkboxLabel}>
            Bir hesap oluşturarak{' '}
            <Text onPress={() => setModalVisible(true)} style={{ fontWeight: 'bold', color: '#02aeef', textDecorationLine: 'underline' }}>
              Şartlar ve Koşullarımızı
            </Text>{' '}
            kabul etmiş olursunuz
          </Text>
        </View>

        {message ? (
          <View style={styles.messageContainer}>
            <CustomTextMessage message={message} type="error" />
          </View>
        ) : null}

        <CustomButton title="Kayıt Ol" onPress={handleRegister} />
        <CustomLink text="Zaten hesabın var mı? " buttonText="Giriş Yap" onPress={() => navigation.navigate('Login')} />
      </View>

      {/* ✅ TermsModal entegresi */}
      <TermsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </CustomKeyboard>
    <View pointerEvents="none">
</View>


        </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 23,
  },
  messageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    width: '90%',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
});

export default SignupPage;

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Loading,
  CustomTextInput,
  CustomButton,
  CustomLink,
  CustomKeyboard,
  CustomTextMessage,
  WelcomeHeader,
} from '../components';
import { login, setIsLoading } from '../redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogin = () => {
    setIsSubmitted(true);

    if (!email && !password) {
      setMessage('Lütfen mail ve şifre giriniz.');
      return;
    } else if (email && !password) {
      setMessage('Lütfen şifre giriniz.');
      return;
    } else if (!email && password) {
      setMessage('Lütfen mail giriniz.');
      return;
    } else if (password.length < 6) {
      setMessage('Şifre en az 6 karakterden oluşmalıdır.');
      return;
    }

    dispatch(setIsLoading(true));
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        setMessage('');
        setIsSubmitted(false);
      })
      .catch(() => {
        setMessage('Mail veya şifre yanlış.');
        dispatch(setIsLoading(false));
      });
  };

  return (
    <CustomKeyboard>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* 🟢 Üst başlık */}
          <WelcomeHeader
            title="Tekrardan Hoşgeldin,"
            subtitle="Devam etmek için oturum açın"
          />

          {/* 🔵 Ortalanan giriş formu */}
          <View style={styles.formWrapper}>
            <CustomTextInput
              handleOnChange={(text) => {
                setEmail(text);
                if (isSubmitted) setMessage('');
              }}
              handleValue={email}
              handlePlaceholder="Email"
            />

            <View style={styles.passwordContainer}>
              <CustomTextInput
                title="Şifre"
                isSecureText={!showPassword}
                handleOnChange={(text) => {
                  setPassword(text);
                  if (isSubmitted) setMessage('');
                }}
                handleValue={password}
                handlePlaceholder="Şifre"
                handleKeyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#E0E0E0"
                />
              </TouchableOpacity>
            </View>

            {message ? (
              <CustomTextMessage
                message={message}
                type="error"
                onDismiss={() => setMessage('')}
              />
            ) : null}

            <CustomButton title="Giriş Yap" onPress={handleLogin} />

            <CustomLink
              text="Hesabın yok mu? "
              buttonText="Hesap Oluştur"
              onPress={() => navigation.navigate('Signup')}
            />
          </View>

          {/* 🟡 Yükleniyor bileşeni */}
          {isLoading && (
            <Loading changeIsLoading={() => dispatch(setIsLoading(false))} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </CustomKeyboard>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

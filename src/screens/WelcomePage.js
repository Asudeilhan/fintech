import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { CustomButton, CustomLink, GradientHeader, SmileMouth} from '../components/';


const WelcomePage = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <GradientHeader />
          <SmileMouth />
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeMessage}>Faturam'a</Text>
          <Text style={styles.welcomeMessage2}>Hoşgeldin</Text>
        </View>

        <CustomButton
          title="Giriş Yap"
          onPress={() => navigation.navigate('Login')}
        />

        <View style={{ marginTop: 24 }}>
          <CustomLink
            text="Yeni bir deneyim için "
            buttonText="Hesap oluştur"
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </SafeAreaView>

      <View style={styles.svgContainer}>
        {/* Alt SVG varsa buraya */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    position: 'absolute',
    top: 80,
    width: '100%',
    alignItems: 'center',
  },
  chartContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  welcomeMessage: {
    fontSize: 24,
  },
  welcomeMessage2: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  svgContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
});

export default WelcomePage;
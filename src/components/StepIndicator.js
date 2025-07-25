import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Her fatura türüne göre aktif renk
const billColors = {
  Elektrik: '#a64dff',
  Doğalgaz: '#ffa500',
  İnternet: '#ff4eb5',
  Su: '#00c2ff',
  Mobil: '#3ab44a',
};

const StepIndicator = ({ activeStep, billType }) => {
  const billColor = billColors[billType] || '#00c2ff';

  return (
    <View style={styles.stepContainer}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={[
            styles.stepCircle,
            activeStep === step && { backgroundColor: billColor },
            activeStep > step && { backgroundColor: billColor },
            activeStep < step && styles.inactiveStep,
          ]}
        >
          {activeStep > step ? (
            <Icon name="checkmark" size={20} color="#fff" />
          ) : (
            <Text
              style={[
                styles.stepText,
                activeStep < step && styles.inactiveStepText,
              ]}
            >
              {step}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inactiveStep: {
    backgroundColor: '#fff',
    borderColor: '#333',
  },
  stepText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inactiveStepText: {
    color: '#333',
  },
});

export default StepIndicator;

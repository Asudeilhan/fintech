import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const Custombox = ({ checked, onChange }) => {
  return (
    <TouchableOpacity onPress={onChange} style={[styles.box, checked && styles.boxChecked]}>
      {checked && (
        <Icon name="checkmark-sharp" size={16} color="#fff" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#02aeef',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#fff', // tikli değilken beyaz
  },
  boxChecked: {
    backgroundColor: '#3ab44a', // tikli olduğunda yeşil arka plan
    borderColor: '#3ab44a',
  },
});

export default Custombox;

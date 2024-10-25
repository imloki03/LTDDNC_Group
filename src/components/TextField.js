import React from 'react';
import { TextInput } from 'react-native-paper';

const TextField = ({ label, value, onChangeText, secureTextEntry }) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      mode="outlined"
      style={{ marginBottom: 16 }}
    />
  );
};

export default TextField;

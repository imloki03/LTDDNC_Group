import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  mode = 'contained', 
  loading = false, 
  disabled = false,
}) => {
  return (
    <PaperButton 
      mode={mode} 
      onPress={onPress} 
      loading={loading} 
      disabled={disabled}
      style={styles.button}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
});

export default Button;

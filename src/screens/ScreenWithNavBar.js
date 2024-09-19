import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavBar from './NavBar';

const ScreenWithNavBar = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default ScreenWithNavBar;

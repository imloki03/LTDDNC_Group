import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { login } from '../api/authApi';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { loginSuccess } from '../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const handleLogin = async () => {
    setIsLoading(true);
    const response = await login(email, password);
    if (response.status === 200) {
      dispatch(loginSuccess(response.data));
      //nav to workspace
    } else {
        Alert.alert('Login failed', response.desc || 'Something went wrong!');
    }
    setIsLoading(false)
    console.log(user)
  };

  

  return (
    <View style={styles.container}>
      <TextField
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Button
        title="Login"
        //disabled={isLoading}
        onPress={handleLogin}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default LoginScreen;
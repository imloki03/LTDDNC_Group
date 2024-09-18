// screens/LoginScreen.js
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useWindowDimensions } from 'react-native';
import axios from 'axios';
import { API_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const { width } = useWindowDimensions();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}users/m/login`, {
                email: email,
                password: password,
            });
            if (response.data.status === 200) {
                await AsyncStorage.setItem('token', response.data.data.token);
                await AsyncStorage.setItem('email', email);
                navigation.navigate('Home');
            } else {
                Alert.alert('Login Failed', response.data.message || 'Wrong email or password!');
                console.log(response)
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Login Failed', 'Wrong email or password!');
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Image
                source={require('../../assets/logo.png')}
                className="w-32 h-32 mb-6"
            />
            
            <TextInput
                placeholder="Email"
                className="w-3/4 p-3 mb-4 bg-white rounded shadow"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                className="w-3/4 p-3 mb-4 bg-white rounded shadow"
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={{ width: width * 0.75 }}
                className="p-3 bg-blue-500 rounded shadow mb-4"
                onPress={handleLogin}
            >
                <Text className="text-center text-white">Login</Text>
            </TouchableOpacity>

            <View className="flex-row mt-4">
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text className="text-blue-600">Register</Text>
                </TouchableOpacity>
                <Text className="mx-2">|</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text className="text-blue-600">Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

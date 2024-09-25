import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { API_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
    const { width } = useWindowDimensions();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${API_URL}users/m/register`, {
                name: name,
                email: email,
                password: password,
            });
            if (response.data.status === 200) {
                Alert.alert('Registration Successful', 'You have registered successfully!');
                navigation.navigate('Home');
            } else {
                Alert.alert('Registration Failed', response.data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Registration Failed', 'An error occurred. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        if (otp) {
            try {
                const verifyResponse = await axios.post(`${API_URL}email?email=${email}&otp=${otp}`);
                if (verifyResponse.status === 200) {
                    await handleRegister();
                } else {
                    Alert.alert('Verification Failed', verifyResponse.data.message || 'Invalid OTP.');
                }
            } catch (error) {
                console.error('OTP Verification error:', error);
                Alert.alert('Verification Failed', 'An error occurred. Please try again.');
            }
        } else {
            Alert.alert('Input Error', 'Please enter the OTP.');
        }
    };

    const handleSendOtp = async () => {
        try {
            const otpResponse = await axios.get(`${API_URL}email?email=${email}`);
            if (otpResponse.status === 200) {
                setOtpSent(true);
                Alert.alert('OTP Sent', 'Please check your email for the OTP.');
            } else {
                Alert.alert('Error', 'Failed to send OTP.');
            }
        } catch (error) {
            console.error('OTP sending error:', error);
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Image
                source={require('../../assets/logo.png')}
                className="w-32 h-32 mb-6"
            />
            {!otpSent ? (
                <>
                    <TextInput
                        placeholder="Name"
                        className="w-3/4 p-3 mb-4 bg-white rounded shadow"
                        value={name}
                        onChangeText={setName}
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
                        onPress={handleSendOtp}
                    >
                        <Text className="text-center text-white">Send OTP</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TextInput
                        placeholder="Enter OTP"
                        className="w-3/4 p-3 mb-4 bg-white rounded shadow"
                        value={otp}
                        onChangeText={setOtp}
                    />
                    <TouchableOpacity
                        style={{ width: width * 0.75 }}
                        className="p-3 bg-green-500 rounded shadow mb-4"
                        onPress={handleVerifyOtp}
                    >
                        <Text className="text-center text-white">Verify OTP</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

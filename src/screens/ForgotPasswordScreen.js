import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useWindowDimensions } from 'react-native';
import axios from 'axios';
import { API_URL } from '../constants';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { width } = useWindowDimensions();

    const handleSendOtp = async () => {
        if (email) {
            try {
                const response = await axios.get(`${API_URL}email?email=${email}`);
                if (response.status === 200) {
                    setOtpSent(true);
                    Alert.alert('Success', 'OTP has been sent to your email!');
                } else {
                    console.log(response);
                    Alert.alert('Error', response.data.message || 'Failed to send OTP. Please try again.');
                }
            } catch (error) {
                console.error('Error sending OTP:', error);
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        } else {
            Alert.alert('Input Error', 'Please enter your email.');
        }
    };

    const handleResetPassword = async () => {
        if (otp && newPassword) {
            try {
                const response = await axios.post(`${API_URL}users/m/reset?otp=${otp}`, {
                    email: email,
                    password: newPassword,
                });
                if (response.data.status === 200) {
                    Alert.alert('Success', 'Password has been reset successfully!');
                    navigation.navigate('Login');
                } else {
                    console.log(response)
                    Alert.alert('Error', response.data.message || 'Failed to reset password. Please try again.');
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        } else {
            Alert.alert('Input Error', 'Please fill in all fields.');
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-3xl font-bold mb-6">Forgot Password</Text>

            {!otpSent ? (
                <>
                    {/* Step 1: Enter Email */}
                    <TextInput
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        className="p-3 mb-4 bg-white rounded shadow"
                        style={{ width: width * 0.75 }}
                    />

                    {/* Send OTP Button */}
                    <TouchableOpacity
                        style={{
                            width: width * 0.75,
                            padding: 15,
                            backgroundColor: '#007bff',
                            borderRadius: 8,
                            alignItems: 'center',
                            marginBottom: 10,
                        }}
                        onPress={handleSendOtp}
                    >
                        <Text className="text-white">Send OTP</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    {/* Step 2: Enter OTP and New Password */}
                    <TextInput
                        placeholder="Enter OTP"
                        value={otp}
                        onChangeText={setOtp}
                        className="p-3 mb-4 bg-white rounded shadow"
                        style={{ width: width * 0.75 }}
                    />
                    <TextInput
                        placeholder="Enter new password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        className="p-3 mb-4 bg-white rounded shadow"
                        style={{ width: width * 0.75 }}
                    />

                    {/* Reset Password Button */}
                    <TouchableOpacity
                        style={{
                            width: width * 0.75,
                            padding: 15,
                            backgroundColor: '#28a745',
                            borderRadius: 8,
                            alignItems: 'center',
                            marginBottom: 10,
                        }}
                        onPress={handleResetPassword}
                    >
                        <Text className="text-white">Reset Password</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

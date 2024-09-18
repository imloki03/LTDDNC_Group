import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants'; // Adjust the path as needed

export default function ProfileScreen() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const fetchUserProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token);
            const mail = await AsyncStorage.getItem("email");
            console.log(email);
            setEmail(mail);
        
            const response = await axios.get(
                `${API_URL}users/m?email=${mail}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === 200) {
                // Set the user profile details
                console.log(response);
                setUsername(response.data.data);
            } else {
                Alert.alert('Fetch Failed', response.data.message || 'An error occurred while fetching the profile.');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Fetch Failed', 'An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-4">
            <Text className="text-3xl font-bold mb-8">Profile</Text>

            <Text className="border border-gray-300 w-full p-3 mb-4 rounded-lg bg-white">
                Email: {email}
            </Text>

            <Text className="border border-gray-300 w-full p-3 mb-4 rounded-lg bg-white">
                Username: {username}
            </Text>
        </View>
    );
}

import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { login } from '../api/authApi';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { loginSuccess } from '../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import LinkText from "../components/LinkText";
import { useNavigation } from "@react-navigation/native";
import {getUserInfo} from "../api/userApi";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const handleLogin = async () => {
        setIsLoading(true);
        const response = await login(email, password);
        if (response.status === 200) {
            const user = (await getUserInfo(email)).data
            dispatch(loginSuccess(user));
            if (user.status.activated  === true)
                navigation.navigate("ProjectManage");
            else
                navigation.navigate("Email");
        } else {
            Alert.alert('Login failed', response.desc || 'Something went wrong!');
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
            />
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
                onPress={handleLogin}
                loading={isLoading}
            />

            <LinkText to="Register" onPress={() => navigation.navigate("Register")}>
                Don't have an account? Register here.
            </LinkText>

            <LinkText to="ChangePassword" onPress={() => navigation.navigate("ChangePassword")}>
                Forgot your password? Change it here.
            </LinkText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    logo: {
        width: '80%',
        height: undefined,
        aspectRatio: 1, 
        resizeMode: 'contain',
        marginBottom: 0,
        marginLeft: 37,
    },
});

export default LoginScreen;

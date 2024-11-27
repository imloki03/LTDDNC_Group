import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { activateUser, getUserInfo } from '../api/userApi';
import { sendOtp, verifyOtp } from '../api/otpApi';
import { loginSuccess } from "../redux/slices/userSlice";
import { useNavigation } from "@react-navigation/native";

export const EmailValidationScreen = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigation = useNavigation();
    const user = useSelector(state => state.user.user);
    const otpRefs = useRef([]);

    const fetchEmailAndSendOtp = async () => {
        try {
            setEmail(user.email);
            await sendOtp(user.email);
            setOtpSent(true);
            setSuccessMessage(`OTP has been sent to ${user.email}`);
        } catch (error) {
            setValidationError('Failed to send OTP');
        }
    };

    useEffect(() => {
        fetchEmailAndSendOtp();
    }, [user]);

    const handleOtpChange = (value, index) => {
        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            otpRefs.current[index + 1].focus();
        }
    };

    const resetOtp = () => {
        setOtp(['', '', '', '', '', '']);
        otpRefs.current.forEach(ref => ref?.clear()); // Clear the inputs
    };

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join('');
        try {
            await verifyOtp(email, enteredOtp);
            setSuccessMessage('Email verified successfully');
            const response = await activateUser(user.username);
            if (response.status === 200) {
                navigation.navigate("ProjectManage");
            }
            setValidationError('');
        } catch (error) {
            setValidationError('Invalid OTP');
        } finally {
            resetOtp(); // Clear OTP fields and refs after verification
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Email Validation" />
            </Appbar.Header>
            <View style={styles.container}>
                <HelperText type="info" visible={otpSent}>
                    {successMessage}
                </HelperText>

                <View style={styles.container}>
                    <Text style={styles.headerText}>
                        A verification OTP has been sent to {user.email}. Please check your inbox and enter the OTP below.
                    </Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                style={styles.otpInput}
                                ref={(ref) => otpRefs.current[index] = ref}
                            />
                        ))}
                    </View>

                    <Button mode="contained" onPress={handleVerifyOtp} style={styles.verifyButton}>
                        Verify OTP
                    </Button>

                    {validationError ? (
                        <HelperText type="error" visible={!!validationError}>
                            {validationError}
                        </HelperText>
                    ) : null}

                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
    },
    otpInput: {
        width: 40,
        height: 50,
        textAlign: 'center',
        fontSize: 18,
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    verifyButton: {
        marginTop: 20,
    },
    successText: {
        color: 'green',
        marginTop: 10,
        textAlign: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'justify',
        marginBottom: 20,
    },
});

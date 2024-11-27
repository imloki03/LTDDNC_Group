import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../api/otpApi';
import { changePassword, getUserInfo } from '../api/userApi';
import TextField from "../components/TextField";
import {useNavigation} from "@react-navigation/native";
import LinkText from "../components/LinkText";

export const ChangePasswordScreen = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordStep, setIsPasswordStep] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);

    const otpRefs = useRef([]);
    const navigation = useNavigation()

    const handleSendOtp = async () => {
        try {
            await sendOtp(email);
            setOtpSent(true);
        } catch (error) {
            setValidationError('Failed to send OTP');
        }
    };

    const handleOtpChange = (value, index) => {
        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleVerifyOtp = async () => {
        const enteredOtp = otp.join('');
        try {
            await verifyOtp(email, enteredOtp);
            setValidationError('');
            setIsPasswordStep(true);
        } catch (error) {
            setValidationError('Invalid OTP');
        } finally {
            resetOtp();
        }
    };

    const handleChangePassword = async () => {
        try {
            const user = (await getUserInfo(email)).data;
            const changePasswordRequest = { password };
            const response  = await changePassword(user.username, changePasswordRequest);
            if (response.status === 200) {
                setSuccessMessage('Password changed successfully. Click here to log in');
                setValidationError('');
            }
        } catch (error) {
            setValidationError('Failed to change password');
        } finally {
            resetOtp();
        }
    };


    const handleEmailSearch = async () => {
        if (email.trim()) {
            try {
                setEmailVerified(true);
                await handleSendOtp();
            } catch (error) {
                setValidationError('Account not found');
            }
        } else {
            setValidationError('Please enter your email');
        }
    };

    const resetOtp = () => {
        setOtp(['', '', '', '', '', '']);
        otpRefs.current.forEach(ref => ref?.clear()); // Clear the inputs
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Change Password" />
            </Appbar.Header>
            <View style={styles.container}>

                {!emailVerified ? (
                    <>
                        <Text style={styles.headerText}>
                            Please enter your email to search for your account
                        </Text>

                        <TextField
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                        />

                        <Button mode="contained" onPress={handleEmailSearch} style={styles.verifyButton}>
                            Search
                        </Button>

                        {validationError ? (
                            <HelperText type="error" visible={!!validationError}>
                                {validationError}
                            </HelperText>
                        ) : null}
                    </>
                ) : (
                    <>
                        <Text style={styles.headerText}>
                            A reset password requesting OTP has been sent to {email}. Please check your inbox and enter the OTP below.
                        </Text>

                        {otpSent && !isPasswordStep ? (
                            <>
                                <HelperText type="info" visible={otpSent}>
                                    {successMessage}
                                </HelperText>

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
                            </>
                        ) : !isPasswordStep ? null : (
                            <>
                                <TextField
                                    label="New Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    style={styles.passwordInput}
                                />
                                <Button mode="contained" onPress={handleChangePassword} style={styles.verifyButton}>
                                    Change Password
                                </Button>
                            </>
                        )}

                        {validationError ? (
                            <HelperText type="error" visible={!!validationError}>
                                {validationError}
                            </HelperText>
                        ) : null}

                        {successMessage && isPasswordStep ? (
                            <LinkText to="Login" style={styles.successText}>{successMessage}</LinkText>
                        ) : null}
                    </>
                )}
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
    passwordInput: {
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
    input: {
        marginTop: 20,
    },
});

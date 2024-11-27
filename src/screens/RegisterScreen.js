import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Title } from 'react-native-paper';
import { Formik } from 'formik';
import TextField from '../components/TextField';
import Button from '../components/Button';
import LinkText from '../components/LinkText';
import DropdownTextField from '../components/DropdownTextField';
import { RegisterRequest, register, registerValidationSchema } from '../api/userApi';

const RegisterScreen = () => {
    const navigation = useNavigation();

    const handleRegister = useCallback(
        async (values, { setSubmitting, resetForm }) => {
            try {
                const registerRequest = RegisterRequest(
                    values.username,
                    values.name,
                    values.email,
                    values.password,
                    values.gender
                );
                const response = await register(registerRequest);

                if (response.status === 200) {
                    Alert.alert("Success", response.desc, [
                        { text: "OK", onPress: () => navigation.navigate("Login") }
                    ]); //should nav to workspace
                    resetForm();
                } else {
                    Alert.alert("Error", response.desc);
                }
            } catch (error) {
                Alert.alert("Error", "Something went wrong. Please try again.");
            } finally {
                setSubmitting(false);
            }
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Register</Title>
            <Formik
                initialValues={{
                    username: '',
                    name: '',
                    email: '',
                    password: '',
                    gender: '',
                }}
                validationSchema={registerValidationSchema}
                validateOnChange={false}
                validateOnBlur
                onSubmit={handleRegister}
            >
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      validateForm,
                      values,
                      errors,
                      isSubmitting,
                      setSubmitting,
                  }) => (
                    <>
                        {/** Username Field */}
                        <TextField
                            label="Username"
                            value={values.username}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            error={errors.username}
                        />

                        {/** Name Field */}
                        <TextField
                            label="Full Name"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            error={errors.name}
                        />

                        {/** Email Field */}
                        <TextField
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={errors.email}
                        />

                        {/** Password Field */}
                        <TextField
                            label="Password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            secureTextEntry
                            error={errors.password}
                        />

                        {/** Gender Dropdown */}
                        <DropdownTextField
                            label="Gender"
                            selectedValue={values.gender}
                            onValueChange={handleChange('gender')}
                            options={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' },
                                { label: 'Other', value: 'Other' },
                            ]}
                            error={errors.gender}
                        />

                        {/** Register Button */}
                        <Button
                            title="Register"
                            onPress={async () => {
                                setSubmitting(true);
                                const formErrors = await validateForm();

                                if (Object.keys(formErrors).length > 0) {
                                    Alert.alert("Validation Error", Object.values(formErrors)[0]);
                                    setSubmitting(false);
                                } else {
                                    handleSubmit();
                                }
                            }}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        />

                        {/** Login Link */}
                        <LinkText to="Login">
                            Already have an account? Login here.
                        </LinkText>
                    </>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
    },
});

export default RegisterScreen;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import EditProfileScreen from './src/screens/ProfileScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import ScreenWithNavBar from './src/screens/ScreenWithNavBar';
import { NavBarProvider } from './src/screens/NavBarContext';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavBarProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

                    <Stack.Screen
                        name="Home"
                        children={() => (
                            <ScreenWithNavBar>
                                <HomeScreen />
                            </ScreenWithNavBar>
                        )}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="EditProfile"
                        children={() => (
                            <ScreenWithNavBar>
                                <EditProfileScreen />
                            </ScreenWithNavBar>
                        )}
                    />
                    <Stack.Screen
                        name="ProjectDetail"
                        children={() => (
                            <ScreenWithNavBar>
                                <ProjectDetailScreen />
                            </ScreenWithNavBar>
                        )}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </NavBarProvider>
    );
}
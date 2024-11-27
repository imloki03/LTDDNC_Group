import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from "../screens/RegisterScreen";
import ProjectNavigator from './ProjectNavigator';
import WorkspaceScreen from "../screens/WorkspaceScreen";
import {EmailValidationScreen} from "../screens/EmailValidationScreen";
import {ChangePasswordScreen} from "../screens/ChangePasswordScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ProjectManage" component={ProjectNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Email" component={EmailValidationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

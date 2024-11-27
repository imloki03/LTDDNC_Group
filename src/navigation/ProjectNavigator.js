import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from "../screens/ProfileScreen";
import WorkspaceScreen from "../screens/WorkspaceScreen";
import ChatScreen from "../screens/ChatScreen";
import VersionScreen from "../screens/VersionScreen";
import {EmailValidationScreen} from "../screens/EmailValidationScreen";
import ProjectManagementScreen from "../screens/ProjectManagementScreen";
import PhaseManagementScreen from "../screens/PhaseManagementScreen";
import DetailPhaseScreen from "../screens/DetailPhaseScreen";
import BacklogManagementScreen from "../screens/BacklogManagementScreen";
import CreateProjectScreen from "../screens/CreateProjectScreen";
import EditProjectScreen from "../screens/EditProjectScreen";
import CollaboratorManagementScreen from "../screens/CollaboratorManagementScreen";

const Stack = createStackNavigator();

const ProjectNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={"Home"}>
            <Stack.Screen name="Home" component={WorkspaceScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Project" component={ProjectManagementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Version" component={VersionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Phase" component={PhaseManagementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DetailPhase" component={DetailPhaseScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Backlog" component={BacklogManagementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Collab" component={CollaboratorManagementScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NewProject" component={CreateProjectScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProject" component={EditProjectScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default ProjectNavigator;

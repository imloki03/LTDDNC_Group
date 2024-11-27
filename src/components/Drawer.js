// Drawer.js
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import NavOption from '../components/NavOption';

const Drawer = ({ navigation, title = "Project Management", visible, onClose, currentScreen }) => {
    const animationValue = useRef(new Animated.Value(-300)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animationValue, {
                toValue: -300,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return visible ? (
        <Animated.View style={[styles.drawer, { transform: [{ translateX: animationValue }] }]}>
            <Appbar.Header>
                <IconButton icon="close" onPress={onClose} />
                <Appbar.Content title={title} />
            </Appbar.Header>
            <View style={styles.navoptions}>
                <NavOption
                    icon="briefcase"
                    label="Project"
                    isActive={currentScreen === 'Project'}
                    onPress={() => {
                        onClose();
                        navigation.navigate('Project', { screen: 'Edit' });
                    }}
                />
                <NavOption
                    icon="timeline"
                    label="Phase"
                    isActive={currentScreen === 'Phase'}
                    onPress={() => {
                        onClose();
                        navigation.navigate('Phase');
                    }}
                />
                <NavOption
                    icon="folder"
                    label="Backlog"
                    isActive={currentScreen === 'Backlog'}
                    onPress={() => {
                        onClose();
                        navigation.navigate('Backlog');
                    }}
                />
                <NavOption
                    icon="account-group"
                    label="Collab"
                    isActive={currentScreen === 'Collab'}
                    onPress={() => {
                        onClose();
                        navigation.navigate('Collab');
                    }}
                />
                <NavOption
                    icon="comment"
                    label="Chatbox"
                    isActive={currentScreen === 'Chatbox'}
                    onPress={() => {
                        onClose();
                        navigation.navigate('Chat');
                    }}
                />
                <NavOption
                    icon="file"
                    label="Version"
                    isActive={currentScreen === 'Version'}
                    onPress={() => {
                        onClose();
                        navigation.navigate('Version');
                    }}
                />
                <NavOption
                    icon="logout"
                    label="Workspace"
                    isActive={currentScreen === 'Workspace'}
                    onPress={() => {
                        onClose();
                        navigation.navigate('Home');
                    }}
                />
            </View>
        </Animated.View>
    ) : null;
};

const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80%',
        height: '100%',
        backgroundColor: 'white',
        zIndex: 2,
        elevation: 10,
    },
    navoptions: {
        marginTop: 10,
        marginLeft: 10,
    },
});

export default Drawer;

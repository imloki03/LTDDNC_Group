// NavOption.js
import React from 'react';
import { Menu, IconButton, Text } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const NavOption = ({ icon, label, onPress, isActive }) => (
    <TouchableOpacity onPress={onPress} style={[styles.option, isActive && styles.activeOption]}>
        <IconButton icon={icon} size={20} />
        <Text style={isActive ? styles.activeLabel : null}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    activeOption: {
        backgroundColor: '#e0f7fa', // Example highlight color
        width: '95' +
            '%',
    },
    activeLabel: {
        fontWeight: 'bold',
        color: '#00796b', // Example active text color
    },
});

export default NavOption;

import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LinkText = ({ children, to }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate(to)}>
            <Text style={styles.link}>{children}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    link: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default LinkText;

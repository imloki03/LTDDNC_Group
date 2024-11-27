import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Title } from 'react-native-paper';

const ProfileField = ({ label, value, icon, onEdit }) => (
    <View style={styles.container}>
        <IconButton icon={icon} size={24} />
        <View style={{ flex: 1 }}>
            <Title>{label}</Title>
            <Text>{value}</Text>
        </View>
        {onEdit && (
            <IconButton icon="pencil" size={24} onPress={onEdit} />
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 10,
    },
});

export default ProfileField;

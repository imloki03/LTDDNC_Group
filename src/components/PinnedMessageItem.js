import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

const PinnedMessageItem = ({ message }) => {
    const messageTime = format(new Date(message.sentTime), 'hh:mm a');

    return (
        <View style={styles.container}>
            <Text style={styles.username}>{message.sender}:</Text>
            <Text style={styles.content}>{message.content}</Text>
            <Text style={styles.time}>{messageTime}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffe4b5',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    content: {
        flex: 1,
        marginLeft: 5,
    },
    time: {
        fontSize: 12,
        color: '#666',
        marginLeft: 10,
    },
});

export default PinnedMessageItem;

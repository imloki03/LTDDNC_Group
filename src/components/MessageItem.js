import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { format } from 'date-fns';
import { pinMessage } from '../api/chatApi';

const MessageItem = ({ message, isMine, showTime, onPinChange }) => {
    const [isPinned, setIsPinned] = useState(message.pinned || false);
    const [isTouched, setIsTouched] = useState(false);

    const handlePinToggle = async () => {
        try {
            await pinMessage(message.id);
            setIsPinned(!isPinned);

            if (onPinChange) {
                onPinChange(message.id);
            }
        } catch (error) {
            console.error('Error toggling pin:', error);
        }
    };

    return (
        <View style={[styles.container, isMine ? styles.myMessage : styles.otherMessage]}>
            <Card
                style={styles.card}
                onPress={() => setIsTouched((prevState) => !prevState)}
            >
                <View style={styles.headerContainer}>
                    {/* Avatar */}
                    {message.senderAvatar ? (
                        <Avatar.Image source={{ uri: message.senderAvatar }} size={32} style={styles.avatar} />
                    ) : (
                        <Avatar.Text label={message.sender[0]} size={32} style={styles.avatar} />
                    )}
                    <Text style={styles.senderText}>{message.sender}</Text>

                    {/* Pin Icon/Button */}
                    {isTouched && (
                        <TouchableOpacity onPress={handlePinToggle} style={styles.pinButton}>
                            <IconButton
                                icon={isPinned ? 'pin-off' : 'pin'}
                                size={20}
                                color={isPinned ? '#FF0000' : '#FF0000'}
                                style={styles.pinIcon}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <Card.Content style={styles.contentContainer}>
                    <Text style={styles.messageText}>{message.content}</Text>
                </Card.Content>
                {showTime && <Text style={styles.timeText}>{format(new Date(message.sentTime), 'hh:mm a')}</Text>}
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        marginHorizontal: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    card: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        maxWidth: '85%',
        marginBottom: 5,
        flexDirection: 'column',
        flexShrink: 1,
        justifyContent: 'flex-start',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    avatar: {
        marginRight: 8,
    },
    senderText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    pinButton: {
        marginLeft: 'auto',
    },
    pinIcon: {
        marginLeft: 10,
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
        flexWrap: 'wrap',
    },
    timeText: {
        alignSelf: 'flex-start',
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

export default MessageItem;

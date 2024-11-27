import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, View, TextInput, Modal, Text, TouchableOpacity } from 'react-native';
import { FAB, Appbar, ActivityIndicator, Button, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import WebSocketService from '../services/websocketService';
import MessageItem from '../components/MessageItem';
import PinnedMessageItem from '../components/PinnedMessageItem';
import { SendMessageRequest, getMessagesByProject, searchMessages } from '../api/chatApi';
import { format, isSameDay, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import Drawer from "../components/Drawer";

const ChatScreen = () => {
    const navigation = useNavigation();
    const project =  useSelector((state) => state.project.currentProject);
    const projectId = useSelector((state) => state.project.currentProject.id);
    const user = useSelector((state) => state.user.user.username);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    useEffect(() => {
        getMessagesByProject(projectId)
            .then((data) => {
                const sortedMessages = data.data.sort((a, b) => new Date(a.sentTime) - new Date(b.sentTime));
                setMessages(sortedMessages);
            })
            .catch((error) => console.error('Error fetching messages:', error))
            .finally(() => setLoading(false));

        WebSocketService.connect(user, projectId, handleIncomingMessage);

        return () => WebSocketService.disconnect();
    }, [projectId]);

    const handleIncomingMessage = (message) => {
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, message];
            return updatedMessages.sort((a, b) => new Date(a.sentTime) - new Date(b.sentTime));
        });
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageRequest = SendMessageRequest(newMessage, user, projectId);
            WebSocketService.sendMessage(messageRequest);
            setNewMessage('');
        }
    };

    const handlePinChange = (messageId) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
            )
        );
    };

    const pinnedMessages = messages.filter((msg) => msg.pinned);

    const groupMessagesByDate = (messages) => {
        const grouped = [];
        let currentDate = null;

        messages.forEach((message, index) => {
            const messageDate = format(new Date(message.sentTime), 'yyyy-MM-dd');
            const isLastOfDay = index === messages.length - 1 || !isSameDay(new Date(message.sentTime), new Date(messages[index + 1].sentTime));
            const isLastOfSender = index === messages.length - 1 || message.sender !== messages[index + 1].sender || !isSameDay(new Date(message.sentTime), new Date(messages[index + 1].sentTime));

            if (currentDate !== messageDate) {
                grouped.push({ type: 'date', date: messageDate });
                currentDate = messageDate;
            }

            grouped.push({ ...message, showTime: isLastOfSender });
        });

        return grouped;
    };

    const renderMessageItem = ({ item }) => {
        if (item.type === 'date') {
            return (
                <View style={styles.dateSeparator}>
                    <Text style={styles.dateText}>{format(parseISO(item.date), 'EEEE, MMMM d, yyyy')}</Text>
                </View>
            );
        }

        return (
            <MessageItem
                message={item}
                isMine={item.senderUsername === user}
                showTime={item.showTime}
                onPinChange={handlePinChange}
            />
        );
    };

    const handleSearchClick = () => {
        setSearching(true);
    };

    const handleSearchClose = () => {
        setSearching(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchMessages(projectId, searchQuery)
                .then((data) => {
                    setSearchResults(data.data);
                })
                .catch((error) => console.error('Error searching messages:', error));
        }
    };

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Appbar.Header>
                <Appbar.Action icon="menu" onPress={toggleDrawer} />
                <Appbar.Content title={project.name} />
                <Appbar.Action icon="magnify" onPress={handleSearchClick} />
            </Appbar.Header>

            {isDrawerVisible && (
                <Drawer
                    navigation={navigation}
                    visible={isDrawerVisible}
                    currentScreen="Chatbox"
                    onClose={() => setIsDrawerVisible(false)}
                />
            )}

            {loading ? (
                <ActivityIndicator size="large" style={styles.loadingIndicator} />
            ) : (
                <>
                    {pinnedMessages.length > 0 && (
                        <View style={styles.pinnedContainer}>
                            <PinnedMessageItem message={pinnedMessages[pinnedMessages.length - 1]} />
                            {pinnedMessages.length > 1 && (
                                <Button onPress={() => setModalVisible(true)} style={styles.seeMoreButton}>
                                    See {pinnedMessages.length - 1} more pinned message(s)
                                </Button>
                            )}
                        </View>
                    )}
                    <FlatList
                        data={groupedMessages}
                        renderItem={renderMessageItem}
                        keyExtractor={(item, index) => item.id ? item.id.toString() : `date-${index}`}
                        style={styles.messageList}
                    />
                </>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    style={styles.textInput}
                />
                <FAB icon="send" onPress={handleSendMessage} small />
            </View>

            <Portal>
                <Modal visible={searching} animationType="slide" onRequestClose={handleSearchClose}>
                    <View style={styles.modalContainer}>
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search messages..."
                            style={styles.searchInput}
                            autoFocus
                        />
                        <Button onPress={handleSearch} style={styles.searchButton}>Search</Button>
                        <Button onPress={handleSearchClose} style={styles.searchButton}>Close</Button>

                        {searchResults.length > 0 ? (
                            <FlatList
                                data={searchResults}
                                renderItem={renderMessageItem}
                                keyExtractor={(item, index) => item.id ? item.id.toString() : `date-${index}`}
                            />
                        ) : (
                            <Text>No results found</Text>
                        )}
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={pinnedMessages.slice(0, -1)}
                            renderItem={({ item }) => <PinnedMessageItem message={item} />}
                            keyExtractor={(item) => item.id.toString()}
                        />
                        <Button onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            Close
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    pinnedContainer: {
        margin: 10,
    },
    seeMoreButton: {
        alignSelf: 'center',
        marginVertical: 10,
    },
    messageList: {
        flex: 1,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    textInput: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    dateSeparator: {
        alignSelf: 'center',
        marginVertical: 10,
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    closeButton: {
        marginTop: 10,
    },
    searchInput: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    searchButton: {
        marginTop: 10,
    },
});

export default ChatScreen;

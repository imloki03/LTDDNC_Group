import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, FlatList, TextInput, Alert, Modal, TouchableOpacity } from 'react-native';
import { addNewCollaborator, getAllCollaborators, updateCollabPermission, deleteCollaborator, searchUser } from '../api/collaboratorApi';
import Button from '../components/Button';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextField from '../components/TextField';
import { Appbar} from "react-native-paper";
import Drawer from "../components/Drawer"

const CollaboratorManagementScreen = ({navigation}) => {
    const projectId = useSelector((state) => state.project.currentProject.id);
    const [collaborators, setCollaborators] = useState([]);
    const [newCollabModalVisible, setNewCollabModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPermission, setSelectedPermission] = useState('VIEWER');
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    useEffect(() => {
        loadCollaborators();
    }, []);

    const loadCollaborators = async () => {
        try {
            const data = await getAllCollaborators(projectId);
            setCollaborators(data);
        } catch (error) {
            console.error('Failed to fetch collaborators:', error);
        }
    };

    const handleAddCollaborator = async (username) => {
        try {
            const response = await addNewCollaborator(projectId, username);
            Alert.alert("Success", `${username} was added to your project!`);
            setNewCollabModalVisible(false);
            loadCollaborators();
        } catch (error) {
            console.error('Failed to add collaborator:', error);
        }
    };

    const handleUpdatePermission = async (collabId, permission) => {
        try {
            await updateCollabPermission(projectId, collabId, permission);
            Alert.alert("Success", "Permission updated successfully!");
            loadCollaborators();
        } catch (error) {
            console.error('Failed to update permission:', error);
        }
    };

    const handleDeleteCollaborator = async (collabId, username) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to remove ${username} from the project?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteCollaborator(projectId, collabId);
                            Alert.alert("Success", `${username} was removed from your project!`);
                            loadCollaborators();
                        } catch (error) {
                            console.error('Failed to delete collaborator:', error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderCollaboratorItem = ({ item }) => (
        <View style={styles.collaboratorItem}>
            <Text>{item.name} ({item.username})</Text>
            <Picker
                selectedValue={item.permission}
                style={styles.permissionPicker}
                onValueChange={(value) => handleUpdatePermission(item.id, value)}
            >
                <Picker.Item label="Owner" value="OWNER" />
                <Picker.Item label="Collab" value="COLLAB" />
            </Picker>
            <TouchableOpacity onPress={() => handleDeleteCollaborator(item.id, item.username)}>
                <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    const searchUsers = async (query) => {
        setSearchQuery(query);
        const userRes = await searchUser(query)
        setSearchResults(userRes);
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Action icon="menu" onPress={toggleDrawer} />
                <Appbar.Content title="Collab Management" />
            </Appbar.Header>

            {isDrawerVisible && (
                <Drawer
                    navigation={navigation}
                    visible={isDrawerVisible}
                    currentScreen="Collab"
                    onClose={() => setIsDrawerVisible(false)}
                />
            )}

            <Button title="+ New collaborator" onPress={() => setNewCollabModalVisible(true)} />
            <FlatList
                data={collaborators}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCollaboratorItem}
            />
            
            <Modal visible={newCollabModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Add New Collaborator</Text>
                    <TextField
                        label="Username"
                        value={searchQuery}
                        onChangeText={searchUsers}
                        style={styles.searchInput}
                    />
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.username}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleAddCollaborator(item.username)}>
                                <Text style={styles.searchResult}>{item.name} ({item.username})</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="Close" onPress={() => setNewCollabModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        paddingHorizontal: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    collaboratorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    permissionPicker: {
        width: 140,
    },
    deleteButton: {
        color: 'red',
    },
    modalContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    searchResult: {
        paddingVertical: 8,
        fontSize: 16,
    },
};

export default CollaboratorManagementScreen;

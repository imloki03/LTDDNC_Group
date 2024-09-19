import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProjectDetailModal from './ProjectDetailScreen';
import { API_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const showModal = (project) => {
        setSelectedProject(project);
        setIsModalVisible(true);
    };

    const hideModal = () => {
        setIsModalVisible(false);
        setSelectedProject(null);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('email');

            if (!token || !email) {
                Alert.alert('Error', 'User is not authenticated');
                return;
            }

            const response = await axios.get(`${API_URL}projects/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data && response.data.data) {
                setProjects(Array.isArray(response.data.data) ? response.data.data : []);
            } else {
                setProjects([]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch projects. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects
        .filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    const renderProjectCard = ({ item }) => {
        const formattedDate = new Date(item.createDate).toLocaleDateString('en-GB');
        return (
            <TouchableOpacity
                className="flex-1 bg-white m-2 p-4 rounded-lg shadow-md"
                onPress={() => showModal(item)}
            >
                <Text className="text-lg font-bold">{item.name}</Text>
                <View className="h-px bg-gray-300 my-2" />
                <Text className="text-sm text-gray-600">Owner: {item.ownerGithubID}</Text>
                <Text className="text-sm text-gray-600">Created: {formattedDate}</Text>
            </TouchableOpacity>
        );
    };

    const handleSortOrderToggle = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Custom Top Bar */}
            <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-md pt-7">
                <Text className="text-lg font-bold flex-1 text-center">Home</Text>
                <Menu
                    visible={visible}
                    anchor={
                        <TouchableOpacity onPress={openMenu}>
                            <Ionicons name="settings-outline" size={24} color="black" />
                        </TouchableOpacity>
                    }
                    onRequestClose={closeMenu}
                >
                    <MenuDivider />
                    <MenuItem onPress={() => { closeMenu(); navigation.navigate('EditProfile'); }}>Edit Profile</MenuItem>
                    <MenuItem onPress={() => { closeMenu(); navigation.navigate('Login'); }}>Logout</MenuItem>
                </Menu>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center px-4 py-2 bg-white shadow-md">
                <TextInput
                    className="flex-1 h-10 border border-gray-300 rounded-md px-2"
                    placeholder="Search Projects..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity className="ml-2">
                    <Ionicons name="search-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity className="ml-2" onPress={handleSortOrderToggle}>
                    <Ionicons name="filter-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Project Cards */}
            {loading ? (
                <Text className="text-center text-gray-500 mt-4">Loading projects...</Text>
            ) : (
                <FlatList
                    data={filteredProjects}
                    renderItem={renderProjectCard}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle="justify-between"
                />
            )}

            {/* Modal for Project Details */}
            {selectedProject && (
                <ProjectDetailModal
                    isVisible={isModalVisible}
                    onClose={hideModal}
                    project={selectedProject}
                />
            )}
        </View>
    );
}

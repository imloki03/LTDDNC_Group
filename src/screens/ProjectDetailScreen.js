import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectDetailModal({ isVisible, onClose, project }) {
    const formattedDate = new Date(project.createDate).toLocaleDateString('en-GB');
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-80 bg-white p-4 rounded-lg shadow-lg">
                    <Text className="text-center text-2xl font-bold mb-2">{project.name}</Text>
                    <Text className="text-sm text-gray-600 mb-4">Owner: {project.ownerGithubID}</Text>
                    <Text className="text-sm text-gray-600 mb-4">Repository: {project.repositoryID}</Text>
                    <Text className="text-sm text-gray-600 mb-4">Created: {formattedDate}</Text>
                    <TouchableOpacity className="mt-4 p-2 bg-blue-500 rounded" onPress={onClose}>
                        <Text className="text-white text-center">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

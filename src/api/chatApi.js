import axios from 'axios';
import { API_URL } from '../constants/constants';

export const SendMessageRequest = (content, sender, project) => ({
    content,
    sender,
    project,
});

export const pinMessage = async (messageId) => {
    try {
        const response = await axios.patch(`${API_URL}chat/pin/${messageId}`);
        return response.data;
    } catch (error) {
        console.error('Error pinning message:', error);
        throw error;
    }
};

export const getMessagesByProject = async (projectId) => {
    try {
        const response = await axios.get(`${API_URL}chat/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project messages:', error);
        throw error;
    }
};

export const searchMessages = async (keyword) => {
    try {
        const response = await axios.get(`${API_URL}chat/project/${projectId}/search`, {
            params: { keyword },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching messages:', error);
        throw error;
    }
};

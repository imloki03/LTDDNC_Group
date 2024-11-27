import axios from 'axios';
import { API_URL } from '../constants/constants';

export const addNewCollaborator = async (projectId, username) => {
    const response = await axios.post(`${API_URL}collab/${projectId}/${username}`);
    return response.data;
};

export const getAllCollaborators = async (projectId) => {
    const response = await axios.get(`${API_URL}collab/${projectId}`);
    return response.data.data;
};

export const updateCollabPermission = async (projectId, collabId, permission) => {
    const response = await axios.patch(`${API_URL}collab/${projectId}/${collabId}/${permission}`);
    return response.data;
};

export const deleteCollaborator = async (projectId, collabId) => {
    const response = await axios.delete(`${API_URL}collab/${projectId}/${collabId}`);
    return response.data;
};

export const searchUser = async (keyword) => {
    if  ( keyword===null ){
        return null
    }
    const response = await axios.get(`${API_URL}user/search?q=${keyword}`);
    return response.data.data;
};

export const getAllAssignedTask = async (collabId) => {
    const response = await axios.get(`${API_URL}collab/${collabId}/tasks`);
    return response.data
}

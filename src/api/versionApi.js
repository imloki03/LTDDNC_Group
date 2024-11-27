import axios from 'axios';
import { API_URL } from '../constants/constants';

export const VersionRequest = (name, description, targetedTaskList) => ({
    name,
    description,
    targetedTaskList,
});

export const createVersion = async (projectId, versionRequest) => {
    try {
        const response = await axios.post(`${API_URL}version/project/${projectId}`, versionRequest);
        return response.data;
    } catch (error) {
        console.error('Error creating version:', error);
        throw error;
    }
};

export const editVersion = async (id, versionRequest) => {
    try {
        const response = await axios.put(`${API_URL}version/${id}`, versionRequest);
        return response.data;
    } catch (error) {
        console.error('Error editing version:', error);
        throw error;
    }
};

export const deleteVersion = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}version/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting version:', error);
        throw error;
    }
};

export const getVersionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}version/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving version by ID:', error);
        throw error;
    }
};

export const getVersionsByProject = async (projectId) => {
    try {
        const response = await axios.get(`${API_URL}version/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving versions by project:', error);
        throw error;
    }
};

export const getAvailableTasksInPhase = async (phaseId) => {
    try {
        const response = await axios.get(`${API_URL}version/phase/${phaseId}/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving versions by project:', error);
        throw error;
    }
};

export const getAvailableTasksInBacklog = async (projectId) => {
    try {
        const response = await axios.get(`${API_URL}version/project/${projectId}/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving tasks by backlog in project:', error);
        throw error;
    }
};

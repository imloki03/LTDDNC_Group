import axios from 'axios';
import { API_URL } from '../constants/constants';

export const createNewPhase = async (projectId, phaseRequest) => {
    const response = await axios.post(`${API_URL}phase/${projectId}`, phaseRequest);
    return response.data;
};

export const getPhase = async (projectId, phaseId) => {
    const response = await axios.get(`${API_URL}phase/${projectId}/${phaseId}`);
    return response.data;
};

export const getAllPhases = async (projectId) => {
    const response = await axios.get(`${API_URL}phase/${projectId}`);
    return response.data.data;
};

export const getAllTasksInPhase = async (projectId, phaseId) => {
    const response = await axios.get(`${API_URL}phase/${projectId}/${phaseId}/tasks`);
    return response.data.data;
};

export const updatePhase = async (projectId, phaseId, updatePhaseRequest) => {
    const response = await axios.put(`${API_URL}phase/${projectId}/${phaseId}`, updatePhaseRequest);
    return response.data;
};

export const deletePhase = async (projectId, phaseId) => {
    const response = await axios.delete(`${API_URL}phase/${projectId}/${phaseId}`);
    return response.data;
};

export const assignTask = async (projectId, phaseId, taskId, assigneeUsername) => {
    const response = await axios.patch(`${API_URL}phase/${projectId}/${phaseId}/${taskId}/assign/${assigneeUsername}`);
    return response.data;
};

export const updateTaskStatus = async (projectId, phaseId, taskId, status) => {
    const response = await axios.patch(`${API_URL}phase/${projectId}/${phaseId}/${taskId}/status/${status}`);
    return response.data;
};

export const moveTaskToBacklog = async (projectId, phaseId, taskId) => {
    const response = await axios.patch(`${API_URL}phase/${projectId}/${phaseId}/backlog/${taskId}`);
    return response.data;
};
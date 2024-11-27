import axios from 'axios';
import {API_URL} from '../constants/constants'

export const createProject = async (projectOwner, name, des) => {
    const response = await axios.post(`${API_URL}project/${projectOwner}?name=${name}&description=${des}`);
    return response.data
}

export const getProject = async (projectOwner, projectId) => {
    const response = await axios.get(`${API_URL}project/${projectOwner}/${projectId}`);
    return response.data;
};

export const getAllProjects = async (projectOwner) => {
    const response = await axios.get(`${API_URL}project/${projectOwner}`);
    return response.data;
};

export const updateProjectAvatar = async (projectId, imageUrl) => {
    const response = await axios.patch(`${API_URL}project/${projectId}`, { imageUrl });
    return response.data;
};

export const updateProjectInformation = async (projectId, projectInfo) => {
    const response = await axios.put(`${API_URL}project/${projectId}`, projectInfo);
    return response.data;
};

export const deleteProject = async (projectId) => {
    const response = await axios.delete(`${API_URL}project/${projectId}`);
    return response.data;
};
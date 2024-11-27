import axios from 'axios';
import { API_URL } from '../constants/constants';

const sortTasksByHierarchy = (tasks) => {
    const taskMap = new Map();
    tasks.forEach(task => taskMap.set(task.id, task));
  
    const result = [];

    const addTaskWithSubtasks = (task) => {
      result.push(task);
      task.subTaskIds.forEach(subTaskId => {
        const subTask = taskMap.get(subTaskId);
        if (subTask) {
          addTaskWithSubtasks(subTask);
        }
      });
    };

    tasks.forEach(task => {
      if (!task.parentTaskId) {
        addTaskWithSubtasks(task);
      }
    });
  
    return result;
  };

export const createTask = async (projectId, taskRequest) => {
    const response = await axios.post(`${API_URL}backlog/${projectId}`, taskRequest);
    return response.data;
};

export const getTask = async (projectId, taskId) => {
    const response = await axios.get(`${API_URL}backlog/${projectId}/${taskId}`);
    return response.data.data;
};

export const getAllTasks = async (projectId) => {
    const response = await axios.get(`${API_URL}backlog/${projectId}`);
    let tasks = sortTasksByHierarchy(response.data.data)
    return tasks;
};

export const updateTask = async (projectId, taskId, updateTaskRequest) => {
    const response = await axios.put(`${API_URL}backlog/${projectId}/${taskId}`, updateTaskRequest);
    return response.data;
};

export const moveTaskToPhase = async (taskId, phaseId) => {
    const response = await axios.patch(`${API_URL}backlog/${taskId}/${phaseId}`);
    return response.data;
};

export const deleteTask = async (taskId) => {
    const response = await axios.delete(`${API_URL}backlog/${taskId}`);
    return response.data;
};

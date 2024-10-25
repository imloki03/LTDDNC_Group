import axios from 'axios';
import {API_URL} from '../constants/constants'

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
};
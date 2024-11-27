import axios from 'axios';
import { API_URL } from '../constants/constants';

export const TagResponse = (id, name, type, description) => ({
    id,
    name,
    type,
    description,
});

export const getAllTags = async () => {
    const response = await axios.get(`${API_URL}tag`);
    return response.data;
};


import axios from 'axios';
import {API_URL} from '../constants/constants'
import * as Yup from 'yup';

export const RegisterRequest = (username, name, email, password, gender) => ({
    username,
    name,
    email,
    password,
    gender,
});

export const EditProfileRequest = (name, gender, tagList) => ({
    name,
    gender,
    tagList,
});

export const EditUserAvatarRequest = (avatarURL) => ({
    avatarURL,
});


export const registerValidationSchema = Yup.object().shape({
    username: Yup.string().matches(/^[a-z0-9._]+$/, 'Username can only contain lowercase letters, numbers, dots, or underscores')
            .required('Username is required'),
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid gender').required('Gender is required'),
});

export const editProfileValidationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    gender: Yup.string()
        .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
        .required('Gender is required'),
});

export const register = async (registerRequest) => {
    const response = await axios.post(`${API_URL}user`, registerRequest);
    return response.data;
};

export const editProfile = async (username, editProfileRequest) => {
    const response = await axios.put(`${API_URL}user/${username}`, editProfileRequest);
    return response.data;
};

export const updateAvatar = async (username, editAvatarRequest) => {
    const response = await axios.put(`${API_URL}user/ava/${username}`, editAvatarRequest);
    return response.data;
};

export const getUserInfo = async (username) => {
    const response = await axios.get(`${API_URL}user/${username}`);
    return response.data;
};

export const changePassword = async (username, changePasswordRequest) => {
    const response = await axios.patch(`${API_URL}user/${username}`, changePasswordRequest);
    return response.data;
};

export const activateUser = async (username) => {
    const response = await axios.patch(`${API_URL}user/${username}/activate`);
    return response.data;
};
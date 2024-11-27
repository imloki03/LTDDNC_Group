import axios from 'axios';
import { API_URL } from '../constants/constants';

export const sendOtp = async (email) => {
    try {
        const response = await axios.post(`${API_URL}otp/send/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};

export const verifyOtp = async (email, otp) => {
    const response = await axios.post(`${API_URL}otp/verify/${email}/${otp}`);
    return response.data;
};

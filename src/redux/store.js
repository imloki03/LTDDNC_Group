import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import renderReducer from './slices/renderSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    render: renderReducer,
  },
});

export default store;
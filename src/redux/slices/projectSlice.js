import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    createProject,
    getProject,
    getAllProjects,
    updateProjectAvatar,
    updateProjectInformation,
    deleteProject
} from '../../api/projectApi';

export const createNewProject = createAsyncThunk(
    'project/createNewProject',
    async ({ projectOwner, name, description }) => {
        const response = await createProject(projectOwner, name, description);
        return response;
    }
);

export const fetchProject = createAsyncThunk(
    'project/fetchProject',
    async ({ projectOwner, projectId }) => {
        const response = await getProject(projectOwner, projectId);
        return response;
    }
);

export const fetchAllProjects = createAsyncThunk(
    'project/fetchAllProjects',
    async (projectOwner) => {
        const response = await getAllProjects(projectOwner);
        return response;
    }
);

export const updateProjectImage = createAsyncThunk(
    'project/updateProjectImage',
    async ({ projectId, imageUrl }) => {
        const response = await updateProjectAvatar(projectId, imageUrl);
        return response;
    }
);

export const updateProjectInfo = createAsyncThunk(
    'project/updateProjectInfo',
    async ({ projectId, projectInfo }) => {
        const response = await updateProjectInformation(projectId, projectInfo);
        return response;
    }
);

export const removeProject = createAsyncThunk(
    'project/removeProject',
    async (projectId) => {
        const response = await deleteProject(projectId);
        return response;
    }
);

const projectSlice = createSlice({
    name: 'project',
    initialState: {
        currentProject: null,
        allProjects: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        updateCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        },
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewProject.fulfilled, (state, action) => {
                state.currentProject = action.payload.data;
                state.allProjects.push(action.payload.data);
                state.status = 'succeeded';
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.currentProject = action.payload.data;
                state.status = 'succeeded';
            })
            .addCase(fetchAllProjects.fulfilled, (state, action) => {
                state.allProjects = action.payload.data;
                state.status = 'succeeded';
            })
            .addCase(updateProjectImage.fulfilled, (state, action) => {
                if (state.currentProject && state.currentProject.id === action.meta.arg.projectId) {
                    state.currentProject.imageUrl = action.meta.arg.imageUrl;
                }
                state.status = 'succeeded';
            })
            .addCase(updateProjectInfo.fulfilled, (state, action) => {
                if (state.currentProject && state.currentProject.id === action.meta.arg.projectId) {
                    state.currentProject = { ...state.currentProject, ...action.meta.arg.projectInfo };
                }
                state.status = 'succeeded';
            })
            .addCase(removeProject.fulfilled, (state, action) => {
                state.allProjects = state.allProjects.filter(project => project && project.id !== action.meta.arg);
                // if (state.currentProject && state.currentProject.id === action.meta.arg) {
                //     state.currentProject = null;
                // }
                state.status = 'succeeded';
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message;
                }
            );
    },
});

export const { clearCurrentProject, updateCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;

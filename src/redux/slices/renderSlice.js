import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isRender: new Date().getTime().toString(),
};

const renderSlice = createSlice({
    name: 'render',
    initialState,
    reducers: {
        updateRender: (state) => {
            state.isRender = new Date().getTime().toString();
            console.log(state.isRender);
        },
    },
});

export const { updateRender } = renderSlice.actions;
export default renderSlice.reducer;

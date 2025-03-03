import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        email: '',
        username: '',
        password: '',
    }
};

export const usersSlice = createSlice({
    name: 'users',


    initialState,
    reducers: {
        addUserToStore: (state, action) => {
            state.value = action.payload;
        },
    },

});

export const { addUserToStore } = usersSlice.actions;
export default usersSlice.reducer;

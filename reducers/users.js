import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        token: '',
    }
};


export const usersSlice = createSlice({
    name: 'users',

    initialState,
    reducers: {
        addUserToStore: (state, action) => {
            state.value = action.payload;
        },
        userLogout: (state) => {
            state.value.token = '';
        }
    },

});

export const { addUserToStore, userLogout } = usersSlice.actions;
export default usersSlice.reducer;

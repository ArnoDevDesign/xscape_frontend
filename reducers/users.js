import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        token: '',
        avatar: '',
        username: '',
        scenario: '',
    }
};
///////////////////////////////////////////DISPATCH NOM SCENARIO AU CLICK SUR MODAL SELECTIONNEEE DANS GEOLOC //////////////////////////////////////////////////////////////

export const usersSlice = createSlice({
    name: 'users',

    initialState,
    reducers: {
        addUserToStore: (state, action) => {
            console.log("payload ind redux", action.payload);

            state.value = { ...state.value, ...action.payload };
        },
        userLogout: (state) => {
            state.value.token = '';
        }
    },

});

export const { addUserToStore, userLogout } = usersSlice.actions;
export default usersSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        token: '',
        avatar: '',
        username: '',
        scenario: 'La Capsule Perdue',
        userID: '67c5fc2b16905edcd7e37291',
        scenarioID: '67c89b3211fe5eeab54f1ecb',
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
            state.value.token = '';// rappel il faut supprimer le token dans la BDD
        },
    },

});

export const { addUserToStore, userLogout } = usersSlice.actions;
export default usersSlice.reducer;

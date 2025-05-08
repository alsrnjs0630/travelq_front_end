import { createSlice } from "@reduxjs/toolkit";

interface LoginState {
    value: string;
}

const initialState: LoginState = {
    value: "guest"
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loggedIn: (state) => {
            state.value = "auth"
        },
        loggedOut: (state) => {
            state.value = "guest"
        }
    },
});

export const {loggedIn, loggedOut} = loginSlice.actions;
export default loginSlice.reducer;
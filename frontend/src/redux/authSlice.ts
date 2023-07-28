// src/redux/authSlice.ts
import {createAsyncThunk, createSlice, PayloadAction, SerializedError} from '@reduxjs/toolkit';
import axios from "./axiosConfig";

// 로그인 액션
export const loggedIn = createAsyncThunk('auth/login', async ({id, password}: { id: string; password: string }) => {
    const response = await axios.post('/api/auth', {id: id, password: password});
    localStorage.setItem('token', response.data);
    return response.data;
})

// 로그아웃 액션
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
    return null;
})

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: SerializedError | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    isLoading: true, // isLoading 추가
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loggedIn.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loggedIn.rejected, (state, action: any) => {
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.error.message;
                state.isLoading = false;
            });
    }
});

export default authSlice.reducer;

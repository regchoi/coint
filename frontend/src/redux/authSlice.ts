// src/redux/authSlice.ts
import {createAsyncThunk, createSlice, PayloadAction, SerializedError} from '@reduxjs/toolkit';
import axios from "axios";

const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // 서버 주소 - .env 파일에 정의
    timeout: 5000,
});

// 로그인 액션
export const loggedIn = createAsyncThunk('auth/login', async ({id, password}: { id: string; password: string }) => {
    // response의 header에 있는 Authorization 값이 token
    // Authorization의 Bearer: token 형식으로 전달됨
    const response = await authAxios.post('/api/auth', {email: id, password: password});
    const token = response.headers.authorization.split(' ')[1];
    localStorage.setItem('token', token);
    return {token};
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

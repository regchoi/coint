// src/redux/chartSlice.ts
import {createAsyncThunk, createSlice, PayloadAction, SerializedError} from '@reduxjs/toolkit';
import axios from "./axiosConfig";

interface chartState {
    data: any[];
    loading: boolean;
    error: SerializedError | null;
}

const initialState: chartState = {
    data: [],
    loading: true, // isLoading 추가
    error: null,
};

export const fetchChartData = createAsyncThunk(
    'chart/fetchChartData',
    async (apiUrl: string) => {
        const response = await axios.get(apiUrl);
        return response.data;
    }
);

const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchChartData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchChartData.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchChartData.rejected, (state, action) => {
            state.error = action.error;
            state.loading = false;
        });
    }
});

export default chartSlice.reducer;

// tableSlice.ts
import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import axios from './axiosConfig';

// 서버로부터 테이블 데이터를 가져오는 비동기 액션
export const fetchTableData = createAsyncThunk('table/fetchData', async (apiUrl: string) => {
    const response = await axios.get(apiUrl);
    return response.data;
});

// 서버에 테이블 데이터를 추가하는 비동기 액션
export const addTableData = createAsyncThunk('table/addData',
    async ({apiUrl, data}: {apiUrl: string, data: any[]}) => {
        console.log(data);
        const response = await axios.post(apiUrl, data);
        return response.data;
    });

// 서버에 테이블 데이터를 업데이트하는 비동기 액션
export const updateTableData = createAsyncThunk('table/updateData',
    async ({apiUrl, data}: {apiUrl: string, data: any[]}) => {
        const response = await axios.put(apiUrl, data);
        return response.data;
    });

// 서버에 테이블 데이터를 삭제하는 비동기 액션
export const deleteTableData = createAsyncThunk(
    'table/deleteData',
    async ({ apiUrl, ids }: { apiUrl: string; ids: number[] }) => {
        const response = await axios.post(`${apiUrl}/delete`, ids);
        return response.data;
    }
);

// 초기 상태 타입
interface TableState {
    data: any[];
    loading: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: SerializedError | null;
}

// 초기 상태 값
const initialState: TableState = {
    data: [],
    loading: 'idle',
    error: null
};

// 슬라이스 생성
export const subTableSlice2 = createSlice({
    name: 'table',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // 서버로부터 테이블 데이터를 가져오는 비동기 액션
            .addCase(fetchTableData.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(fetchTableData.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchTableData.rejected, (state, action: any) => {
                state.loading = 'failed';
                state.error = action.error;
            })
            // 서버에 테이블 데이터를 추가하는 비동기 액션
            .addCase(addTableData.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(addTableData.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = 'succeeded';
            })
            .addCase(addTableData.rejected, (state, action: any) => {
                state.loading = 'failed';
                state.error = action.error;
            })
            // 서버에 테이블 데이터를 업데이트하는 비동기 액션
            .addCase(updateTableData.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(updateTableData.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = 'succeeded';
            })
            .addCase(updateTableData.rejected, (state, action: any) => {
                state.loading = 'failed';
                state.error = action.error;
            })
            // 서버에 테이블 데이터를 삭제하는 비동기 액션
            .addCase(deleteTableData.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(deleteTableData.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = 'succeeded';
            })
            .addCase(deleteTableData.rejected, (state, action: any) => {
                state.loading = 'failed';
                state.error = action.error;
            })
    }
});

export default subTableSlice2.reducer;
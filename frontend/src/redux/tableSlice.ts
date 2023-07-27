// tableSlice.ts
import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import axios from './axiosConfig';
import { Data } from '../components/SampleTable/data';

// 서버로부터 테이블 데이터를 가져오는 비동기 액션
export const fetchTableData = createAsyncThunk('table/fetchData', async (apiUrl: string) => {
    const response = await axios.get(apiUrl);
    return response.data;
});

// 서버에 테이블 데이터를 추가하는 비동기 액션
export const addTableData = createAsyncThunk('table/addData',
    async ({apiUrl, data}: {apiUrl: string, data: Data[]}) => {
    // TODO: id_num을 서버에서 생성하도록 수정
    const response = await axios.post(apiUrl, data);

    if(response.data !== 'SUCCESS') {
        throw new Error('Failed to add data');
    }

    const getData = await axios.get(apiUrl);
    return getData.data;
});

// 서버에 테이블 데이터를 업데이트하는 비동기 액션
export const updateTableData = createAsyncThunk('table/updateData',
    async ({apiUrl, data}: {apiUrl: string, data: Data[]}) => {
        const response = await axios.put(apiUrl, data);

        if(response.data !== 'SUCCESS') {
            throw new Error('Failed to add data');
        }

        const getData = await axios.get(apiUrl);
        return getData.data;
});

// 서버에 테이블 데이터를 삭제하는 비동기 액션
export const deleteTableData = createAsyncThunk(
    'table/deleteData',
    async ({ apiUrl, ids }: { apiUrl: string; ids: number[] }) => {
        // TODO: Batch API를 활용하여 서버에서 일괄적으로 데이터를 받아 처리하는 방법으로 수정
        const response = await axios.post(`${apiUrl}/delete`, ids);

        if(response.data !== 'SUCCESS') {
            throw new Error('Failed to add data');
        }

        const getData = await axios.get(apiUrl);
        return getData.data;
        try {
                await axios.delete(`${apiUrl}`, {data: ids});

            // 삭제 처리가 완료된 후에 서버로부터 업데이트된 전체 데이터를 가져옵니다.
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (error) {
            // TODO: 에러 처리
            console.error('Error while deleting data:', error);
            throw error;
        }
    }
);

// 초기 상태 타입
interface TableState {
    data: Data[];
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
export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // 서버로부터 테이블 데이터를 가져오는 비동기 액션
            .addCase(fetchTableData.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(fetchTableData.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.loading = 'succeeded';
                state.data = action.payload;
            })
            // 서버에 테이블 데이터를 추가하는 비동기 액션
            .addCase(addTableData.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(addTableData.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.loading = 'succeeded';
                state.data = state.data.concat(action.payload);
            })
            // 서버에 테이블 데이터를 업데이트하는 비동기 액션
            .addCase(updateTableData.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(updateTableData.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.loading = 'succeeded';
                state.data = action.payload;
            })
    }
});

export default tableSlice.reducer;
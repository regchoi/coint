// tabSlice.ts
import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';

// 초기 상태 타입
interface TabState {
    name: string;
    path: string;
    active: boolean;
}

// 초기 상태 값
const initialState: TabState[] = [];

// 슬라이스 생성
export const tabSlice = createSlice({
    name: 'tab',
    initialState,
    reducers: {
        // 탭을 추가하거나 활성화하는 액션
        addOrActivateTab: (state, action: PayloadAction<TabState>) => {
            const tabIndex = state.findIndex(tab => tab.path === action.payload.path);

            if (tabIndex === -1) {
                // 새 탭 추가
                state.push({...action.payload, active: true});
            } else {
                // 모든 탭의 활성화 상태를 false로 설정
                state.forEach(tab => tab.active = false);
                // 선택한 탭만 활성화
                state[tabIndex].active = true;
            }
        }
    }
});

// 액션 생성자
export const { addOrActivateTab } = tabSlice.actions;

export default tabSlice.reducer;
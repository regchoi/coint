// src/redux/store.ts
import {Action, configureStore, ThunkAction, ThunkDispatch} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tableReducer from './tableSlice';
import chartReducer from './chartSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

// AppThunk라는 타입을 만들어서 사용
// AppTHunk: redux-thunk 미들웨어를 사용하기 위한 타입, 비동기 액션을 생성하는 함수에서 반환하는 액션 객체의 타입을 정확하게 표현가능


export const store = configureStore({
    reducer: {
        auth: authReducer,
        table: tableReducer,
        chart: chartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
// AppDispatch를 ThunkDispatch로 확장
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
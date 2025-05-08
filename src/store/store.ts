import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './loginSlice';

export const store = configureStore({
    reducer: {
        loginState: loginReducer,
    },
});

// 타입 정의 (Next.js + TS에서 필수)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
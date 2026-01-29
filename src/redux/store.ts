import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './features/searchSlice'

export const store = configureStore({
    reducer: {
        search: searchReducer,
    }
})
// 1. Get the RootState type (This will look like: { search: SearchState })
export type RootState = ReturnType<typeof store.getState>;

// 2. Get the Dispatch type (Useful if you use Thunks later)
export type AppDispatch = typeof store.dispatch;
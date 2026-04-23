import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './features/searchSlice'
import { mediaApi } from "./services/mediaApi";

export const store = configureStore({
    reducer: {
        search: searchReducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(mediaApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: {
        query: '',
        activeTab: 'photos',
        results: [],
        loading: false,
        error: null,
        page: 1,
        hasMore: true
    },
    reducers: {
        setQuery(state, action) {
            state.query = action.payload;
            state.page = 1;
            state.results = [];
            state.hasMore = true;
        },
        setActiveTabs(state, action) {
            state.activeTab = action.payload;
            state.page = 1;
            state.results = []; // Clear results to avoid mixing types
            state.hasMore = true;
        },
        setResults(state, action) {
            state.results = action.payload;
            state.loading = false;
        },
        appendResults(state, action) {
            // Filter duplicates based on ID to prevent React key errors
            const newItems = action.payload.filter(
                newItem => !state.results.some(existing => existing.id === newItem.id)
            );
            state.results = [...state.results, ...newItems];
            state.loading = false;
            state.hasMore = action.payload.length > 0;
        },
        setLoading(state) {
            state.loading = true;
            state.error = null;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        incrementPage(state) {
            state.page += 1;
        }
    }
})

export const {
    setQuery,
    setActiveTabs,
    setError,
    setLoading,
    setResults,
    appendResults,
    incrementPage
} = searchSlice.actions

export default searchSlice.reducer
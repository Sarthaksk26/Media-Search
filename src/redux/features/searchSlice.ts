import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SearchResult{
    id: string;
    type: 'video' | 'photo' | string; 
    src: string;
    title: string;
    thumbnail?: string;
    [key: string]: any;
}

export interface SearchState{
    query : string;
    activeTab: string;
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}
const initialState:SearchState = {
    query: '',
    activeTab: 'photos',
    results: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true
}

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
            state.page = 1;
            state.results = [];
            state.hasMore = true;
        },
        setActiveTabs(state, action: PayloadAction<string>) {
            state.activeTab = action.payload;
            state.page = 1;
            state.results = []; // Clear results to avoid mixing types
            state.hasMore = true;
        },
        setResults(state, action: PayloadAction<SearchResult[]>) {
            state.results = action.payload;
            state.loading = false;
        },
        appendResults(state, action: PayloadAction<SearchResult[]>) {
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
        setError(state, action: PayloadAction<string>) {
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
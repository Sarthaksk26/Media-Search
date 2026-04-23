import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  query: string;
  activeTab: 'photos' | 'videos' | 'gif';
  page: number;
}

const initialState: SearchState = {
  query: '',
  activeTab: 'photos',
  page: 1,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.page = 1;
    },
    setActiveTabs(state, action: PayloadAction<'photos' | 'videos' | 'gif'>) {
      state.activeTab = action.payload;
      state.page = 1;
    },
    incrementPage(state) {
      state.page += 1;
    },
    resetSearch(state) {
      state.page = 1;
    }
  }
});

export const {
  setQuery,
  setActiveTabs,
  incrementPage,
  resetSearch
} = searchSlice.actions;

export default searchSlice.reducer;
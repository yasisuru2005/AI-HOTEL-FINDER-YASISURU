import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchMode: false,
  query: "",
  results: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchMode(state, action) {
      state.searchMode = action.payload;
      if (!action.payload) {
        state.query = "";
        state.results = [];
      }
    },
    setSearchQuery(state, action) {
      state.query = action.payload || "";
    },
    setSearchResults(state, action) {
      state.results = Array.isArray(action.payload) ? action.payload : [];
    },
    clearSearch(state) {
      state.searchMode = false;
      state.query = "";
      state.results = [];
    },
  },
});

export const { setSearchMode, setSearchQuery, setSearchResults, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

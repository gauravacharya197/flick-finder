import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  movies: [],
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setMovies(state, action) {
      state.movies = action.payload;
    },
    resetState(state) {
      state.search = "";
      state.movies = [];
    },
  },
});

export const { setSearch, setMovies, resetState } = movieSlice.actions;
export default movieSlice.reducer;

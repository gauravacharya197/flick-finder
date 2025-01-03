import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    genres: [],
    countries: [],
    languages: [],
  },
  reducers: {
    setFilters: (state, action) => {
      state.genres = action.payload.genres;
      state.countries = action.payload.countries;
      state.languages = action.payload.languages;
    },
  },
});

export const { setFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

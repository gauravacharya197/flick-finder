import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    genres: [],
    mediaCategories:[]
    
  },
  reducers: {
    setFilters: (state, action) => {
      state.genres = action.payload.genres;
      state.mediaCategories= action.payload.mediaCategories;
      
    },
  },
});

export const { setFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

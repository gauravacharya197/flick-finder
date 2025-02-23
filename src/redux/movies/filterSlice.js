import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    genres: [],
    
  },
  reducers: {
    setFilters: (state, action) => {
      state.genres = action.payload.genres;
      
    },
  },
});

export const { setFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

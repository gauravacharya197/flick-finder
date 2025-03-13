import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  query: string;
  countries: string;
  genres: string;
  years: string;
  mediaType : string;
  sortBy: string;
}

const initialState: FilterState = {
  query: '',
  countries: '',
  genres:'',
  years: '',
  mediaType:'All',
  sortBy : '',
};

const advanceSearchSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setCountries: (state, action: PayloadAction<string>) => {
      state.countries = action.payload;
    },
    setGenres: (state, action: PayloadAction<string>) => {
      state.genres = action.payload;
    },
    setYears: (state, action: PayloadAction<string>) => {
      state.years = action.payload;
    },
    setMediaType: (state, action: PayloadAction<string>) => {
      state.mediaType = action.payload;
    },
   
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    clearAllFilters: (state) => {
      // Reset all filter values to initial state
      // Keep the query if needed, or reset it too
      state.countries = '';
      state.genres = '';
      state.years = '';
      state.mediaType = 'All';
      state.sortBy = '';
    },
  },
});

export const {
  setQuery,
  setCountries,
  setGenres,
  setYears,
  setSortBy,
  setMediaType,
  clearAllFilters
} = advanceSearchSlice.actions;

export default advanceSearchSlice.reducer;
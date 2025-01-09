import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  query: string;
  countries: string;
  genres: string;
  years: string;
  mediaType : string;
  imdbRating: [number, number];
}

const initialState: FilterState = {
  query: '',
  countries: '',
  genres:'',
  years: '',
  mediaType:'All',
  imdbRating: [0, 0],
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
   
    setImdbRating: (state, action: PayloadAction<[number, number]>) => {
      state.imdbRating = action.payload;
    },
  },
});

export const {
  setQuery,
  setCountries,
  setGenres,
  setYears,
  setImdbRating,
  setMediaType
} = advanceSearchSlice.actions;

export default advanceSearchSlice.reducer;
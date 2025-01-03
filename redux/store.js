import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./movies/moviesSlice";
import filtersReducer from "./movies/filterSlice";
const store = configureStore({
  reducer: {
    movie: movieReducer,
    filters: filtersReducer,
  },
});

export default store;

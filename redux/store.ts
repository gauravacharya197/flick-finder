import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./movies/moviesSlice";
import filtersReducer from "./movies/filterSlice";
import advanceSearchReducer from "./movies/advanceSearchSlice"
const store = configureStore({
  reducer: {
    movie: movieReducer,
    filters: filtersReducer,
    advanceSearch : advanceSearchReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

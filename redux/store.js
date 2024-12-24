import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./movies/moviesSlice";

const store = configureStore({
  reducer: {
    movie: movieReducer,
  },
});

export default store;

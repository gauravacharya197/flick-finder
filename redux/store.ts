import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./movies/filterSlice";
import advanceSearchReducer from "./movies/advanceSearchSlice"
const store = configureStore({
  reducer: {
    filters: filtersReducer,
    advanceSearch : advanceSearchReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

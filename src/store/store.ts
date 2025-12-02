import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleSlice";
import signupReducer from "./slices/signupSlice";

const store = configureStore({
  reducer: {
    example: exampleReducer,
    signup: signupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

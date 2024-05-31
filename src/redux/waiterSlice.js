import { createSlice } from "@reduxjs/toolkit";

const waiterSlice = createSlice({
  name: "waiter",
  initialState: [],
  reducers: {
    setWaiters(state, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = waiterSlice;
export const { setWaiters } = actions;
export default reducer;

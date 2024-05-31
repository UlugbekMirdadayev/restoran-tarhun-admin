import { createSlice } from "@reduxjs/toolkit";

const measurementSlice = createSlice({
  name: "measurements",
  initialState: [],
  reducers: {
    setMeasurements(_, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = measurementSlice;
export const { setMeasurements } = actions;
export default reducer;

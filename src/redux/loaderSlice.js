import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: false,
  reducers: {
    setLoader(_, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = loaderSlice;
export const { setLoader } = actions;
export default reducer;

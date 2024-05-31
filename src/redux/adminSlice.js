import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "admin",
  initialState: [],
  reducers: {
    setAdmins(_, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = loaderSlice;
export const { setAdmins } = actions;
export default reducer;

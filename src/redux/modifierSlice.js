import { createSlice } from "@reduxjs/toolkit";

const modifierSlice = createSlice({
  name: "modifier",
  initialState: [],
  reducers: {
    setModifiers(_, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = modifierSlice;
export const { setModifiers } = actions;
export default reducer;

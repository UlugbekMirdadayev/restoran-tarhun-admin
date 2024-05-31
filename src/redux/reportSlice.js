import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
  name: "report",
  initialState: {},
  reducers: {
    setReport(_, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = reportSlice;
export const { setReport } = actions;
export default reducer;

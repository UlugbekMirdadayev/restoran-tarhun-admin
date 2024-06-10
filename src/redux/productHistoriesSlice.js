import { createSlice } from "@reduxjs/toolkit";

const productHistoriesSlice = createSlice({
  name: "productHistories",
  initialState: {},
  reducers: {
    setProductHistories(_, { payload }) {
      return payload;
    },
  },
});

const { actions, reducer } = productHistoriesSlice;
export const { setProductHistories } = actions;
export default reducer;

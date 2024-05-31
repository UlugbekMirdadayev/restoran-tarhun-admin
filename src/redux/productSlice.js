import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    setProducts(_, { payload }) {
      return payload;
    },
  },
});

const { actions, reducer } = productSlice;
export const { setProducts } = actions;
export default reducer;

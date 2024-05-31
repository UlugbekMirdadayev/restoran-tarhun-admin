import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("user-admin-restoran")) || {},
  reducers: {
    setUser(_, { payload }) {
      localStorage.setItem("user-admin-restoran", JSON.stringify(payload));
      return payload;
    },
  },
});

const { actions, reducer } = postsSlice;
export const { setUser } = actions;
export default reducer;

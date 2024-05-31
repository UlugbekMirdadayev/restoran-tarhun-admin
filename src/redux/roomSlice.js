import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "rooms",
  initialState: [],
  reducers: {
    setRooms(state, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = roomSlice;
export const { setRooms } = actions;
export default reducer;

import { UserState } from "@/types/api/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      Object.assign(state, action.payload);
    },
    clearUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

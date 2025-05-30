import { UserState } from '@/types/api/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
    },
    clearUser(state) {
      state.id = undefined;
      state.email = undefined;
      state.role = undefined;
      state.accessToken = undefined;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

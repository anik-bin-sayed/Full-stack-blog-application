import { createSlice } from "@reduxjs/toolkit";

type ProfileState = {
  user: any | null;
  cachedAt: number | null;
};

const initialState: ProfileState = {
  user: null,
  cachedAt: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserCache: (state, action) => {
      state.user = action.payload;
      state.cachedAt = Date.now();
    },
    clearCache: (state) => {
      state.user = null;
      state.cachedAt = null;
    },
  },
});

export const { setUserCache, clearCache } = profileSlice.actions;
export default profileSlice.reducer;

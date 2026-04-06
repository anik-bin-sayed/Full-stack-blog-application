import { createSlice } from "@reduxjs/toolkit";

interface Profile {
  id: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string | null;
  date_of_birth?: string | null;
}

interface ProfileImage {
  id: number;
  image: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  profile: Profile | null;
  profile_images: ProfileImage[];
}

interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

interface ProfileState {
  users: User[];
  count: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  users: [],
  count: 0,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setAllUserData: (state, action: { payload: UsersResponse }) => {
      state.users = action.payload.results;
      state.count = action.payload.count;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setAllUserData } = profileSlice.actions;
export default profileSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Blog {
  id: number;
  title: string;
  content: string;
}

interface BlogState {
  blog: Blog[];
  isLoading: boolean;
}

const initialState: BlogState = {
  blog: [],
  isLoading: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogData: (state, action: PayloadAction<Blog[]>) => {
      state.blog = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setBlogData, setLoading } = blogSlice.actions;
export default blogSlice.reducer;

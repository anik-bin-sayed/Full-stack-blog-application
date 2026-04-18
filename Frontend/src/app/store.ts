import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import blogReducer from "../features/blogs/blogSlice";
import profileReducer from "../features/profile/profileSlice";
import { profileApi } from "../features/profile/profileApi";
import { blogDataApi } from "../features/blogs/blogApi";
import { notificationsApi } from "../features/notifications/notificationApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [blogDataApi.reducerPath]: blogDataApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    auth: authReducer,
    profile: profileReducer,
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(blogDataApi.middleware)
      .concat(notificationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

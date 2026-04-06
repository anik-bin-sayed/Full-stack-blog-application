import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Navbar from "../components/Navbar";

import { useAppSelector } from "../redux/hooks";
import Loader from "../components/Loader";
import Home from "../pages/Blog/Home";
import Blogs from "../pages/Blog/Blogs";
import AuthorProfile from "../pages/Blog/AuthorProfile";
import UserProfile from "../pages/profile/UserProfile";
import { useRefreshTokenMutation } from "../features/auth/authApi";
import {
  startTokenRefreshTimer,
  isAuthCookieValid,
} from "../features/auth/authPersist";
import Bloggers from "../pages/Blog/BloggersPage";
import UserProfileEdit from "../pages/profile/UserProfileEdit";
import CreateBlogPage from "../pages/Blog/CreateBlogPage";

const Index = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const shouldRefresh = isAuthCookieValid();
    if (shouldRefresh && !isAuthenticated) {
      refreshToken(undefined).catch(() => {});
    }
  }, [refreshToken]);

  useEffect(() => {
    if (isAuthenticated) {
      const store = (window as any).__REDUX_STORE__;
      if (store) {
        startTokenRefreshTimer(() => refreshToken(undefined), store.getState);
      }
    }
  }, [isAuthenticated, refreshToken]);

  // if (isLoading) return <Loader />;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/bloggers" element={<Bloggers />} />
        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/profile" element={<UserProfile />}>
          <Route path="edit" element={<UserProfileEdit />} />
        </Route>
        <Route path="/create-blog" element={<CreateBlogPage />} />
      </Routes>
    </Router>
  );
};

export default Index;

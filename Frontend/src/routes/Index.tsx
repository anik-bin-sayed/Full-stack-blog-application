import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";

import { useAppSelector } from "../redux/hooks";
import Home from "../pages/Blog/Home";
import Blogs from "../pages/Blog/Blogs";
import AuthorProfile from "../pages/Blog/AuthorProfile";
import UserProfile from "../pages/profile/UserProfile";
import { useRefreshTokenMutation } from "../features/auth/authApi";
import {
  startTokenRefreshTimer,
  isAuthCookieValid,
} from "../features/auth/authPersist";
import UserProfileEdit from "../pages/profile/UserProfileEdit";
import CreateBlogPage from "../pages/Blog/CreateBlogPage";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import BloggersPage from "../pages/Blog/BloggersPage";

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
        <Route path="/bloggers" element={<BloggersPage />} />
        <Route path="/bloggers/:id" element={<AuthorProfile />} />
        <Route path="/profile" element={<UserProfile />}>
          <Route path="edit" element={<UserProfileEdit />} />
        </Route>
        <Route path="/create-blog" element={<CreateBlogPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default Index;

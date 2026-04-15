import React, { lazy, Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useRefreshTokenMutation } from "../features/auth/authApi";
import {
  isAuthCookieValid,
  startTokenRefreshTimer,
  stopTokenRefreshTimer,
} from "../features/auth/authPersist";
import Navbar from "../components/layouts/Header";
import Footer from "../components/layouts/footer";
import Loader from "../components/Loader";
import { useGetMeQuery } from "../features/profile/profileApi";
import { setUserData } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MyBlog from "../pages/my-blog/MyBlog";
import BlogDetails from "../pages/Blog/BlogDetails";
import ScrollToTop from "../components/ScrollToTop";

import EditBlogPost from "../pages/Blog/EditBlogPage";
import Notification from "../pages/Notification";

// Lazy load all page components
const Register = lazy(() => import("../pages/auth/Register"));
const Login = lazy(() => import("../pages/auth/Login"));
const Home = lazy(() => import("../pages/Blog/Home"));
const Blogs = lazy(() => import("../pages/Blog/Blogs"));
const AuthorProfile = lazy(() => import("../pages/Blog/AuthorProfile"));
const UserProfile = lazy(() => import("../pages/profile/UserProfile"));
const UserProfileEdit = lazy(() => import("../pages/profile/UserProfileEdit"));
const CreateBlogPage = lazy(() => import("../pages/Blog/CreateBlogPage"));
const BloggersPage = lazy(() => import("../pages/Blog/BloggersPage"));

const Index = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    const shouldRefresh = isAuthCookieValid();
    if (shouldRefresh && !isAuthenticated) {
      refreshToken(undefined).catch(() => {});
    }
  }, [refreshToken, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      startTokenRefreshTimer(
        () => refreshToken(),
        () => ({ auth: { isAuthenticated } }),
      );
    } else {
      stopTokenRefreshTimer();
    }

    return () => stopTokenRefreshTimer();
  }, [isAuthenticated, refreshToken]);

  useEffect(() => {
    dispatch(setUserData(data));
  }, [dispatch, data]);

  const hideFooterRoutes = ["/notifications"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/bloggers" element={<BloggersPage />} />
          <Route path="/bloggers/:id" element={<AuthorProfile />} />
          <Route path="/blog/details/:slug" element={<BlogDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />}>
              <Route path="edit" element={<UserProfileEdit />} />
            </Route>
            <Route path="/blogs/edit/:slug" element={<EditBlogPost />} />
            <Route path="/blogs/create" element={<CreateBlogPage />} />
            <Route path="/my-blogs" element={<MyBlog />} />
            <Route path="/notifications" element={<Notification />} />
          </Route>
        </Routes>
      </Suspense>
      {!hideFooter && <Footer />}
    </Router>
  );
};

export default Index;

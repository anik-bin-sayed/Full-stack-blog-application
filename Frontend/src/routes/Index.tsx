import { lazy, Suspense } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Loader from "../components/Loader";
import Layout from "../components/layouts/Layout";

const Home = lazy(() => import("../pages/Blog/Home"));
const Blogs = lazy(() => import("../pages/Blog/Blogs"));
const BlogDetails = lazy(() => import("../pages/Blog/BlogDetails"));
const BloggersPage = lazy(() => import("../pages/Blog/BloggersPage"));
const AuthorProfile = lazy(() => import("../pages/Blog/AuthorProfile"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

const UserProfile = lazy(() => import("../pages/profile/UserProfile"));

const CreateBlogPage = lazy(() => import("../pages/Blog/CreateBlogPage"));
const EditBlogPost = lazy(() => import("../pages/Blog/EditBlogPage"));
const MyBlog = lazy(() => import("../pages/my-blog/MyBlog"));
const Notification = lazy(() => import("../pages/Notification"));

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const PublicRoute = lazy(() => import("./PublicRoute"));

const Index = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/bloggers" element={<BloggersPage />} />
            <Route path="/bloggers/:id" element={<AuthorProfile />} />
            <Route path="/blog/details/:slug" element={<BlogDetails />} />

            {/* Auth */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/blogs/create" element={<CreateBlogPage />} />
              <Route path="/blogs/edit/:slug" element={<EditBlogPost />} />
              <Route path="/my-blogs" element={<MyBlog />} />
              <Route path="/notifications" element={<Notification />} />
            </Route>
          </Routes>
        </Layout>
      </Suspense>
    </Router>
  );
};

export default Index;

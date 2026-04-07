import React from "react";
import { useGetUsersQuery } from "../../features/profile/profileApi";
import Bloggers from "../../components/Bloggers";

const BloggersPage = () => {
  const { data, isLoading, error } = useGetUsersQuery({ page: 1, search: "" });

  // Assuming your API returns { count, next, previous, results }
  const bloggersList = data?.results || [];

  return (
    <Bloggers
      bloggers={bloggersList}
      isLoading={isLoading}
      error={error || null}
    />
  );
};

export default BloggersPage;

import React from "react";
import { useGetUsersQuery } from "../../features/profile/profileApi";
import Bloggers from "../../components/Bloggers/Bloggers";
import { useAppSelector } from "../../redux/hooks";

const BloggersPage = () => {
  const { data, isLoading, error } = useGetUsersQuery({ page: 1, search: "" });

  // Assuming your API returns { count, next, previous, results }
  const bloggersList = data?.results || [];

  return (
    <Bloggers
      bloggers={bloggersList}
      isLoading={isLoading}
      error={error?.message || null}
    />
  );
};

export default BloggersPage;

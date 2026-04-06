import React from "react";
import Bloggers from "../../components/Bloggers/Bloggers";
import { useGetUsersQuery } from "../../features/profile/profileApi";
import { useAppSelector } from "../../redux/hooks";
import Loader from "../../components/Loader";

const BloggersPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useGetUsersQuery(
    { page: 1, search: "" },
    {
      skip: !isAuthenticated,
    },
  );
  console.log(data);

  const defaultData = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  if (isLoading) {
    return <Loader />;
  }

  return <Bloggers data={data || defaultData} />;
};

export default BloggersPage;

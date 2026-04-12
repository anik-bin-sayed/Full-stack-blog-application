import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";
import type {
  BlogListResponse,
  BlogQueryParams,
} from "../../types/blog/blogApiResponse";

export const blogDataApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["blog"],

  endpoints: (builder) => ({
    myDraftBlogApi: builder.query<BlogListResponse, BlogQueryParams>({
      query: (params) => ({
        url: "/blog/my-draft-blog",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    myPublicBlog: builder.query<BlogListResponse, BlogQueryParams>({
      query: (params) => ({
        url: `/blog/my-public-blog`,
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    getCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/categories",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    createCategory: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/blog/category/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blog"],
    }),

    createBlog: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/blog/create-blog",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blog"],
    }),

    draftCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/my-draft-blogs-category",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    blogDetails: builder.query<any, { slug: string }>({
      query: ({ slug }) => ({
        url: `blog/blog-details/${slug}`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),

    publicCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/my-public-blogs-category",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    deleteBlog: builder.mutation<any, void>({
      query: (id) => ({
        url: `/blog/delete-blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),

    publishBlog: builder.mutation<any, void>({
      query: (id) => ({
        url: `/blog/toggle-publish/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["blog"],
    }),

    profileRecentPost: builder.query<any, void>({
      query: (id) => ({
        url: `/blog/my-recent-blog`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),

    updateBlog: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blog/update-blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),

    publicRecentBlogs: builder.query<any, void>({
      query: () => ({
        url: `/blog/publish-recent-blogs`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),

    publicFeatureBlogs: builder.query<any, void>({
      query: () => ({
        url: `/blog/feature-blogs`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),

    authorRecentBlogs: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/blog/user-recent-post/${id}`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),

    getBlogs: builder.query<
      any,
      { page?: number; search?: string; category?: string }
    >({
      query: ({ page = 1, search = "", category = "" }) => {
        let url = `/blog/all-blogs?page=${page}`;

        if (search) {
          url += `&search=${search}`;
        }

        if (category) {
          url += `&category=${category}`;
        }

        return url;
      },
      providesTags: ["blog"],
    }),
  }),
});

export const {
  useMyDraftBlogApiQuery,
  useGetCategoriesQuery,
  useGetBlogsQuery,
  useDraftCategoriesQuery,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useMyPublicBlogQuery,
  usePublicCategoriesQuery,
  useCreateCategoryMutation,
  useCreateBlogMutation,
  useBlogDetailsQuery,
  useProfileRecentPostQuery,
  useUpdateBlogMutation,
  usePublicRecentBlogsQuery,
  usePublicFeatureBlogsQuery,
  useAuthorRecentBlogsQuery,
} = blogDataApi;

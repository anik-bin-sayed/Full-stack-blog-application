import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../baseQueryWithReauth";

import type {
  BlogListResponse,
  BlogQueryParams,
} from "../../types/blog/blogApiResponse";

type CreateCommentPayload = {
  blog_id: number;
  data: {
    content: string;
  };
};

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
        url: "/blog/my-public-blog",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    profileRecentPost: builder.query<any, void>({
      query: () => ({
        url: `/blog/my-recent-blog`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),

    // CATEGORY

    getCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/categories",
        method: "GET",
        params,
      }),
      providesTags: ["blog"],
    }),

    draftCategories: builder.query<any, void>({
      query: (params) => ({
        url: "blog/my-draft-blogs-category",
        method: "GET",
        params,
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

    createCategory: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/blog/category/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blog"],
    }),

    // BLOG CRUD

    createBlog: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/blog/create-blog",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blog"],
    }),

    updateBlog: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blog/update-blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),

    deleteBlog: builder.mutation<any, void>({
      query: (id) => ({
        url: `/blog/delete-blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),

    // BLOG DETAILS / PUBLIC

    blogDetails: builder.query<any, { slug: string }>({
      query: ({ slug }) => ({
        url: `blog/blog-details/${slug}`,
        method: "GET",
      }),
      providesTags: ["blog"],
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

    // TOGGLE

    publishBlog: builder.mutation<any, void>({
      query: (id) => ({
        url: `/blog/toggle-publish/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["blog"],
    }),

    // ALL BLOGS (PUBLIC LIST)

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
    //  like
    likeBlog: builder.mutation<any, void>({
      query: (blog_id) => ({
        url: `/blog/like/${blog_id}/`,
        method: "POST",
      }),
      invalidatesTags: ["blog"],
    }),

    userIsLike: builder.query<any, void>({
      query: (blog_id) => ({
        url: `/blog/like/get/${blog_id}/`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),
    // comments
    createComment: builder.mutation<any, CreateCommentPayload>({
      query: ({ blog_id, data }) => ({
        url: `/blog/comment/create/${blog_id}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),

    getComment: builder.query<any, { blog_id: number; page?: number }>({
      query: ({ blog_id, page = 1 }) => ({
        url: `/blog/comments/${blog_id}/?page=${page}`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),

    deleteComment: builder.mutation<any, { comment_id: number }>({
      query: ({ comment_id }) => ({
        url: `/blog/comment/delete/${comment_id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
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
  // Like
  useLikeBlogMutation,
  useUserIsLikeQuery,

  // comments
  useCreateCommentMutation,
  useGetCommentQuery,
  useDeleteCommentMutation,
} = blogDataApi;

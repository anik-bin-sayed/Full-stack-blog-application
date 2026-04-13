from django.urls import path
from .views import *

urlpatterns = [
    #  category
    path("category/create", CreateCategoryView.as_view(), name="create-category"),
    path("categories/", GetAllCategories.as_view(), name="categories"),
    # Public blog
    path("all-blogs", AllBlogs.as_view(), name="all-blogs"),
    path("publish-recent-blogs", GetRecentBlog.as_view(), name="publish-recent-blogs"),
    path("feature-blogs", GetFeatureBlog.as_view(), name="feature-blogs"),
    path("blog-details/<slug:slug>/", BlogDetails.as_view(), name="blog-details"),
    # private
    path("create-blog", CreateBlog.as_view(), name="create-blog"),
    path("update-blog/<int:id>", UpdateApiView.as_view(), name="update-blog"),
    path(
        "user-recent-post/<int:id>",
        UserRecentPostListView.as_view(),
        name="user-recent-post",
    ),
    # my Blog
    path("my-blog", MyBlogsView.as_view(), name="my-blog"),
    path("my-recent-blog", MyRecentBlog.as_view(), name="my-recent-blog"),
    path("my-draft-blog", MyDraftBlog.as_view(), name="my-draft-blog"),
    path("my-public-blog", MyBlogsView.as_view(), name="my-public-blog"),
    path(
        "my-draft-blogs-category",
        DraftCategoriesView.as_view(),
        name="my-draft-blogs-category",
    ),
    path(
        "my-public-blogs-category",
        PublicCategoriesView.as_view(),
        name="my-public-blogs-category",
    ),
    path("delete-blog/<int:id>", DeleteBlogView.as_view(), name="delete-blog"),
    # Toggle
    path("toggle-publish/<int:id>", TogglePublishView.as_view(), name="toggle-publish"),
    path("toggle-feature/<int:id>", ToggleFeatureView.as_view(), name="toggle-feature"),
    # Like
    path("like/<int:blog_id>/", ToggleLikeAPIView.as_view(), name="toggle-like"),
    path("like/get/<int:blog_id>/", GetLikeDataView.as_view(), name="get-like"),
    # comment
    path(
        "comment/create/<int:blog_id>/",
        CreateCommentAPIView.as_view(),
        name="create-comment",
    ),
    path("comments/<int:blog_id>/", GetCommentsAPIView.as_view(), name="get-comment"),
    path(
        "comment/delete/<int:comment_id>/",
        DeleteCommentAPIView.as_view(),
        name="delete-comment",
    ),
    path(
        "comment/update/<int:comment_id>/",
        UpdateCommentAPIView.as_view(),
        name="update-comment",
    ),
]

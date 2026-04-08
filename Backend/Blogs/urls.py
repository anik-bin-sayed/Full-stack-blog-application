from django.urls import path
from .views import *

urlpatterns = [
    path("/category/create", CreateCategoryView.as_view(), name="create-category"),
    path("/categories", GetAllCategories.as_view(), name="categories"),
    path("/publish-blogs", GetRecentBlog.as_view(), name="publish-blogs"),
    path("/feature-blogs", GetFeatureBlog.as_view(), name="feature-blogs"),
    path("/blog-details/<int:id>", BlogDetails.as_view(), name="blog-details"),
    path("/create-blog", CreateBlog.as_view(), name="create-blog"),
    path("/update-blog/<int:id>", UpdateApiView.as_view(), name="update-blog"),
    # my Blog
    path("/my-blog", MyBlogsView.as_view(), name="my-blog"),
    path("/my-draft-blog", MyDraftBlog.as_view(), name="my-draft-blog"),
    path("/my-public-blog", MyBlogsView.as_view(), name="my-public-blog"),
    path(
        "/my-draft-blogs-category",
        DraftCategoriesView.as_view(),
        name="my-draft-blogs-category",
    ),
    path(
        "/my-public-blogs-category",
        PublicCategoriesView.as_view(),
        name="my-public-blogs-category",
    ),
    path("/delete-blog/<int:id>", DeleteBlogView.as_view(), name="delete-blog"),
    path(
        "/toggle-publish/<int:id>", TogglePublishView.as_view(), name="toggle-publish"
    ),
    path(
        "/toggle-feature/<int:id>", ToggleFeatureView.as_view(), name="toggle-feature"
    ),
]

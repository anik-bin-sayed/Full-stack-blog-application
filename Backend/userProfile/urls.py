from django.urls import path

from .views import *

urlpatterns = [
    path("", AllUsersView.as_view(), name="profile"),
    path("/me", MeView.as_view(), name="me"),
    path("/<int:id>", PartialUser.as_view(), name="partial-user"),
    path("/update", UpdateMeView.as_view(), name="update"),
    # image
    path("/upload-img", UploadProfileImage.as_view(), name="upload-img"),
    path("/upload-cover-img", UploadCoverImage.as_view(), name="upload-cover-img"),
    # current photo
    path("/current-photo", CurrentProfilePhoto.as_view(), name="profile"),
    path(
        "/current-cover-photo", CurrentCoverPhoto.as_view(), name="current-cover-photo"
    ),
    # gallery
    path("/gallery", UserProfilePhotosView.as_view(), name="gallery"),
    path("/cover-gallery", UserCoverPhotosView.as_view(), name="gallery"),
    # Gallery
    path("/delete/<int:id>", DeletePhotoView.as_view(), name="delete"),
    path("/delete-cover-image/<int:id>", DeleteCoverPhotoView.as_view(), name="delete"),
    path(
        "/make-profile-photo/<int:id>",
        MakeAsProfileApiView.as_view(),
        name="make-profile-photo",
    ),
    path(
        "/make-cover-photo/<int:id>",
        MakeAsCoverApiView.as_view(),
        name="make-profile-photo",
    ),
]

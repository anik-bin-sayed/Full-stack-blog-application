from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

import cloudinary.uploader

from .serializers import *
from .utils.paginator import CustomPagination

User = get_user_model()


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        serializer = UserDetailSerializer(user)

        return Response(serializer.data)


class AllUsersView(APIView):
    def get(self, request):
        users = (
            User.objects.all()
            .select_related("profile")
            .prefetch_related("followers", "following", "profileimage_set")
        )

        search = request.query_params.get("search")
        if search:
            users = users.filter(username__icontains=search)

        paginator = CustomPagination()
        paginated_users = paginator.paginate_queryset(users, request)

        serializer = UserDetailSerializer(paginated_users, many=True)

        return paginator.get_paginated_response(serializer.data)


class PartialUser(APIView):
    def get(self, request, id):
        users = (
            User.objects.filter(id=id)
            .select_related("profile")
            .prefetch_related("profileimage_set", "coverimage_set")
        )
        serializer = UserDetailSerializer(users, many=True)

        return Response(serializer.data, status=200)


class UpdateMeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user

        user_serializer = UserUpdateSerializer(user, data=request.data, partial=True)

        profile_serializer = UserProfileUpdateSerializer(
            user.profile, data=request.data, partial=True
        )

        if user_serializer.is_valid() and profile_serializer.is_valid():
            user_serializer.save()
            profile_serializer.save()

            return Response(
                {"user": user_serializer.data, "profile": profile_serializer.data}
            )

        return Response(
            {
                "user_errors": user_serializer.errors,
                "profile_errors": profile_serializer.errors,
            },
            status=400,
        )


# profile photo
class UploadProfileImage(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        image = request.FILES.get("image")

        if not image:
            return Response(
                {"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        ProfileImage.objects.filter(user=request.user, is_current=True).update(
            is_current=False
        )

        photo = ProfileImage.objects.create(
            user=request.user, image=image, is_current=True
        )

        return Response(
            {
                "message": "Profile image uploaded successfully",
                "image": photo.image.url,
            },
            status=status.HTTP_201_CREATED,
        )


class CurrentProfilePhoto(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        photo = ProfileImage.objects.filter(user=request.user, is_current=True).first()

        return Response({"image": photo.image.url if photo else None})


class UserProfilePhotosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        photos = ProfileImage.objects.filter(user=request.user).order_by("-uploaded_at")

        paginator = CustomPagination()
        paginated_photos = paginator.paginate_queryset(photos, request)
        print(paginated_photos)
        data = [
            {
                "id": photo.id,
                "image": photo.image.url,
                "uploaded_at": photo.uploaded_at,
            }
            for photo in paginated_photos
        ]

        return paginator.get_paginated_response(data)


class MakeAsProfileApiView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):

        photo = get_object_or_404(ProfileImage, id=id, user=request.user)

        ProfileImage.objects.filter(user=request.user).update(is_current=False)

        photo.is_current = True
        photo.save()

        return Response({"message": "Make profile successfully"})


class DeletePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            photo = ProfileImage.objects.get(id=id, user=request.user)

            if photo.image:
                cloudinary.uploader.destroy(photo.image.public_id)

            photo.delete()

            return Response({"message": "Deleted"}, status=status.HTTP_200_OK)

        except ProfileImage.DoesNotExist:
            return Response(
                {"error": "Photo not found"}, status=status.HTTP_404_NOT_FOUND
            )


# cover
class UploadCoverImage(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image = request.FILES.get("image")
        print("FILES:", request.FILES)

        if not image:
            return Response(
                {"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        CoverImage.objects.filter(user=request.user, is_current=True).update(
            is_current=False
        )

        photo = CoverImage.objects.create(
            user=request.user, image=image, is_current=True
        )

        return Response(
            {
                "message": "Profile image uploaded successfully",
                "image": photo.image.url,
                "current": photo.is_current,
            },
            status=status.HTTP_201_CREATED,
        )


# current photo
class CurrentCoverPhoto(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        photo = CoverImage.objects.filter(user=request.user, is_current=True).first()

        return Response({"image": photo.image.url if photo else None})


# Gallery
class UserCoverPhotosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        photos = CoverImage.objects.filter(user=request.user).order_by("-uploaded_at")

        paginator = CustomPagination()
        paginated_photos = paginator.paginate_queryset(photos, request)
        data = [
            {
                "id": photo.id,
                "image": photo.image.url,
                "uploaded_at": photo.uploaded_at,
            }
            for photo in paginated_photos
        ]

        return paginator.get_paginated_response(data)


class MakeAsCoverApiView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):

        photo = get_object_or_404(CoverImage, id=id, user=request.user)

        CoverImage.objects.filter(user=request.user).update(is_current=False)

        photo.is_current = True
        photo.save()

        return Response({"message": "Make profile successfully"})


class DeleteCoverPhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            photo = CoverImage.objects.get(id=id, user=request.user)

            if photo.image:
                cloudinary.uploader.destroy(photo.image.public_id)

            photo.delete()

            return Response({"message": "Deleted"}, status=status.HTTP_200_OK)

        except CoverImage.DoesNotExist:
            return Response(
                {"error": "Photo not found"}, status=status.HTTP_404_NOT_FOUND
            )

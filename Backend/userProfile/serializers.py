from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import UserProfile, ProfileImage, CoverImage, Follow

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ["id", "image", "is_current", "uploaded_at"]


class CoverImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverImage
        fields = ["id", "image", "is_current", "uploaded_at"]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "bio",
            "fullname",
            "phone",
            "birthdate",
            "gender",
            "language",
            "timezone",
            "address",
            "city",
            "country",
            "website",
            "linkedin",
            "github",
            "twitter",
            "portfolio_url",
            "social_links",
            "language_preference",
            "dark_mode_enabled",
            "created_at",
            "updated_at",
        ]


class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ["id", "follower", "following", "created_at"]


class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    profile_images = ProfileImageSerializer(
        source="profileimage_set", many=True, read_only=True
    )
    cover_images = CoverImageSerializer(
        source="coverimage_set", many=True, read_only=True
    )
    followers = FollowSerializer(many=True, read_only=True)
    following = FollowSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "profile",
            "profile_images",
            "cover_images",
            "followers",
            "following",
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]
        extra_kwargs = {
            "username": {"required": False},
            "email": {"required": False},
        }


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "bio",
            "phone",
            "fullname",
            "birthdate",
            "gender",
            "language",
            "timezone",
            "address",
            "city",
            "country",
            "website",
            "linkedin",
            "github",
            "twitter",
            "portfolio_url",
            "social_links",
            "language_preference",
            "dark_mode_enabled",
        ]
        extra_kwargs = {field: {"required": False} for field in fields}


class UserProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ["id", "image", "uploaded_at", "user"]
        read_only_fields = ["uploaded_at", "is_current"]


class UserCoverPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ["id", "image", "uploaded_at", "user"]
        read_only_fields = ["uploaded_at", "is_current"]


class ProfileMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "fullname"]


class ProfileMiniImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ["id", "image", "is_current"]

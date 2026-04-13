from rest_framework import serializers
from django.contrib.auth import get_user_model
from userProfile.models import UserProfile, ProfileImage
from userProfile.serializers import UserDetailSerializer, FollowSerializer

from .models import *
from .utils import generate_unique_slug

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class BlogListSerializer(serializers.ModelSerializer):
    author = UserDetailSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "image",
            "author",
            "is_publish",
            "is_featured",
            "category",
            "created_at",
            "likes_count",
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()


class BlogDetailSerializer(serializers.ModelSerializer):
    author = UserDetailSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    # comments = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = "__all__"

    def get_comments(self, obj):
        comments = obj.comments.all().order_by("-created_at")
        return CommentSerializer(comments, many=True).data

    def get_likes_count(self, obj):
        return obj.likes.count()


class BlogCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            "title",
            "slug",
            "excerpt",
            "content",
            "image",
            "category",
            "is_featured",
            "is_publish",
        ]
        extra_kwargs = {"slug": {"required": False}}

    def create(self, validated_data):
        user = self.context["request"].user

        title = validated_data.get("title")

        validated_data["slug"] = generate_unique_slug(title)

        return Blog.objects.create(author=user, **validated_data)


class CommentSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at", "replies"]

    def get_replies(self, obj):
        replies = obj.replies.all().order_by("created_at")
        return CommentSerializer(replies, many=True).data


class CommentCreateSerializer(serializers.ModelSerializer):
    parent_id = serializers.IntegerField(required=False)

    class Meta:
        model = Comment
        fields = ["content", "parent_id"]

    def create(self, validated_data):
        user = self.context["request"].user
        blog = self.context["blog"]

        parent_id = validated_data.pop("parent_id", None)

        parent = None
        if parent_id:
            parent = Comment.objects.get(id=parent_id)

        return Comment.objects.create(
            user=user, blog=blog, parent=parent, **validated_data
        )


class BloggerSerializer(serializers.ModelSerializer):
    profile = UserDetailSerializer(read_only=True)
    followers = FollowSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "profile",
            "profile_images",
            "followers",
        ]


class FeedSerializer(serializers.ModelSerializer):
    author = UserDetailSerializer()

    class Meta:
        model = Blog
        fields = ["id", "title", "author", "created_at"]


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")
    blog = serializers.ReadOnlyField(source="blog.id")

    class Meta:
        model = Like
        fields = ["id", "user", "blog"]


class LikeToggleResponseSerializer(serializers.Serializer):
    liked = serializers.BooleanField()
    total_likes = serializers.IntegerField()
    message = serializers.CharField()

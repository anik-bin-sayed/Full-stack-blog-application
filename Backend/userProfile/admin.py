from django.contrib import admin
from .models import UserProfile, CoverImage, ProfileImage, Follow


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "city", "country", "created_at")
    search_fields = ("user__username", "city", "country")
    list_filter = ("country", "gender")


@admin.register(ProfileImage)
class ProfileImageAdmin(admin.ModelAdmin):
    list_display = ("user", "is_current", "uploaded_at")
    list_filter = ("is_current",)
    search_fields = ("user__username",)


@admin.register(CoverImage)
class CoverImageAdmin(admin.ModelAdmin):
    list_display = ("user", "is_current", "uploaded_at")
    list_filter = ("is_current",)


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ("follower", "following", "created_at")
    search_fields = ("follower__username", "following__username")

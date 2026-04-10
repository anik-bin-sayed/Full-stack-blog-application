from django.db.models import Q
from django.utils.text import slugify
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from .models import *
from .serializers import *
from .utils import CustomPagination
from .permissions import IsOwner


class CreateCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()

        name = data.get("name")
        data["slug"] = slugify(name)

        serializer = CategorySerializer(data=data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class GetAllCategories(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by("-created_at")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class GetRecentBlog(APIView):
    def get(self, request):
        blogs = Blog.objects.filter(is_publish=True).order_by("-created_at")[:4]

        serializer = BlogListSerializer(blogs, many=True)

        return Response(serializer.data)


class GetFeatureBlog(APIView):
    def get(self, request):
        blogs = Blog.objects.filter(is_featured=True).order_by("-created_at")[:6]

        serializer = BlogListSerializer(blogs, many=True)

        return Response(serializer.data)


class AllBlogs(APIView):
    def get(self, request):
        blogs = Blog.objects.filter(is_publish=True).order_by("-created_at")[:6]

        serializer = BlogListSerializer(blogs, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class BlogDetails(APIView):
    def get(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        serializer = BlogDetailSerializer(blog)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateBlog(CreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


class UpdateApiView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, id):
        try:
            blog = Blog.objects.get(id=id)

            self.check_object_permissions(request, blog)

            serializer = BlogCreateSerializer(blog, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Blog updated successfully", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Blog.DoesNotExist:
            return Response(
                {"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND
            )


# My blogs views


class MyRecentBlog(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blogs = Blog.objects.filter(author=request.user, is_publish=True).order_by(
            "-created_at"
        )[:4]
        serializer = BlogListSerializer(blogs, many=True)
        return Response(serializer.data)


class MyBlogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blogs = Blog.objects.filter(author=request.user, is_publish=True)

        search = request.query_params.get("search")
        if search:
            blogs = blogs.filter(
                Q(title__icontains=search)
                | Q(content__icontains=search)
                | Q(category__name__icontains=search)
            )

        category = request.query_params.get("category")
        if category:
            blogs = blogs.filter(category_id=category)

        ordering = request.query_params.get("ordering", "-created_at")
        blogs = blogs.order_by(ordering)

        paginator = CustomPagination()
        paginated_blogs = paginator.paginate_queryset(blogs, request)

        serializer = BlogListSerializer(paginated_blogs, many=True)

        return paginator.get_paginated_response(serializer.data)


class MyDraftBlog(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blogs = Blog.objects.filter(author=request.user, is_publish=False)

        search = request.query_params.get("search")
        if search:
            blogs = blogs.filter(
                Q(title__icontains=search) | Q(content__icontains=search)
            )

        category = request.query_params.get("category")
        if category:
            blogs = blogs.filter(category_id=category)

        ordering = request.query_params.get("ordering", "-created_at")
        blogs = blogs.order_by(ordering)

        paginator = CustomPagination()
        paginated_blogs = paginator.paginate_queryset(blogs, request)

        serializer = BlogListSerializer(paginated_blogs, many=True)

        return paginator.get_paginated_response(serializer.data)


class DeleteBlogView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            blog = Blog.objects.get(id=id)

            if blog.author != request.user:
                return Response(
                    {"error": "You are not allowed to delete this blog"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            blog.delete()

            return Response(
                {"message": "Blog deleted successfully"}, status=status.HTTP_200_OK
            )

        except Blog.DoesNotExist:
            return Response(
                {"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND
            )


class TogglePublishView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, id):
        try:
            blog = Blog.objects.get(id=id)

            self.check_object_permissions(request, blog)

            blog.is_publish = not blog.is_publish
            blog.save()

            return Response(
                {"message": "Status updated", "is_publish": blog.is_publish}
            )

        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)


class ToggleFeatureView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, id):
        try:
            blog = Blog.objects.get(id=id)

            self.check_object_permissions(request, blog)

            blog.is_featured = not blog.is_featured
            blog.save()

            return Response(
                {"message": "Status updated", "is_featured": blog.is_featured}
            )

        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=404)


class DraftCategoriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = (
            Blog.objects.filter(author=request.user, is_publish=False)
            .values("category__id", "category__name")
            .distinct()
        )

        return Response({"categories": list(categories)})


class PublicCategoriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = (
            Blog.objects.filter(author=request.user, is_publish=True)
            .values("category__id", "category__name")
            .distinct()
        )

        return Response({"categories": list(categories)})

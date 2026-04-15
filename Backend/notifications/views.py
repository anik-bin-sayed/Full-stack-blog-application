from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer
from .pagination import NotificationPagination

# Create your views here.


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = NotificationPagination

    def get(self, request):
        paginator = NotificationPagination()

        notifications = Notification.objects.filter(receiver=request.user).order_by(
            "-created_at"
        )

        result_page = paginator.paginate_queryset(notifications, request)
        serializer = NotificationSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)


class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        notification = Notification.objects.get(id=id, receiver=request.user)
        notification.is_read = True
        notification.save()
        return Response({"success": True})


class MarkAllAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(receiver=request.user, is_read=False).update(
            is_read=True
        )

        return Response(
            {"success": True, "message": "All notifications marked as read"}
        )


class DeleteAllNotificationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        deleted_count, _ = Notification.objects.filter(receiver=request.user).delete()

        return Response(
            {
                "message": "All notifications deleted successfully",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )

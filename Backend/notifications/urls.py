from django.urls import path
from .views import *

urlpatterns = [
    path("/", NotificationListView.as_view(), name="list-notifications"),
    path(
        "/mark-as-read/<int:id>",
        MarkAsReadView.as_view(),
        name="mark-as-read",
    ),
    path(
        "/mark-all-as-read",
        MarkAllAsReadView.as_view(),
        name="mark-all-as-read",
    ),
]

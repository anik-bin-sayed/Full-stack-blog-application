from django.urls import path
from .views import *

urlpatterns = [path("", NotificationListView.as_view(), name="list-notifications")]

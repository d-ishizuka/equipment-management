from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# REST APIのルーター設定
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'equipment', views.EquipmentViewSet)
router.register(r'equipment-logs', views.EquipmentLogViewSet)

urlpatterns = [
    # REST APIエンドポイント
    path('', include(router.urls)),
]
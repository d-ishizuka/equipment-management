from rest_framework import viewsets
from rest_framework.response import Response
from .models import Category, Location, Equipment, EquipmentLog
from .serializers import CategorySerializer, LocationSerializer, EquipmentSerializer, EquipmentLogSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class EquipmentLogViewSet(viewsets.ModelViewSet):
    queryset = EquipmentLog.objects.all()
    serializer_class = EquipmentLogSerializer

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    
    # 検索・フィルタリング機能の例
    def get_queryset(self):
        queryset = Equipment.objects.all()
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset
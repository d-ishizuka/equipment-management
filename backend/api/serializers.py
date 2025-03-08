from rest_framework import serializers
from .models import Category, Location, Equipment, EquipmentLog
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class EquipmentSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    location_name = serializers.ReadOnlyField(source='location.name')
    
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'serial_number', 'category', 'category_name', 
                 'location', 'location_name', 'purchase_date', 'purchase_price', 
                 'status', 'description']

class EquipmentLogSerializer(serializers.ModelSerializer):
    equipment_name = serializers.ReadOnlyField(source='equipment.name')
    checked_out_by_name = serializers.ReadOnlyField(source='checked_out_by.username')
    
    class Meta:
        model = EquipmentLog
        fields = ['id', 'equipment', 'equipment_name', 'checked_out_by', 
                 'checked_out_by_name', 'checked_out_date', 'expected_return_date',
                 'checked_in_date', 'notes']

# リスト表示用の簡略化されたシリアライザー
class EquipmentListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    location_name = serializers.ReadOnlyField(source='location.name')
    
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'category_name', 'location_name', 'status']
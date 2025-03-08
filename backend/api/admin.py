from django.contrib import admin
from .models import Category, Location, Equipment, EquipmentLog

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'serial_number', 'category', 'location', 'status')
    list_filter = ('status', 'category', 'location')
    search_fields = ('name', 'serial_number', 'description')

class EquipmentLogAdmin(admin.ModelAdmin):
    list_display = ('equipment', 'checked_out_by', 'checked_out_date', 'expected_return_date', 'checked_in_date')
    list_filter = ('checked_out_date', 'checked_in_date')
    search_fields = ('equipment__name', 'checked_out_by__username')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Location, LocationAdmin)
admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(EquipmentLog, EquipmentLogAdmin)
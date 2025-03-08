from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    """備品のカテゴリを定義するモデル"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Location(models.Model):
    """備品の保管場所を定義するモデル"""
    name = models.CharField(max_length=100)  # 例：「1階オフィス」「2階会議室A」など
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class Equipment(models.Model):
    """備品を定義するモデル"""
    STATUS_CHOICES = (
        ('available', '利用可能'),
        ('in_use', '使用中'),
        ('maintenance', 'メンテナンス中'),
        ('broken', '故障'),
        ('discarded', '廃棄'),
    )
    
    name = models.CharField(max_length=100)  # 備品名
    serial_number = models.CharField(max_length=100, blank=True, null=True)  # シリアル番号
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='equipment')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name='equipment')
    purchase_date = models.DateField(null=True, blank=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class EquipmentLog(models.Model):
    """備品の貸出/返却記録を管理するモデル"""
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='logs')
    checked_out_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='equipment_checkouts')
    checked_out_date = models.DateTimeField(auto_now_add=True)
    expected_return_date = models.DateField(null=True, blank=True)
    checked_in_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.equipment.name} - {self.checked_out_by.username}"
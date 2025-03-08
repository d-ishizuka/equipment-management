from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Category, Location, Equipment, EquipmentLog
from datetime import date, timedelta

class CategoryModelTests(TestCase):
    def test_create_category(self):
        """カテゴリモデルが正しく作成されるかテスト"""
        category = Category.objects.create(
            name="電子機器",
            description="パソコンやタブレットなどの電子機器"
        )
        self.assertEqual(category.name, "電子機器")
        self.assertEqual(category.description, "パソコンやタブレットなどの電子機器")
        self.assertEqual(str(category), "電子機器")

class LocationModelTests(TestCase):
    def test_create_location(self):
        """保管場所モデルが正しく作成されるかテスト"""
        location = Location.objects.create(
            name="1階オフィス",
            description="1階の総務部オフィス"
        )
        self.assertEqual(location.name, "1階オフィス")
        self.assertEqual(location.description, "1階の総務部オフィス")
        self.assertEqual(str(location), "1階オフィス")

class EquipmentModelTests(TestCase):
    def setUp(self):
        """テストデータの準備"""
        self.category = Category.objects.create(name="電子機器")
        self.location = Location.objects.create(name="1階オフィス")
        
    def test_create_equipment(self):
        """備品モデルが正しく作成されるかテスト"""
        equipment = Equipment.objects.create(
            name="ノートPC",
            serial_number="SN12345",
            category=self.category,
            location=self.location,
            purchase_date=date.today(),
            purchase_price=100000,
            status="available"
        )
        self.assertEqual(equipment.name, "ノートPC")
        self.assertEqual(equipment.category, self.category)
        self.assertEqual(equipment.status, "available")
        self.assertEqual(str(equipment), "ノートPC")

class EquipmentLogModelTests(TestCase):
    def setUp(self):
        """テストデータの準備"""
        self.category = Category.objects.create(name="電子機器")
        self.location = Location.objects.create(name="1階オフィス")
        self.equipment = Equipment.objects.create(
            name="ノートPC",
            category=self.category,
            location=self.location
        )
        self.user = User.objects.create_user(username="testuser", password="password")
        
    def test_create_equipment_log(self):
        """備品貸出記録が正しく作成されるかテスト"""
        log = EquipmentLog.objects.create(
            equipment=self.equipment,
            checked_out_by=self.user,
            expected_return_date=date.today() + timedelta(days=7)
        )
        self.assertEqual(log.equipment, self.equipment)
        self.assertEqual(log.checked_out_by, self.user)
        self.assertIsNone(log.checked_in_date)
        self.assertEqual(str(log), f"ノートPC - testuser")

# API テスト
class CategoryAPITests(APITestCase):
    def setUp(self):
        """テストデータとユーザーの準備"""
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_authenticate(user=self.user)
        Category.objects.create(name="電子機器", description="テスト")
        
    def test_get_categories(self):
        """カテゴリ一覧が取得できるかテスト"""
        url = reverse('category-list')  # URLの名前は実際のURLconfに合わせて変更してください
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "電子機器")

    def test_create_category(self):
        """カテゴリを作成できるかテスト"""
        url = reverse('category-list')  # URLの名前は実際のURLconfに合わせて変更してください
        data = {'name': '文房具', 'description': 'ペンや紙などの文房具'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)
        self.assertEqual(Category.objects.get(id=2).name, '文房具')
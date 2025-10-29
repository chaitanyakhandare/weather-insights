from django.urls import path
from .views import *

urlpatterns = [
    path('fetch/', fetch_weather, name='fetch_weather'),
    path('addcity/', add_city, name='add_city'),
    path('getcities/', get_cities, name='get_cities'),
    path('deletecity/<int:city_id>/', delete_city, name='delete_city'),
    path('fetchreport/', fetch_report, name='fetch_report'),
]
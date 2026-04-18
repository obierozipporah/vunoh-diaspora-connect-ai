from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('api/process/', views.api_process_request, name='api_process'),
    path('api/tasks/', views.api_get_tasks, name='api_tasks'),
    path('api/tasks/<int:task_id>/update/', views.api_update_status, name='api_update_status'),
]
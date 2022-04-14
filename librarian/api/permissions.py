from rest_framework import permissions
from rest_framework.permissions import BasePermission
from django.conf import settings


class DisableDemo(BasePermission):
    """
    Disables write operations if in DEMO_MODE
    """
    def has_permission(self, request, view):
        if settings.DEMO_MODE and request.method not in permissions.SAFE_METHODS:
            return False
        return True

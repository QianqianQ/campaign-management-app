from django.contrib import admin

from .models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("email", "is_staff", "is_active", "date_joined")
    list_filter = ("is_staff", "is_active", "date_joined")
    search_fields = ("email",)
    ordering = ("email",)
    readonly_fields = ("date_joined",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

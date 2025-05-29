import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()


@pytest.mark.django_db
class TestUserAuth:
    # TODO: add more tests for user authentication
    # testcase for signup with strong password
    # testcase for signup with weak password
    # testcase for signup with wrong password_confirm

    # testcase for signin with wrong password

    # testcase for signout

    def test_signup_user_success(self, unauth_client):
        url = reverse("signup")
        data = {
            "email": "test@example.com",
            "password": "Password123!",
            "password_confirm": "Password123!",
        }
        response = unauth_client.post(url, data)
        assert response.status_code == 201
        # assert User.objects.filter(username="alice@example.com").exists()
        # Verify user was created with email as username
        user = User.objects.get(email="test@example.com")
        assert user.username == "test@example.com"
        assert user.email == "test@example.com"
        assert user.check_password("Password123!")

    def test_signup_user_duplicate_email(self, unauth_client, test_user):
        """Test registration fails with duplicate email"""
        url = reverse("signup")
        data = {
            "email": test_user.email,  # Using existing email
            "password": "Password123!",
            "password_confirm": "Password123!",
        }
        response = unauth_client.post(url, data, format="json")
        assert response.status_code == 400
        print(response.data)
        assert "email" in response.data
        assert response.data["email"][0] == "user with this email already exists."

    def test_signin_user_success(self, auth_client, test_user):
        url = reverse("signin")
        data = {"email": test_user.email, "password": "Password123!"}
        response = auth_client.post(url, data, format="json")
        assert response.status_code == 200
        assert "user" in response.data
        assert response.data["user"]["email"] == test_user.email

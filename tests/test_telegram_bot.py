import pytest
from unittest.mock import patch, Mock
from telegram_bot.telegram_bot import app

@pytest.fixture
def client():
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


@patch("telegram_bot.telegram_bot.requests.post")
def test_submit_booking_success(mock_post, client):
    mock_post.return_value = Mock(status_code=200)

    response = client.post(
        "/submit-booking",
        json={
            "name": "Kira",
            "phone": "+380123456789",
            "details": "24.06.2026 18:00"
        }
    )

    assert response.status_code == 200
    assert response.get_json() == {"status": "success"}


def test_submit_booking_no_data(client):
    response = client.post(
        "/submit-booking",
        json={}
    )

    assert response.status_code == 400
    assert response.get_json() == {
        "status": "error",
        "message": "No data provided"
    }


@patch("telegram_bot.telegram_bot.requests.post")
def test_submit_booking_telegram_error(mock_post, client):
    mock_post.return_value = Mock(status_code=500)

    response = client.post(
        "/submit-booking",
        json={
            "name": "Kira",
            "phone": "+380123456789",
            "details": "24.06.2026 18:00"
        }
    )

    assert response.status_code == 500
    assert response.get_json() == {
        "status": "error",
        "message": "Failed to send to Telegram"
    }


@patch("telegram_bot.telegram_bot.requests.post")
def test_submit_booking_exception(mock_post, client):
    mock_post.side_effect = Exception("Connection error")

    response = client.post(
        "/submit-booking",
        json={
            "name": "Kira",
            "phone": "+380123456789",
            "details": "24.06.2026 18:00"
        }
    )

    assert response.status_code == 500
    assert response.get_json() == {
        "status": "error",
        "message": "Connection error"
    }
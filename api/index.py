from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

supabase = None

if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Supabase variables are missing")

if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
    print("Telegram variables are missing")


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok",
        "message": "Flask is running on Vercel"
    })


@app.route("/submit-booking", methods=["POST"])
def submit_booking():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "No data received"
            }), 400

        name = data.get("name", "Не вказано")
        phone = data.get("phone", "Не вказано")
        details = data.get("details", "Не вказано")
        user_id = data.get("user_id")

        # Запись в Supabase
        if supabase and user_id:
            try:
                supabase.table("Reservation").insert({
                    "UID": user_id,
                    "user_name": name,
                    "phone_number": phone,
                    "booking_details": details
                }).execute()
            except Exception as e:
                print("Supabase error:", str(e))

        # Отправка в Telegram
        if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:

            message = (
                "🍽 НОВЕ БРОНЮВАННЯ\n\n"
                f"👤 Ім'я: {name}\n"
                f"📞 Телефон: {phone}\n"
                f"📅 Деталі: {details}"
            )

            telegram = requests.post(
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
                json={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": message
                },
                timeout=10
            )

            if telegram.status_code != 200:
                return jsonify({
                    "status": "error",
                    "telegram": telegram.text
                }), 500

        return jsonify({
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
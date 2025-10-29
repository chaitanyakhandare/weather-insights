from django.shortcuts import render

import requests, os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from supabase import create_client

from google import genai

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client = genai.Client(api_key=GEMINI_API_KEY)


@api_view(["GET"])
def fetch_weather(request):
    """Basic weather fetch for a single city."""
    city = request.GET.get("city")
    url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={city}"

    res = requests.get(url)
    data = res.json()

    if "error" in data:
        return Response({"error": "City not found or invalid"}, status=400)

    return Response(data)


@api_view(["GET"])
def fetch_report(request):
    """
    Generates a Gemini AI report for the selected city,
    comparing it to all other cities in the DB.
    """
    selected_city = request.GET.get("city")
    if not selected_city:
        return Response({"error": "City parameter is required"}, status=400)


    response = supabase.table("cities").select("name").execute()
    all_cities = [c["name"] for c in response.data if c["name"]]

    if selected_city not in all_cities:
        return Response({"error": "Selected city not found in database"}, status=404)

    
    weather_data = {}
    for city in all_cities:
        try:
            url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={city}"
            res = requests.get(url)
            data = res.json()
            if "error" not in data:
                weather_data[city] = {
                    "temp_c": data["current"]["temp_c"],
                    "condition": data["current"]["condition"]["text"],
                    "humidity": data["current"]["humidity"],
                    "wind_kph": data["current"]["wind_kph"],
                    "pressure_mb": data["current"]["pressure_mb"],
                    "uv": data["current"]["uv"],
                }
        except Exception as e:
            print(f"Error fetching weather for {city}: {e}")

    if selected_city not in weather_data:
        return Response({"error": "Unable to fetch weather for selected city"}, status=500)

    
    comparison_text = "\n".join([
        f"- {city}: {info['temp_c']}°C, {info['condition']}, "
        f"Humidity {info['humidity']}%, Wind {info['wind_kph']} kph, "
        f"Pressure {info['pressure_mb']} hPa, UV {info['uv']}"
        for city, info in weather_data.items()
    ])

    prompt = f"""
    You are a professional meteorologist and climate analyst.

    Here is real-time weather data for several cities:

    {comparison_text}

    Please generate an in-depth, engaging, and human-readable weather comparison report.

    Focus on:
    - A detailed analysis of how {selected_city}'s weather compares to the others.
    - Temperature, humidity, and air pressure differences.
    - Comfort level (dry/humid, windy/calm, hot/cool).
    - Which city has the most pleasant or extreme weather.
    - Any interesting insights (e.g., coastal vs inland effects, time of year context, etc.)
    - Keep the tone informative but accessible (as if a news weather presenter is explaining it).

    End with a one-line "Summary Verdict" comparing {selected_city} to others.
    """

    # report by gem
    try:
        ai_response = client.models.generate_content(
            # model="gemini-2.5-flash", contents=prompt
            model="gemini-2.0-flash", contents=prompt
        )
        analysis = ai_response.text.strip()
    except Exception as e:
        print("Gemini error:", e)
        analysis = "Unable to generate AI report at this time."

    # storing in supabase
    supabase.table("weather_data").insert(
        {
            "city": selected_city,
            "temperature": weather_data[selected_city]["temp_c"],
            "condition": weather_data[selected_city]["condition"],
        }
    ).execute()

    return Response({
        "selected_city": selected_city,
        "weather_data": weather_data,
        "ai_report": analysis,
    })



@api_view(["POST"])
def add_city(request):
    city = request.data.get("city")

    supabase.table("cities").insert({"name": city}).execute()

    return Response({"message": f"City {city} added successfully."})


@api_view(["GET"])
def get_cities(request):
    response = supabase.table("cities").select("*").execute()
    cities = response.data

    return Response({"cities": cities})


@api_view(["DELETE"])
def delete_city(request, city_id):
    supabase.table("cities").delete().eq("id", city_id).execute()

    return Response({"message": f"City with id {city_id} deleted successfully."})   
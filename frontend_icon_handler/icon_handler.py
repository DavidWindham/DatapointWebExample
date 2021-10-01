# Interchangeable in theory
from .erikflowers import erikflowers_handlers


def get_rendered_weather_icon_element(icon_key):
    return erikflowers_handlers.ErikFlowers_get_weather_icon(icon_key)


def get_rendered_windspeed_icon_element(windspeed_mph):
    return erikflowers_handlers.ErikFlowers_get_wind_icon(windspeed_mph)

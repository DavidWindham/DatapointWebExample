# Interchangeable icon handler, simply replace the linked file and functions down-line
from .erikflowers import erikflowers_handlers


def get_rendered_weather_icon_element(icon_key):
    return erikflowers_handlers.ErikFlowers_get_weather_icon(icon_key)


def get_rendered_windspeed_icon_element(windspeed_mph):
    return erikflowers_handlers.ErikFlowers_get_wind_icon(windspeed_mph)


def get_rendered_humidity_icon_element(humidity):
    return erikflowers_handlers.ErikFlowers_get_humidity_icon(humidity)


def get_rendered_rain_chance_element(rain_chance):
    return erikflowers_handlers.ErikFlowers_get_rain_chance_icon(rain_chance)

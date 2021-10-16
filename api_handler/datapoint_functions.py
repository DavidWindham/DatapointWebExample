import requests
from math import sin, cos, asin, sqrt, radians


def url_get(url) -> requests.Response:
    return requests.get(url)


def get_closest_location(locations: list, lat: float, long: float):
    """
    Iterates over every location, finds and returns the closest only
    """
    for single_location in locations:
        single_location["distance"] = haversine_distance(
            float(single_location["latitude"]),
            float(single_location["longitude"]),
            lat,
            long,
        )
    return min(locations, key=lambda x: x["distance"])


def haversine_distance(lat1: float, long1: float, lat2: float, long2: float) -> float:
    """
    Calculate the distance in kilometers between 2 lat/long points
    """

    EARTH_RADIUS = 6371

    delta_lat = radians(lat2 - lat1)
    delta_long = radians(long2 - long1)
    lat1_r = radians(lat1)
    lat2_r = radians(lat2)

    a = sin(delta_lat / 2) ** 2 + cos(lat1_r) * cos(lat2_r) * sin(delta_long / 2) ** 2
    c = 2 * asin(sqrt(a))

    return c * EARTH_RADIUS

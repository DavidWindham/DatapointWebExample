from flask import render_template

"""
Credit to ErikFlowers on github
Link: https://erikflowers.github.io/weather-icons/
"""


def ErikFlowers_get_weather_icon(icon_key):
    weather_icon_dict = {
        "NA": "Not available",
        "0": "wi-night-clear",
        "1": "wi-day-sunny",
        "2": "wi-night-alt-partly-cloudy",
        "3": "wi-day-cloudy",
        "4": "wi-alien",
        "5": "wi-day-haze",
        "6": "wi-day-fog",
        "7": "wi-day-cloudy",
        "8": "wi-day-sunny-overcast",
        "9": "wi-night-showers",
        "10": "wi-day-showers",
        "11": "wi-day-sprinkle",
        "12": "wi-day-sprinkle",
        "13": "wi-night-alt-rain",
        "14": "wi-day-rain",
        "15": "wi-rain",
        "16": "wi-night-alt-sleet",
        "17": "wi-day-sleet",
        "18": "wi-sleet",
        "19": "wi-night-hail",
        "20": "wi-day-hail",
        "21": "wi-hail",
        "22": "wi-night-alt-snow",
        "23": "wi-day-snow",
        "24": "wi-snow",
        "25": "wi-night-alt-snow",
        "26": "wi-day-snow",
        "27": "wi-snow",
        "28": "wi-night-alt-thunderstorm",
        "29": "wi-day-thunderstorm",
        "30": "wi-thunderstorm"
    }
    icon_classname = weather_icon_dict[icon_key]
    return render_template('elements/ErikFlowers_icons/weather_icon.html', icon_classname=icon_classname)


def ErikFlowers_get_wind_icon(windspeed_mph):
    beaufort_num = get_beaufort(int(windspeed_mph))
    return render_template('elements/ErikFlowers_icons/windspeed_icon.html', beaufort_num=beaufort_num)


def get_beaufort(mph):
    """
    :param mph: float, miles per hour
    :return: Beaufort scale value for the passed wind speed
    """
    beaufort_dict = {
        "0": (0, 1),
        "1": (1, 4),
        "2": (4, 8),
        "3": (8, 13),
        "4": (13, 19),
        "5": (19, 25),
        "6": (25, 32),
        "7": (32, 39),
        "8": (39, 47),
        "9": (47, 55),
        "10": (55, 64),
        "11": (64, 73),
        "12": (73, 1000),
    }
    for beaufort, tuple_pair in beaufort_dict.items():
        if tuple_pair[0] <= mph < tuple_pair[1]:
            return beaufort

import datetime
from frontend_icon_handler.icon_handler_class import IconHandler


class ForecastData:
    def __init__(self, passed_data):
        location_data = passed_data['SiteRep']['DV']['Location']
        self.latitude: float = float(location_data['lat'])
        self.longitude: float = float(location_data['lon'])
        self.name: str = location_data['name']
        self.elevation: float = float(location_data['elevation'])
        self.days: list = [ForecastDay(x) for x in location_data['Period']]


class ForecastDay:
    def __init__(self, day_data):
        self.type = day_data['type']
        self.value = day_data['value']
        self.points = [ForecastSinglePoint(x) for x in day_data['Rep']]

    def get_day_name(self):
        return datetime.datetime.strptime(self.value, '%Y-%m-%dZ').strftime('%A')


class ForecastSinglePoint(IconHandler):
    def __init__(self, pd):
        self.minutes: int = int(pd['$'])
        self.hours = self.minutes / 60
        self.feels_like_temperature = pd['F']
        self.wind_gust = pd['G']
        self.screen_relative_humidity = pd['H']
        self.temperature = pd['T']
        self.visibility = pd['V']
        self.wind_direction = pd['D']
        self.wind_speed = pd['S']
        self.max_uv_index = pd['U']
        self.weather_type_val = pd['W']
        self.precipitation_probability = pd['Pp']

    def get_hour(self):
        # return '{00:.2f}'.format(self.hours)
        return str('{:02d}'.format(int(self.hours))) + ":00"

    def get_weather_type_num(self):
        weather_type_dict = {
            "NA": "Not available",
            "0": "Clear night",
            "1": "Sunny day",
            "2": "Partly cloudy (night)",
            "3": "Partly cloudy (day)",
            "4": "Not used",
            "5": "Mist",
            "6 ": "Fog",
            "7 ": "Cloudy",
            "8 ": "Overcast",
            "9 ": "Light rain shower (night)",
            "10": "Light rain shower (day)",
            "11": "Drizzle",
            "12": "Light rain",
            "13": "Heavy rain shower (night)",
            "14": "Heavy rain shower (day)",
            "15": "Heavy rain",
            "16": "Sleet shower (night)",
            "17": "Sleet shower (day)",
            "18": "Sleet",
            "19": "Hail shower (night)",
            "20": "Hail shower (day)",
            "21": "Hail",
            "22": "Light snow shower (night)",
            "23": "Light snow shower (day)",
            "24": "Light snow",
            "25": "Heavy snow shower (night)",
            "26": "Heavy snow shower (day)",
            "27": "Heavy snow",
            "28": "Thunder shower (night)",
            "29": "Thunder shower (day)",
            "30": "Thunder"
        }
        return weather_type_dict[self.weather_type_val]

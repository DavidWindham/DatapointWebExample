from frontend_icon_handler import icon_handler

class IconHandler:
    def get_weather_icon(self):
        return icon_handler.get_rendered_weather_icon_element(self.weather_type_val)

    def get_windspeed_icon(self):
        return icon_handler.get_rendered_windspeed_icon_element(self.wind_speed)
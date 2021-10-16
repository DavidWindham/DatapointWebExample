from frontend_icon_handler import icon_handler


class IconHandler:
    def get_weather_icon(self):
        return icon_handler.get_rendered_weather_icon_element(self.weather_type_val)

    def get_windspeed_icon(self):
        return icon_handler.get_rendered_windspeed_icon_element(self.wind_speed)

    def get_humidity_icon(self):
        return icon_handler.get_rendered_humidity_icon_element(
            self.screen_relative_humidity
        )

    def get_rain_chance_icon(self):
        return icon_handler.get_rendered_rain_chance_element(
            self.precipitation_probability
        )

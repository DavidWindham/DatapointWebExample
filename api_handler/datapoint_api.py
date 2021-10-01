from .datapoint_functions import url_get, get_closest_location


class Datapoint:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "http://datapoint.metoffice.gov.uk/public/data/val/{}/all/json/{}?{}&key=" + self.api_key

    """
    Functions to get forecast data - wxfcs
    """

    def get_forecast_locations(self):
        locations_json = self.get_forecast_locations_raw()['Locations']['Location']
        return locations_json

    def get_forecast_for_location_id(self, location_id):
        url = self.base_url.format("wxfcs", location_id, "res=3hourly")
        location_data = url_get(url).json()
        return location_data

    def get_forecast_for_coordinates(self, lat: float, long: float):
        location_id = self.get_forecast_location_for_coordinates(lat=lat, long=long)['id']
        forecast_data = self.get_forecast_for_location_id(location_id=location_id)
        return forecast_data

    def get_forecast_location_for_coordinates(self, lat: float, long: float):
        """
        Iterates over all locations available and returns the closest one
        """
        locations = self.get_forecast_locations()
        return get_closest_location(locations, lat, long)

    """
    Functions for historic data retrieval - wxobs
    """

    def get_historic_locations(self):
        locations = self.get_historic_locations_raw()['Locations']['Location']
        return locations

    def get_historic_for_location_id(self, location_id):
        url = self.base_url.format("wxobs", location_id, "res=hourly")
        response_data = url_get(url).json()
        return response_data

    def get_historic_for_coordinates(self, lat, long):
        locations = self.get_historic_locations()
        location_id = get_closest_location(locations, lat, long)['id']
        return self.get_historic_for_location_id(location_id)

    def get_historic_location_for_coordinates(self, lat, long):
        locations = self.get_historic_locations()
        return get_closest_location(locations, lat, long)

    """
    Auxilary functions
    """

    def get_forecast_locations_raw(self):
        url = self.base_url.format("wxfcs", "sitelist", "")
        return url_get(url).json()

    def get_historic_locations_raw(self):
        url = self.base_url.format("wxobs", "sitelist", "")
        return url_get(url).json()


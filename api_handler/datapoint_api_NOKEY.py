from .datapoint_functions import get_closest_location
import json
import os


class DatapointNOKEY:
    def __init__(self):
        """
        This class has no api key and the methods are static, I've kept this structure so it's
        interchangeable with the real API handler
        """
        self.dir_path = os.path.dirname(os.path.realpath(__file__))

    def get_forecast_locations(self):
        with open(self.dir_path + '/example_data/forecast_locations.json', 'r') as fl:
            forecast_locations = json.load(fl)
        return forecast_locations

    def get_forecast_for_location_id(self, location_id):
        with open(self.dir_path + '/example_data/' + str(location_id) + '.json', 'r') as fi:
            forecast_data = json.load(fi)
        return forecast_data

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

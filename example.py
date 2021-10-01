import settings as settings
from api_handler.datapoint_api import Datapoint


def main():
    datapoint_handler = Datapoint(api_key=settings.DATAPOINT_API_KEY)

    # Here you have a full list of every forecast location, print the list to see them all
    all_forecast_location = datapoint_handler.get_forecast_locations()


    # Here are a pair of latitude and longitude coordinates, it indicates Buckingham Palace
    lat = 51.5014
    long = 0.1419

    # This function will return a single forecast location closest to that latitude and longitude
    closest_location_to_lat_long = datapoint_handler.get_forecast_for_coordinates(lat, long)

    # And here you can get the ID for that point
    closest_location_id = closest_location_to_lat_long['id']

    # And finally you can retrieve the forecast data for that location
    forecast_for_closest_location = datapoint_handler.get_forecast_for_location_id(closest_location_id)

    # Alternatively you can get the forecast directly for the latitude and longitude
    forecast_for_closest_location = datapoint_handler.get_forecast_for_coordinates(lat, long)


if __name__ == '__main__':
    main()

import settings as settings
from api_handler.datapoint_api import Datapoint
from api_handler.datapoint_api_NOKEY import DatapointNOKEY


def get_datapoint_handler():
    # If an API key isn't set in the .ENV file, a different class is loaded that uses pre-downloaded files
    if settings.DATAPOINT_API_KEY != "":
        return Datapoint(api_key=settings.DATAPOINT_API_KEY)
    else:
        """
        If this version is used, this example will work, but you won't have the full range of functionality
        The number of forecast locations is limited to the 20 closest to Buckingham Palace
        Each of these locations still have forecast data as of 01/10/21 at 12:00
        """
        return DatapointNOKEY()

from flask import Flask, render_template, request
import json

import settings as settings
from api_handler.dataclasses import ForecastData

# If an API key isn't set in the .ENV file, a different class is loaded that uses pre-downloaded files
if settings.DATAPOINT_API_KEY != "":
    from api_handler.datapoint_api import Datapoint
    datapoint_handler = Datapoint(api_key=settings.DATAPOINT_API_KEY)
else:
    """
    If this version is used, this example will work, but you won't have the full range of functionality
    The number of forecast locations is limited to the 20 closest to Buckingham Palace
    Each of these locations still have forecast data as of 01/10/21 at 12:00
    """
    from api_handler.datapoint_api_NOKEY import DatapointNOKEY
    datapoint_handler = DatapointNOKEY()

datapoint_webapp = Flask(__name__)


@datapoint_webapp.route('/')
def index():
    return render_template('forecast_ui.html')


@datapoint_webapp.route('/get_forecast_locations', methods=['POST'])
def get_forecast_locations():
    return json.dumps(datapoint_handler.get_forecast_locations())


@datapoint_webapp.route('/get_historic_locations', methods=['POST'])
def get_historic_locations():
    return json.dumps(datapoint_handler.get_historic_locations())


@datapoint_webapp.route('/get_forecast_for_location_id', methods=['POST'])
def get_forecast_for_location_id():
    location_data = ForecastData(datapoint_handler.get_forecast_for_location_id(request.json['location_id']))
    return render_template('elements/forecast_section_template.html', location_data=location_data)


if __name__ == '__main__':
    datapoint_webapp.run(host="0.0.0.0", port=5000, debug=False)

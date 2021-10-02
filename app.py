from flask import Flask, render_template, request
import json

from api_handler.dataclasses import ForecastData

from get_datapoint_handler import get_datapoint_handler
datapoint_handler = get_datapoint_handler()

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
    datapoint_webapp.run(host="0.0.0.0", port=5000, debug=True)

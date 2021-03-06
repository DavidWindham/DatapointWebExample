from flask import Flask, render_template, request
import json

from api_handler.dataclasses import ForecastData
from get_datapoint_handler import get_datapoint_handler
from postcode_resolver import PostcodeResolver

datapoint_handler = get_datapoint_handler()
postcode_resolver = PostcodeResolver()

datapoint_webapp = Flask(__name__)


@datapoint_webapp.route("/")
def index():
    max_number_of_forecast_locations = len(datapoint_handler.get_forecast_locations())
    return render_template(
        "forecast_ui.html",
        max_number_of_forecast_locations=max_number_of_forecast_locations,
    )


@datapoint_webapp.route("/get_number_of_forecast_locations", methods=["GET"])
def get_number_of_forecast_locations():
    return json.dumps(len(datapoint_handler.get_forecast_locations()))


@datapoint_webapp.route("/get_forecast_locations", methods=["POST"])
def get_forecast_locations():
    return json.dumps(datapoint_handler.get_forecast_locations())


@datapoint_webapp.route("/get_limited_forecast_locations", methods=["POST"])
def get_limited_forecast_locations():
    number_of_points_to_get = int(request.json["num_points"])
    return_points = datapoint_handler.get_forecast_locations()
    del return_points[number_of_points_to_get:]
    return json.dumps(return_points)


@datapoint_webapp.route("/get_historic_locations", methods=["POST"])
def get_historic_locations():
    return json.dumps(datapoint_handler.get_historic_locations())


@datapoint_webapp.route("/get_forecast_for_location_id", methods=["POST"])
def get_forecast_for_location_id():
    location_data = ForecastData(
        datapoint_handler.get_forecast_for_location_id(request.json["location_id"])
    )
    return render_template(
        "elements/forecast/forecast_section_template.html", location_data=location_data
    )


@datapoint_webapp.route("/get_forecast_location_for_postcode", methods=["POST"])
def get_forecast_location_for_postcode():
    passed_postcode = request.json["postcode"]
    try:
        postcode_lat, postcode_long = postcode_resolver.get_lat_long_for_postcode(
            passed_postcode
        )
        return json.dumps(
            datapoint_handler.get_forecast_location_for_coordinates(
                postcode_lat, postcode_long
            )
        )
    except KeyError:
        return json.dumps(
            {
                "state": "failed",
                "data": render_template("elements/error/postcode_fail.html"),
            }
        )


if __name__ == "__main__":
    datapoint_webapp.run(host="0.0.0.0", port=5000, debug=True)

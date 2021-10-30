import './scss/main.scss';

// Vendor Imports
import $ from 'jquery';
import 'bootstrap/js/src/tab';
import * as d3 from 'd3';
import 'weather-icons/weather-icons/weather-icons.less';
import 'topojson';

import {
    get_max_number_forecast_locations
} from "./map_auxillary";

import {ForecastClass} from "./js/forecast/forecast";
import {MapClass} from "./js/map/map";
import {SliderClass} from "./js/form/slider";
import {PostcodeClass} from "./js/form/postcode";
import {handle_resize_functions} from "./js/window_resize";


$(document).ready(function () {
    let forecast_element = $("#forecast_data");
    let forecast_handler = new ForecastClass(forecast_element);

    let map_element = $("#map_area");
    let map_handler = new MapClass(map_element, forecast_handler);

    handle_resize_functions(map_handler.resize_svg, map_element);

    let slider_element = $("#num_locations_input");
    let slider_output = $("#forecast_num_range");
    let point_slider = new SliderClass(slider_element,
        map_handler.get_limited_forecast_locations,
        slider_output
    );

    get_max_number_forecast_locations(point_slider.set_max_num_forecast_locations);

    let postcode_input_element = $("#postcode_input");
    let postcode_form_element = $("#postcode_form");
    let postcode_handler = new PostcodeClass(postcode_input_element, postcode_form_element, map_handler.get_forecast_for_postcode);

});

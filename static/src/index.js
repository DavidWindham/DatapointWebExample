import './scss/style.scss';


import $ from 'jquery';
import {camelCase} from 'lodash';
import * as d3 from 'd3';

import 'bootstrap';
import 'weather-icons/weather-icons/weather-icons.less';
import 'topojson';

//import { Tooltip, Toast, Popover } from 'bootstrap';

console.log(camelCase('hello world'));

const DEFAULT_POINT_RADIUS = 0.5
const SELECTED_POINT_RADIUS = 2;

var svg;
var projection;
var path;
var map_paths;
var forecast_points;

var previously_selected_location;

$(document).ready(function () {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    var width = vw * (8 / 12);
    var height = vh * 0.9;

    projection = d3.geoAlbers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .scale(height * 5)
        .translate([width / 2, height / 2]);

    svg = d3.select("#map_area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    path = d3.geoPath()
        .projection(projection);

    map_paths = svg.append("g");
    forecast_points = svg.append("g");

    load_boundaries("static/topojson/gb-local_auth.json");
    load_boundaries("static/topojson/ni-local_auth.json");

    var zoom = d3.zoom()
        .scaleExtent([1, 16])
        .on('zoom', function (event) {
            map_paths.selectAll('path')
                .attr('transform', event.transform);
            forecast_points.selectAll('circle')
                .attr('transform', event.transform);
        });

    svg.call(zoom);

    get_forecast_locations();
});

function load_boundaries(url) {
    // Loads topology data from JSON, if successful it draws them
    d3.json(url).then(function (b, error) {
        if (error) console.log(error);
        draw_boundaries(b);
    })
}

function draw_boundaries(boundaries) {
    // draws the map boundaries
    map_paths.selectAll('path')
        .data(boundaries.features).enter().append('path')
        .attr('d', path)
        .attr("class", "map_section")
        .on("mouseout", map_boundary_out)
        .on("mouseover", map_boundary_over)
}

function map_boundary_over() {
    // On mouse hover over area
    $(this).removeClass("map_section");
    $(this).addClass("map_section_hover");
    const data = $(this)[0].__data__;
    $('#hover_county_div').html(data.properties.LAD13NM);
}

function map_boundary_out() {
    // On mouse out, triggers before map_boundary_over
    $(this).addClass("map_section");
    $(this).removeClass("map_section_hover");
    $('#hover_county_div').html("⠀");   // Set to null char to prevent height adjustment
}

function get_forecast_locations() {
    //AJAX to get all forecasting locations and load them onto the map
    $.ajax({
        type: "POST",
        async: false,
        url: "/get_forecast_locations",
        success: function (result) {
            const site_locations = JSON.parse(result);
            forecast_points.selectAll("circle")
                .data(site_locations)
                .enter()

                .append("circle")
                .attr("cx", function (d) {
                    return projection([d.longitude, d.latitude])[0];
                })
                .attr("cy", function (d) {
                    return projection([d.longitude, d.latitude])[1];
                })
                .attr("r", DEFAULT_POINT_RADIUS)
                .attr("class", "forecast_location")
                .on("mouseover", handle_mouse_over_point)
                .on("mouseout", handle_mouse_out_point)
                .on("click", handle_mouse_click_on_location);
        }
    });
}

function handle_mouse_click_on_location() {
    // If a previous location was clicked, it removes the class with the styling indicating selection
    deselect_previous_location()

    // Indicates the newly selected node
    $(this).addClass("forecast_location_selected");
    $(this).removeClass("forecast_location_hover");
    $(this).attr('r', SELECTED_POINT_RADIUS);
    previously_selected_location = $(this);

    // Prepares the data to request
    const data = $(this)[0].__data__;
    const location_id = data.id;
    get_location_data_for_id(location_id);
}

function deselect_previous_location() {
    // This doesn't seem like a very robust solution, but it works
    if (previously_selected_location != null) {
        previously_selected_location.attr('r', DEFAULT_POINT_RADIUS)
        previously_selected_location.removeClass("forecast_location_selected")
    }
}

function get_location_data_for_id(location_id) {
    // passes the ID prepared from the function above this to the backend to retrieve the forecast data
    $.ajax({
        type: "POST",
        async: false,
        url: "/get_forecast_for_location_id",
        contentType: "application/json",
        data: JSON.stringify({
            'location_id': location_id
        }),
        success: function (result) {
            $('#forecast_aside').html(result);
        }
    });
}

function handle_mouse_over_point() {
    // On mouse hover over a forecasting point
    // This check feels janky, but it works, maybe there's a better solution to this flipping of classes
    if ($(this).attr("class") !== "forecast_location_selected") {
        $(this).attr('class', null)
        $(this).attr('class', 'forecast_location_hover')
    }
}

function handle_mouse_out_point() {
    // On mouse leave
    if ($(this).attr("class") !== "forecast_location_selected") {
        $(this).attr('class', null);
        $(this).attr('class', 'forecast_location');
    }
}
import './scss/main.scss';

import $ from 'jquery';
import 'bootstrap/js/src/tab';

import * as d3 from 'd3';

import 'weather-icons/weather-icons/weather-icons.less';
import 'topojson';

const DEFAULT_POINT_RADIUS = 0.5
const SELECTED_POINT_RADIUS = 2;

let svg;
let projection;
let path;
let map_paths;
let forecast_points;

let previously_selected_location;

$(document).ready(function () {
    // Init the range indicator for the slider used to load the forecast locations
    forecast_slider_change();

    let width = $("#map_area").width();
    let height = $("#map_area").height();

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

    //load_boundaries("static/topojson/gb-local_auth.json");
    //load_boundaries("static/topojson/ni-local_auth.json");
    load_boundaries("static/topojson/uk-counties.json");

    let zoom = d3.zoom()
        .scaleExtent([1, 16])
        .on('zoom', function (event) {
            map_paths.selectAll('path')
                .attr('transform', event.transform);
            forecast_points.selectAll('circle')
                .attr('transform', event.transform)
        });

    svg.call(zoom);

    get_limited_forecast_locations();
});

$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('resizeEnd');
    }, 500);
});

$(window).bind('resizeEnd', function () {
    let width = $("#map_area").width();
    let height = $("#map_area").height();
    resize_svg(width, height)
});

function resize_svg(width, height) {
    svg.attr("width", width).attr("height", height);
}

function load_boundaries(url) {
    // Loads topology data from JSON, if successful it draws them
    d3.json(url).then(function (b, error) {
        if (error) console.log(error);
        draw_boundaries(b);
    })
}

function draw_boundaries(boundaries) {
    map_paths.selectAll('path')
        .data(topojson.feature(boundaries, boundaries.objects.GBR_adm2).features)
        .enter().append('path')
        .attr('d', path)
        .attr("class", "map-single-section")
        .on("mouseout", map_boundary_out)
        .on("mouseover", map_boundary_over)
}

function map_boundary_over() {
    // On mouse hover over area
    const data = $(this)[0].__data__;
    $('#hover_county_text_p').html(data.properties.NAME_2);
}

function map_boundary_out() {
    // On mouse out, triggers before map_boundary_over
    $('#hover_county_text_p').html("⠀");   // Set to null char to prevent height adjustment
}

function get_forecast_locations() {
    clear_forecast_points();
    //AJAX to get all forecasting locations and load them onto the map
    $.ajax({
        type: "POST",
        async: false,
        url: "/get_forecast_locations",
        success: function (result) {
            load_forecast_locations_into_svg(result);
        }
    });
}

function get_limited_forecast_locations() {
    clear_forecast_points();
    //AJAX to get a limited number of forecasting locations and load them onto the map
    let number_of_points = $('#num_locations_input').val()
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({"num_points": number_of_points}),
        url: "/get_limited_forecast_locations",
        success: function (result) {
            load_forecast_locations_into_svg(result);
        }
    });
}

function load_forecast_locations_into_svg(passed_data) {
    const site_locations = JSON.parse(passed_data);
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
        .attr("id", function (d) {
            return d.id;
        })
        .attr("r", DEFAULT_POINT_RADIUS)
        .attr("class", "forecast-station-point")
        .on("click", handle_mouse_click_on_location);
}

function handle_mouse_click_on_location() {
    handle_forecast_location_select($(this)[0].__data__.id);
}

function handle_forecast_location_select(passed_forecast_point_id) {
    // If a previous location was clicked, it removes the class with the styling indicating selection
    deselect_previous_location()

    // Indicates the newly selected node
    let forecast_point = $("#" + passed_forecast_point_id);
    forecast_point.addClass("selected");
    forecast_point.attr('r', SELECTED_POINT_RADIUS);
    previously_selected_location = forecast_point;

    // Prepares the data to request
    const data = forecast_point[0].__data__;
    const location_id = data.id;
    get_location_data_for_id(location_id);
}

function deselect_previous_location() {
    // This doesn't seem like a very robust solution, but it works
    if (previously_selected_location != null) {
        previously_selected_location.attr('r', DEFAULT_POINT_RADIUS)
        previously_selected_location.removeClass("selected")
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
            $('#forecast_data').html(result);
        }
    });
}

function get_forecast_for_postcode() {
    $.ajax({
        type: "POST",
        async: false,
        url: "/get_forecast_location_for_postcode",
        contentType: "application/json",
        data: JSON.stringify({
            'postcode': $('.postcode_input').val()
        }),
        success: function (returned_forecast_point_id) {
            handle_forecast_location_select(returned_forecast_point_id);
        }
    });
}


function clear_forecast_points() {
    forecast_points.selectAll('circle')
        .remove()
}

function update_forecast_points() {
    //$('#forecast_num_range').html($("#num_locations_input").val());
    get_limited_forecast_locations();
}

function forecast_slider_change(){
    $('#forecast_num_range').html($("#num_locations_input").val() + "/" + window.max_num_forecast_locations + " forecast locations loaded");
}

window.update_forecast_points = update_forecast_points;
window.forecast_slider_change = forecast_slider_change;
window.clear_foreacst_points = clear_forecast_points;
window.get_forecast_locations = get_forecast_locations;
window.get_limited_forecast_locations = get_limited_forecast_locations;
window.get_forecast_for_postcode = get_forecast_for_postcode;

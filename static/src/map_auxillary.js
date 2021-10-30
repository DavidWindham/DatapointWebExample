import $ from "jquery";

export function map_boundary_over() {
    // On mouse hover over area
    const data = $(this)[0].__data__;
    $('#hover_county_text_p').html(data.properties.NAME_2);
}

export function map_boundary_out() {
    // On mouse out, triggers before map_boundary_over
    $('#hover_county_text_p').html("⠀");   // Set to null char to prevent height adjustment
}

export function clear_forecast_points(forecast_points) {
    forecast_points.selectAll('circle')
        .remove()
}

export function deselect_previous_location(previously_selected_location, DEFAULT_POINT_RADIUS) {
    // This doesn't seem like a very robust solution, but it works
    if (previously_selected_location != null) {
        previously_selected_location.attr('r', DEFAULT_POINT_RADIUS)
        previously_selected_location.removeClass("selected")
    }
}

export function get_max_number_forecast_locations(callback) {
    $.ajax({
        type: "GET",
        async: false,
        url: "/get_number_of_forecast_locations",
        success: function (result) {
            callback(result);
        }
    });
}

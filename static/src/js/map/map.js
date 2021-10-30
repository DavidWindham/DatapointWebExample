import $ from "jquery";
import * as d3 from "d3";
import {
    clear_forecast_points,
    deselect_previous_location,
    map_boundary_out,
    map_boundary_over
} from "../../map_auxillary";

export class MapClass {
    constructor(map_element, forecast_element) {
        let self = this
        self.forecast_element = forecast_element;
        this.previously_selected_location;

        this.DEFAULT_POINT_RADIUS = 0.5
        this.SELECTED_POINT_RADIUS = 2;

        let width = map_element.width();
        let height = map_element.height();

        this.projection = d3.geoAlbers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .scale(height * 5)
            .translate([width / 2, height / 2]);

        this.svg = d3.select("#map_area")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        this.path = d3.geoPath()
            .projection(self.projection);

        this.map_paths = self.svg.append("g");
        this.forecast_points = self.svg.append("g");
        this.forecast_points_data = [];

        this.load_boundaries("static/topojson/uk-counties.json");

        this.zoom = d3.zoom()
            .scaleExtent([1, 16])
            .on('zoom', function (event) {
                self.map_paths.selectAll('path')
                    .attr('transform', event.transform);
                self.forecast_points.selectAll('circle')
                    .attr('transform', event.transform)
            });

        this.svg.call(self.zoom);
    }

    load_boundaries(url) {
        let self = this;
        // Loads topology data from JSON, if successful it draws them
        d3.json(url).then(function (b, error) {
            if (error) console.log(error);
            self.draw_boundaries(b);
        })
    }

    draw_boundaries(boundaries) {
        let self = this;
        this.map_paths.selectAll('path')
            .data(topojson.feature(boundaries, boundaries.objects.GBR_adm2).features)
            .enter().append('path')
            .attr('d', self.path)
            .attr("class", "map-single-section")
            .on("mouseout", map_boundary_out)
            .on("mouseover", map_boundary_over)
    }

    get_forecast_locations() {
        let self = this;
        clear_forecast_points(self.forecast_points);
        //AJAX to get all forecasting locations and load them onto the map
        $.ajax({
            type: "POST",
            async: false,
            url: "/get_forecast_locations",
            success: function (result) {
                self.load_forecast_locations_into_svg(result);
            }
        });
    }

    get_limited_forecast_locations = (number_of_points) => {
        let self = this;
        clear_forecast_points(this.forecast_points);
        //AJAX to get a limited number of forecasting locations and load them onto the map
        $.ajax({
            type: "POST",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({"num_points": number_of_points}),
            url: "/get_limited_forecast_locations",
            success: function (result) {
                self.prep_forecast_locations_for_rendering(result);
            }
        });
    }

    prep_forecast_locations_for_rendering(passed_data) {
        this.forecast_points_data = JSON.parse(passed_data);
        this.load_forecast_locations_into_svg();
    }

    append_to_forecast_locations_for_rendering(passed_data) {
        this.forecast_points_data.push(passed_data);
        this.load_forecast_locations_into_svg();
    }

    load_forecast_locations_into_svg() {
        let self = this;
        clear_forecast_points(self.forecast_points);

        self.forecast_points.selectAll("circle")
            .data(this.forecast_points_data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return self.projection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function (d) {
                return self.projection([d.longitude, d.latitude])[1];
            })
            .attr("id", function (d) {
                return d.id;
            })
            .attr("r", self.DEFAULT_POINT_RADIUS)
            .attr("class", "forecast-station-point")
            .on("click", function () {
                self.handle_mouse_click_on_location(this);
            })

        let x_translate = self.svg._groups[0][0].__zoom.x
        let y_translate = self.svg._groups[0][0].__zoom.y
        let k_zoom = self.svg._groups[0][0].__zoom.k

        self.svg.call(self.zoom)
        self.svg.call(self.zoom.transform, d3.zoomIdentity.translate(x_translate, y_translate).scale(k_zoom))

    }

    append_to_forecast_locations_into_svg(passed_data) {
        let self = this;
        const site_locations = [passed_data];
        console.log(site_locations);
        this.forecast_points_data.push(passed_data);
        console.log(this.forecast_points_data);
        // self.forecast_points_test
        //     .append("circle")
        //     .attr("cx", function (d) {
        //         return self.projection([d.longitude, d.latitude])[0];
        //     })
        //     .attr("cy", function (d) {
        //         return self.projection([d.longitude, d.latitude])[1];
        //     })
        //     .attr("id", function (d) {
        //         return d.id;
        //     })
        //     .attr("r", self.DEFAULT_POINT_RADIUS)
        //     .attr("class", "forecast-station-point")
        //     .on("click", function () {
        //         self.handle_mouse_click_on_location(this);
        //     });
    }

    get_location_data_for_id = (location_id) => {
        let self = this;
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
                self.forecast_element.html(result);
            }
        });
    }

    get_forecast_for_postcode = (postcode) => {
        let self = this;
        $.ajax({
            type: "POST",
            async: false,
            url: "/get_forecast_location_for_postcode",
            contentType: "application/json",
            data: JSON.stringify({
                'postcode': postcode
            }),
            success: function (returned_forecast_point) {
                self.handle_forecast_location_select(JSON.parse(returned_forecast_point));
            }
        });
    }

    resize_svg = (width, height) => {
        this.svg.attr("width", width).attr("height", height);
    }

    handle_mouse_click_on_location = (passed_point) => {
        this.handle_forecast_location_select($(passed_point)[0].__data__);
    }

    handle_forecast_location_select(passed_forecast_point) {
        // If a previous location was clicked, it removes the class with the styling indicating selection
        deselect_previous_location(this.previously_selected_location, this.DEFAULT_POINT_RADIUS)

        // Indicates the newly selected node
        let forecast_point = this.get_forecast_point(passed_forecast_point);

        forecast_point.addClass("selected");
        forecast_point.attr('r', this.SELECTED_POINT_RADIUS);
        this.previously_selected_location = forecast_point;

        // Prepares the data to request
        const data = forecast_point[0].__data__;
        const location_id = data.id;
        this.get_location_data_for_id(location_id);
    }

    get_forecast_point = (passed_forecast_point) => {
        let self = this;
        let element_name = '#' + passed_forecast_point.id;
        // Checks if forecast point already exists
        if (!$(element_name).length) {
            // append element to the group if it doesn't
            self.append_to_forecast_locations_for_rendering(passed_forecast_point);
        }
        return $(element_name);
    }
}

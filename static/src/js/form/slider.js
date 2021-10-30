import $ from "jquery";

export class SliderClass {
    constructor(element, change_callback, mousemove_p) {
        let self = this;
        this.max_num_forecast_locations;
        this.mousemove_p = mousemove_p;
        this.element = element;
        element.bind({
            "change": function () {
                self.forecast_slider_release(self, this.value, change_callback);
            },
            "mousemove": function () {
                self.forecast_slider_change();
            }
        });
        self.forecast_slider_release(self, this.element.val(), change_callback);
    }

    set_max_num_forecast_locations = (max_num_forecast_locations) => {
        this.max_num_forecast_locations = max_num_forecast_locations;
        this.forecast_slider_change();
    }

    get_input_value = () => {
        return this.element.val();
    }

    forecast_slider_release = (self, num_points, callback) => {
        this.disable_slider()
        this.forecast_slider_change();
        callback(num_points);
        this.enable_slider();
    }

    forecast_slider_change = () => {
        this.mousemove_p.html(this.get_input_value() + "/" + this.max_num_forecast_locations + " forecast locations loaded");
    }

    disable_slider() {
        this.element.disabled = true;
        this.element.addClass("disabled-input");
    }

    enable_slider() {
        this.element.disabled = false;
        this.element.removeClass("disabled-input");
    }
}

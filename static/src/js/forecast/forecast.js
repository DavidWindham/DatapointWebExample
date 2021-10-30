export class ForecastClass {
    constructor(element) {
        this.element = element;
    }

    set_html = (passed_html) => {
        this.remove_loading_state();
        this.element.html(passed_html);
    }

    clear_html = () => {
        this.element.html("");
        this.loading_state();
    }

    loading_state() {
        this.element.html("<div class='loader'/>")
        this.element.addClass("forecast-center-loader");
    }

    remove_loading_state() {
        this.element.removeClass("forecast-center-loader");
    }
}

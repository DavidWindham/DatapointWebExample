export class ForecastClass {
    constructor(element, submit_callback) {
        let self = this;
        self.element = element;
    }

    load_data_into_element(passed_html){
        self.element.innerHTML = passed_html;
    }
    remove_data_from_element(){

    }
    loading_state(){

    }


    disable_submit = () => {
        this.disabled = true;
        this.element.disabled = true;
        this.form_element.addClass("disabled-input");
    }
    enable_submit = () => {
        this.disabled = false;
        this.element.disabled = false;
        this.form_element.removeClass("disabled-input");
    }
}

export class PostcodeClass {
    constructor(element, form_element, submit_callback) {
        let self = this;
        self.element = element;
        self.form_element = form_element;
        this.disabled = false;

        form_element.submit(function (e) {
            e.preventDefault();
            if (!this.disabled) {
                self.get_forecast_for_postcode(submit_callback);
            }
        });
    }

    get_forecast_for_postcode(callback) {
        console.log("Called");
        this.disable_submit()
        let postcode = this.element.val();
        callback(postcode)
        this.enable_submit()
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

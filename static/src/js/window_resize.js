import $ from "jquery";

export function handle_resize_functions(resize_svg_callback, map_element) {
    $(window).resize(function () {
        if (this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function () {
            $(this).trigger('resizeEnd');
        }, 500);
    });

    $(window).bind('resizeEnd', function () {
        let width = map_element.width();
        let height = map_element.height();
        resize_svg_callback(width, height)
    });
}

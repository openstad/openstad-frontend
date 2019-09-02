jQuery(document).ready(function($) {
    // add function and trigger it here
    //
    //
  $('.sort-select').on('change', function (ev) {
    ev.preventDefault();
    var values = $(this).val().split(',');
    var sortAttr= values[0];
    var descOrAsc= values[1];

    sortMeBy(sortAttr, descOrAsc, ".idea-list", ".idea-item");
  })
});

function sortMeBy(arg, sel, elem, order) {
        var $selector = $(sel),
        $element = $selector.children(elem);
        $element.sort(function(a, b) {
                var an = parseInt(a.getAttribute(arg)),
                bn = parseInt(b.getAttribute(arg));
                if (order === "asc") {
                        if (an > bn)
                        return 1;
                        if (an < bn)
                        return -1;
                } else if (order === "desc") {
                        if (an < bn)
                        return 1;
                        if (an > bn)
                        return -1;
                }
                return 0;
        });
        $element.detach().appendTo($selector);
}

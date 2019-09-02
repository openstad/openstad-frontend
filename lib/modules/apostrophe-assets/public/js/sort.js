$(document).ready(function($) {
    // add function and trigger it here
  var $ideaList = $(".idea-list");

  if ($ideaList.attr('data-default-sort')) {
    var values = $ideaList.attr('data-default-sort').split(',');
    var sortAttr = values[0];
    var descOrAsc = values[1];

    sortMeBy(sortAttr, descOrAsc, ".idea-list", ".idea-item");

    $('.ideas-sort-select').val(values);
  }

  $('.ideas-sort-select').on('change', function (ev) {
    ev.preventDefault();
    var values = $(this).val().split(',');
    var sortAttr = values[0];
    var descOrAsc = values[1];

    sortElements(sortAttr, descOrAsc, ".idea-list", ".idea-item");
  })
});

function sortElements(arg, sel, elem, order) {
        var $selector = $(sel),
        $element = $selector.children(elem);

        if (sortAttr === 'random') {
          $element.shuffle();
        } else {
          $element.sort(function(a, b) {
                  var an = parseInt(a.getAttribute('data-'+ arg)),
                  bn = parseInt(b.getAttribute('data-'+ arg));
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
        }
        $element.detach().appendTo($selector);
}

$(document).ready(function($) {
    // add function and trigger it here
  var $ideaList = $(".ideas-list");

  /**
   * If default sort is set on the list, sort items
   */
  if ($ideaList.attr('data-default-sort')) {
    var values = $ideaList.attr('data-default-sort').split(',');
    var sortAttr = values[0];
    var descOrAsc = values[1];

    sortElements(sortAttr, descOrAsc, ".ideas-list", ".idea-item");
    //set the select box to the right value to prevent confusion
    $('.ideas-sort-select').val($ideaList.attr('data-default-sort'));
  }

  // on change of select run the sort function, format is simple value,order.
  // So: likes,asc
  // It will look for the data attribute on the idea list element: data-likes="10"
  $('.ideas-sort-select').on('change', function (ev) {
    ev.preventDefault();
    var values = $(this).val().split(',');
    var sortAttr = values[0];
    var descOrAsc = values[1];

    // if gridder how is still open, remove it, otherwise it opens on the top
    $('.gridder-show').remove();

    sortElements(sortAttr, descOrAsc, '.ideas-list', '.idea-item');
  });

  $(document).on('sortIdeas', function (event) {
      if ($('.ideas-sort-select').length > 0) {
          var values    = $('.ideas-sort-select').val().split(',');
          var sortAttr  = values[0];
          var descOrAsc = values[1];
        
          sortElements(sortAttr, descOrAsc, '.ideas-list', '.idea-item');
      }
  });
});



function sortElements(arg, order, sel, elem) {
        var $selector = $(sel),
        $element = $selector.find(elem);

        if (arg === 'random') {
            var randomOrder = window.localStorage.getItem('randomOrder');
        
            if (randomOrder) {
                randomOrder = JSON.parse(randomOrder);
            }
    
            // Do we have a saved order in our local storage with the same amount of plans?
            // If there are new plans then it's better to shuffle the ideas again to ensure randomization
            if (randomOrder && randomOrder.length === $element.length) {
                
                // restore saved order from localstorage
                $element.sort(function (a, b) {
                    var l = $.inArray(parseInt($(a).attr('data-ideaid')), randomOrder);
                    var r = $.inArray(parseInt($(b).attr('data-ideaid')), randomOrder);
                    return (l < r) ? -1 : (l > r) ? 1 : 0;
                });
                
                $element.detach().appendTo($selector);
            } else {
                $element.shuffle();
            }
            
            // Save new random order
            saveElementsOrder($selector.find(elem));
        } else {
          $element.sort(function(a, b) {
                  var an = parseInt(a.getAttribute('data-'+ arg)),

                  bn = parseInt(b.getAttribute('data-'+ arg));

                  if (order === "asc") {
                          if (an > bn || isNaN(an))
                          return 1;
                          if (an < bn || isNaN(bn))
                          return -1;
                  } else if (order === "desc") {
                          if (an < bn || isNaN(an))
                          return 1;
                          if (an > bn || isNaN(bn))
                          return -1;
                  }
                  return 0;
          });

          $element.detach().appendTo($selector);
        }
}

function saveElementsOrder ($elem) {
    var order = [];
    
    $elem.each(function () {
        order.push($(this).data('ideaid'));
    });
    
    window.localStorage.setItem('randomOrder', JSON.stringify(order));
}

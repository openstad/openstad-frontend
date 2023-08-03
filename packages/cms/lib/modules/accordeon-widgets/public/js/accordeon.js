apos.define('accordeon-widgets', {
  extend:    'openstad-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {
      $widget.find('.accordeon-item .title').on('click', function (e) {
        e.preventDefault();
        
        var $accordeonItem = $(this).closest('.accordeon-item');
        
        if ($accordeonItem.hasClass('closed')) {
          // Close all open items
          closeItem($widget.find('.accordeon-item:not(.closed)'));
          
          // Open the clicked item
          openItem($accordeonItem);
        } else {
          // Close all open items
          closeItem($widget.find('.accordeon-item:not(.closed)'));
        }
      });
      
      $widget.find('.accordeon-item .title').each(function () {
        $(this).attr('tabindex', '-1');
      });
    }
  }
});

function closeItem($el) {
  $el.addClass('closed').find('.description').css({maxHeight: 0});
  
  // Remove focusability of description div and any underlying links and of the description
  $el.find('.description a').each(function () {
    $(this).attr('tabindex', '-1');
  });
  $el.find('.description').removeAttr('tabindex').focus();
}

function openItem($el) {
  // Get height of description and set it as maxheight on the accordeon item
  var height = $el.find('.description').children().toArray().reduce(function (total, child) {
    return total + $(child).outerHeight(true);
  }, 0);
  
  $el.removeClass('closed').find('.description').css({maxHeight: height});
  
  // Allow focusability of description div and any underlying links and of the description
  // Focus on the description div right away, so screen readers can start reading the content
  $el.find('.description a').each(function () {
    $(this).removeAttr('tabindex');
  })
  $el.find('.description').attr('tabindex', '0').focus();
}

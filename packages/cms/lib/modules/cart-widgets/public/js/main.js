apos.define('cart-widgets', {
  construct: function (self, options) {
    /**
     * Cart add is called outside of the widget
     */
    $('.cart-add').click(function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      $.ajax({
        url: '/cart/' + $(this).attr('data-product-id'),
        method: 'GET',
        success: function () {
          self.displayAddToCartSuccess();
        },
        error: function () {
          self.displayAddToCartError();
        }
      })
    });

    $('.cart-remove').click(function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      $.ajax({
        url: '/cart/remove' + $(this).attr('data-product-id'),
        method: 'GET',
        success: function () {
          self.displayAddToCartSuccess();
        },
        error: function () {
          self.displayAddToCartError();
        }
      })
    });

    // for binding events to the widgets
    self.play = function($widget, data, options) {}

    self.displayAddToCartSuccess = function () {
      alert('toegevoegd')
    }

    self.displayAddToCartError = function () {
      alert('error')
    }
  }
});

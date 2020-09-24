apos.define('cart-widgets', {
  extend: 'openstad-widgets',
  construct: function (self, options) {


    // for binding events to the widgets
    self.play = function($widget, data, options) {}

    self.bindCartActions = function () {
      /**
       * Cart add is called outside of the widget
       */
      $('.cart-add').click(function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        $.ajax({
          url: '/cart/' + $(this).attr('data-product-id') + '?q=' + $(this).attr('data-quantity'),
          method: 'GET',
          success: function () {
            $('body').trigger('ajaxRefresh')
            self.displayAddToCartSuccess();
          },
          error: function () {
            self.displayAddToCartError();
          }
        })
      });

      $('.cart-empty').click(function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        $.ajax({
          url: '/cart/empty',
          method: 'GET',
          success: function () {
            $('body').trigger('ajaxRefresh')
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
          url: '/cart/remove/' + $(this).attr('data-product-id'),
          method: 'GET',
          success: function () {
            $('body').trigger('ajaxRefresh')
          },
          error: function () {
            self.displayAddToCartError();
          }
        })
      });
    }

    self.displayAddToCartSuccess = function () {
      alert('toegevoegd')
    }

    self.displayAddToCartError = function () {
      alert('error')
    }

    self.bindCartActions();

    $('body').on('openstadAjaxRefresh', function () {
      self.bindCartActions();
    })

  }
});

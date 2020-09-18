/**
 * This widget load the react-admin library for managing the apply_filters
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;
const Cart = require('./lib/cart.js');


module.exports = {
  extend: 'openstad-widgets',
  label: 'Admin panel',
  addFields: [
  //  styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

      const superPushAssets = self.pushAssets;

      self.pushAssets = function () {
        superPushAssets();
        self.pushAsset('script', 'main', { when: 'always' });
      };

      self.expressMiddleware = {
        when: 'afterRequired',
        middleware: (req, res, next) => {
          const cart = (typeof req.session.cart !== 'undefined') ? req.session.cart : false;
          req.data.cart = cart;
          next();
        }
      };

      self.apos.app.get('/cart', (req, res) => {
          let sess = req.session;
          let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
          return self.sendPage(req, '/cart', {});
      });

      self.apos.app.get('/cart/remove/:id', (req, res) => {
         Cart.removeFromCart(parseInt(req.params.id, 10), req.session.cart);
         res.redirect('/cart');
      });

      self.apos.app.get('/cart/empty/:nonce', (req, res) => {
          Cart.emptyCart(req);
          res.redirect('/cart');
      });

      self.addToCart = function (req, replaceQuantity) {
        let productId = parseInt(req.params.productId, 10);
        let qty = req.query.q ? parseInt(req.query.q, 10) : 1;
        const cart = req.session.cart ? {...req.session.cart} : false;

        if (qty === 0) {
          Cart.removeFromCart(parseInt(id, 10), req.session.cart);
        } else if(qty > 0) {
          const product = req.data.products.find(product => product.id === productId);
          const cart = req.session.cart ? {...req.session.cart} : false;

          if (product) {
            req.session.cart = Cart.addToCart(product, qty, cart, replaceQuantity);
          }
        }
      }

      //add is direct link for products to check
      self.apos.app.get('/add/:productId', (req, res) => {
        self.addToCart(req, true);
        res.redirect('/checkout');
      });

      self.apos.app.get('/cart/:productId', (req, res) => {
        self.addToCart(req);
        res.redirect('/');
      });

      self.apos.app.get('/checkout', (req, res) => {
        let sess = req.session;
        let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;

        return self.sendPage(req, '/checkout', {});
      });

      self.apos.app.post('/checkout', (req, res) => {
        let sess = req.session;
        let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;

        res.render('checkout', {
            pageTitle: 'Checkout',
            cart: cart,
            checkoutDone: true
        });
      });
    }
};

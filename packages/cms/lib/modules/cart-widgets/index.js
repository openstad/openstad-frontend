/**
 * This widget load the react-admin library for managing the apply_filters
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;
const Cart = require('./lib/cart.js');

const isValidNonce = (nonce) => {
  return true;
}

module.exports = {
  extend: 'openstad-widgets',
  label: 'Admin panel',
  addFields: [
  //  styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

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

      self.apos.app.get('/cart/remove/:id/:nonce', (req, res) => {
         let id = req.params.id;
         if(/^\d+$/.test(id) && isValidNonce(req.params.nonce, req)) {
             Cart.removeFromCart(parseInt(id, 10), req.session.cart);
             res.redirect('/cart');
         } else {
             res.redirect('/');
         }
      });

      self.apos.app.get('/cart/empty/:nonce', (req, res) => {
          if(isValidNonce(req.params.nonce, req)) {
              Cart.emptyCart(req);
              res.redirect('/cart');
          } else {
              res.redirect('/');
          }
      });

      self.apos.app.post('/cart', (req, res) => {
          let qty = parseInt(req.body.qty, 10);
          let product = parseInt(req.body.product_id, 10);
          if(qty > 0 && isValidNonce(req.body.nonce, req)) {
              Products.findOne({product_id: product}).then(prod => {
                  let cart = (req.session.cart) ? req.session.cart : null;
                  Cart.addToCart(prod, qty, cart);
                  res.redirect('/cart');
              }).catch(err => {
                 res.redirect('/');
              });
          } else {
              res.redirect('/');
          }
      });

      self.apos.app.post('/cart/update', (req, res) => {
        let ids = req.body.products;

        if(isValidNonce(req.body.nonce, req)) {
            let cart = (req.session.cart) ? req.session.cart : null;
            let i = (!Array.isArray(ids)) ? [ids] : ids;
            let q = (!Array.isArray(qtys)) ? [qtys] : qtys;
            Cart.updateCart(i, q, cart);
            res.redirect('/cart');
        } else {
            res.redirect('/');
        }
      });

      self.apos.app.get('/checkout', (req, res) => {
        let sess = req.session;
        let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;

        return self.sendPage(req, '/checkout', {});
      });

      self.apos.app.post('/checkout', (req, res) => {
        let sess = req.session;
        let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
        if(isValidNonce(req.body.nonce, req)) {
            res.render('checkout', {
                pageTitle: 'Checkout',
                cart: cart,
                checkoutDone: true
            });
        } else {
            res.redirect('/');
        }
      });
};

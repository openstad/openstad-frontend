/**
 * This widget load the react-admin library for managing the apply_filters
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Admin panel',
  addFields: [
  //  styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
      self.apos.app.get('/', (req, res) => {
        if(!req.session.cart) {
            req.session.cart = {
                items: [],
                totals: 0.00,
                formattedTotals: ''
            };
        }
        
        Products.find({price: {'$gt': 0}}).sort({price: -1}).limit(6).then(products => {
            let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
            products.forEach( (product) => {
               product.formattedPrice = format.format(product.price);
            });
            res.render('index', {
                pageTitle: 'Node.js Shopping Cart',
                products: products,
                nonce: Security.md5(req.sessionID + req.headers['user-agent'])
            });

        }).catch(err => {
            res.status(400).send('Bad request');
        });

      });

      self.apos.app.get('/cart', (req, res) => {
          let sess = req.session;
          let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
          res.render('cart', {
              pageTitle: 'Cart',
              cart: cart,
              nonce: Security.md5(req.sessionID + req.headers['user-agent'])
          });
      });

      self.apos.app.get('/cart/remove/:id/:nonce', (req, res) => {
         let id = req.params.id;
         if(/^\d+$/.test(id) && Security.isValidNonce(req.params.nonce, req)) {
             Cart.removeFromCart(parseInt(id, 10), req.session.cart);
             res.redirect('/cart');
         } else {
             res.redirect('/');
         }
      });

      self.apos.app.get('/cart/empty/:nonce', (req, res) => {
          if(Security.isValidNonce(req.params.nonce, req)) {
              Cart.emptyCart(req);
              res.redirect('/cart');
          } else {
              res.redirect('/');
          }
      });

      self.apos.app.post('/cart', (req, res) => {
          let qty = parseInt(req.body.qty, 10);
          let product = parseInt(req.body.product_id, 10);
          if(qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
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
          let ids = req.body["product_id[]"];
          let qtys = req.body["qty[]"];
          if(Security.isValidNonce(req.body.nonce, req)) {
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
          res.render('checkout', {
              pageTitle: 'Checkout',
              cart: cart,
              checkoutDone: false,
              nonce: Security.md5(req.sessionID + req.headers['user-agent'])
          });
      });

      self.apos.app.post('/checkout', (req, res) => {
          let sess = req.session;
          let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
          if(Security.isValidNonce(req.body.nonce, req)) {
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

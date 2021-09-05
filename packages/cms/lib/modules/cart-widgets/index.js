/**
 * This widget load the react-admin library for managing the apply_filters
 * It can be included in a page, has it's own routers.
 */
const styleSchema = require('../../../config/styleSchema.js').default;
const Cart = require('./lib/cart.js');
const Url = require('url')
const qs = require('qs');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Cart',
  addFields: [
      {
          name: 'displayQuantity',
          type: 'boolean',
          label: 'Display quantity'
      },
      {
          name: 'removableItems',
          type: 'boolean',
          label: 'Allow items to be removed?'
      },
      {
        type: 'select',
        name: 'currency',
        label: 'Currency SIGN',
        choices: [
          {
            value: '€',
            label: "Euro (€)",
          },
          {
            value: '$',
            label: "Dollar ($)",
          },
          {
            value: 'R',
            label: "ZAR (R)",
          },
          {
            value: '£',
            label: "Pound (£)",
          },
          {
            value: 'R',
            label: "ZAR (£)",
          }
        ]
      },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

      const superPushAssets = self.pushAssets;

      self.pushAssets = function () {
        superPushAssets();
        self.pushAsset('script', 'main', { when: 'always' });
        self.pushAsset('stylesheet', 'main', { when: 'always' });
      };

      self.expressMiddleware = {
        when: 'afterRequired',
        middleware: (req, res, next) => {
          if (req.query.clearCart) {
            //empty cart
            req.session.cart = null;

            req.session.save(() => {
              // redirect to the same url, but without the cookie url
              let queryParams = req.query;
              delete queryParams.clearCart
              const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
              const cmsUrl = siteConfig.cms.url;

              const redirectUrl = Url.parse(req.originalUrl);
              const pathName = redirectUrl ? redirectUrl.pathname : '/';
              const redirect = cmsUrl + pathName + '?'+ qs.stringify(queryParams);


              res.redirect(redirect);
            });
          }

          Cart.calculateTotals(req.session.cart);

          const cart = (typeof req.session.cart !== 'undefined') ? req.session.cart : false;
          const orderConfig = req.data.global.siteConfig && req.data.global.siteConfig.order ? req.data.global.siteConfig.order : {};
          const orderFees = orderConfig.orderFees ? orderConfig.orderFees : [];
          const cartTotals = cart && cart.totals ? cart.totals : 0;
          let totalOrderFees = 0;

          // calculer total order fees
          orderFees.forEach((fee) => {
            totalOrderFees = totalOrderFees + parseFloat(fee.price);
          });

          req.data.orderFees = orderFees;
          req.data.totalOrderFees = totalOrderFees;
          req.data.totalOrder =  totalOrderFees + cartTotals;
          req.data.cart = cart;
          req.data.cartIsEmpty = cart;
          next();
        }
      };

      self.apos.app.get('/cart/remove/:id', (req, res) => {
         req.session.cart = Cart.removeFromCart(parseInt(req.params.id, 10), req.session.cart);
         res.redirect('/cart');
      });

      self.apos.app.get('/cart/empty', (req, res) => {
          req.session.cart = Cart.initCart();
          res.redirect('/cart');
      });

      self.addToCart = function (req, replaceQuantity) {
        let productId = parseInt(req.params.productId, 10);
        let qty = req.query.q ? parseInt(req.query.q, 10) : 1;
        const cart = req.session.cart ? {...req.session.cart} : false;

        console.log('->>> productId', productId)

        if (qty === 0) {
          Cart.removeFromCart(productId, req.session.cart);
        } else if (qty > 0) {
          const product = req.data.products.find(product => product.id === productId);
          const cart = req.session.cart ? {...req.session.cart} : false;
            console.log('->>> product', req.data.products)
            console.log('->>> product', product)

          if (product) {
            req.session.cart = Cart.addToCart(product, qty, cart, replaceQuantity);
          }
        }
      }

      //add is direct link for products to check
      self.apos.app.get('/add/:productId', async (req, res) => {
          self.addToCart(req, true);
          await req.session.save();
          res.redirect('/checkout');
      });

      //add is direct link for products to check
      self.apos.app.get('/cart/set/:productId',async (req, res) => {
          req.session.cart = Cart.initCart();
          self.addToCart(req, true);
          await req.session.save();
          res.redirect('/checkout');
      });

      self.apos.app.get('/cart/:productId', (req, res) => {
        self.addToCart(req, true);
        res.redirect('/');
      });

    }
};

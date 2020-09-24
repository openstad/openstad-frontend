'use strict';

const config = require('./cart-config');

class Cart {

    static initCart(cart) {

      if (!cart) {
        cart = {
          items : [],
          totals : 0.00,
          formattedTotals : '',
        }
      }

      return cart;
    }


    static getItem(productId, cart) {
      return cart && cart.items ? cart.items.find(item => item.id === productId) : null;
    }

    static addToCart(product = null, qty = 1, cart, replaceQuantity = false) {
      cart = this.initCart(cart);

      let productInCart = this.inCart(product.id, cart);

      console.log('productInCart',productInCart)

      if (productInCart) {
        cart.items = cart.items.map((item) => {
          item.qty = replaceQuantity ? qty : (qty + qty);
          return item;
        });
      } else {
          let format = new Intl.NumberFormat(config.locale.lang, {style: 'currency', currency: config.locale.currency });

          let prod = {
            id: product.id,
            name: product.name,
            product: product,
            price: product.price,
            qty: qty,
            image: product.image,
            formattedPrice: format.format(product.price)
          };

          cart.items.push(prod);

          this.calculateTotals(cart);
      }

      return cart;
    }

    static removeFromCart(id = 0, cart) {
      for(let i = 0; i < cart.items.length; i++) {
          let item = cart.items[i];
          console.log('item', item.id, id);

          if(item.id === id) {
              cart.items.splice(i, 1);
              this.calculateTotals(cart);
          }
      }

      return cart;
    }

    static updateCart(ids = [], qtys = [], cart) {
        let map = [];
        let updated = false;

        ids.forEach(id => {
           qtys.forEach(qty => {
              map.push({
                  id: parseInt(id, 10),
                  qty: parseInt(qty, 10)
              });
           });
        });

        map.forEach(obj => {
            cart.items.forEach(item => {
               if(item.id === obj.id) {
                   if(obj.qty > 0 && obj.qty !== item.qty) {
                       item.qty = obj.qty;
                       updated = true;
                   }
               }
            });
        });

        if(updated) {
            this.calculateTotals(cart);
        }
    }

    static inCart(productId = 0, cart) {
        let item = cart.items ? cart.items.find(item => item.id === productId) : false;
        return !!item;
    }

    static calculateTotals(cart) {
        cart.totals = 0.00;
        cart.items.forEach(item => {
            let price = item.price;
            let qty = item.qty;
            let amount = price * qty;

            cart.totals += amount;
        });

        this.setFormattedTotals(cart);
    }

   static emptyCart(cart) {
      return initCart();
    }

    static setFormattedTotals(cart) {
        let format = new Intl.NumberFormat(config.locale.lang, {style: 'currency', currency: config.locale.currency });
        let totals = cart.totals;
        cart.formattedTotals = format.format(totals);
    }

}

module.exports = Cart;

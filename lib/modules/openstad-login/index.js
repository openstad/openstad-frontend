/**
 * This module manages loggin into aposthrophecms with the openstad oAuth user,
 * when this user is an
 * @type {Object}
 */
 var credential = require('credential');


module.exports = {
  construct: function(self, options) {
    const superPageBeforeSend = self.pageBeforeSend;

    console.log('superPageBeforeSend', superPageBeforeSend);

    self.pageBeforeSend = (req, callback) => {
      console.log('superPageBeforeSend', req.data.openstadUser);
      console.log('superPageBeforeSend',req.data);
      self.pw = credential();

      if (!req.data.isAdmin) {
        self.apos.groups.find(req, { title: 'admin' }).joins(false).toObject(function(err, group) {
          console.log('>>>>> group', group);
        });

        return callback();

      }

      // if logged in to aposthrophecms, move on
      if (req.user && req.user.email === req.data.openstadUser.email) {
        callback();
      // logout apos when
      } else if  (req.user && req.user.email === req.data.openstadUser.email) {
        req.apos.logout();
      }

      self.apos.users.find(req, { username: req.data.openstadUser.email }).permission(false).toObject(function(err, aposUser) {
          if (err) {
            return callback();
          }

          self.apos.groups.find(req, { title: 'admin' }).joins(false).toObject(function(err, group) {

              if (err) {
                return callback();
               //   return next(err);
              }

              if (false && !group) {
                return callback();
              } else {

               const user = req.data.openstadUser;

               userData = {
                   username: user.email,
                   password: '90asdlasdkl12901209lkdaslk091209',
                   title: user.email,
                   firstName: user.firstName,
                   lastName: user.lastName,
                   email: user.email,
          //         groupIds: [ group._id ],
                   _permissions: {
                     admin: true
                   }
                 };

                 const insertOrUpdate = aposUser ? self.apos.users.update : self.apos.users.insert;

                 console.log('userData', userData);

                 insertOrUpdate(req, userData, {}, (err, userObject) => {
                   console.log('errr', err);
                   console.log('userObject', userObject);

                   self.apos.users.find(req, { username: user.email }).permission(false).toObject(function(err, aposUser) {
                     console.log('param2',aposUser );
                    // callback();

                     req.login(aposUser, function(err) {
                       console.log('logogogo',err );

                    /*   self.apos.groups.find(req, { title: 'admin' }).joins(false).toObject(function(err, group) {
                         console.log('->>>> group', group);
                         return callback();
                       });*/

                       if (err) {
                         console.log('err', err);
                         //return next(err)
                         return callback();
                       } else {
                         return req.res.redirect('/');;
                       }


                       // Start a whole new request, but logged in. After this they
                       // have the cookie so they can log out and back in normally if they want
                      // req.res.cookie('demo_autologin', 1);
        //                                return next();
                     });
                   });
                });
            }

           });
        });

      //  callback();
      }
  }
};

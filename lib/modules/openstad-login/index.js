/**
 * This module manages loggin into aposthrophecms with the openstad oAuth user,
 * when this user is an
 * @type {Object}
 */

const generateRandomPassword = () => {
  return require('crypto').randomBytes(64).toString('hex');
}

module.exports = {
  construct: function(self, options) {
    const superPageBeforeSend = self.pageBeforeSend;

    self.pageBeforeSend = (req, callback) => {

      if (!req.data.isAdmin || !req.data.isEditor) {
        self.apos.groups.find(req, { title: 'admin' }).joins(false).toObject(function(err, group) {
          console.log('>>>>> group', group);
        });

        return callback();
      }

      const groupName = req.data.isAdmin ? 'admin' : 'editor';

      // if logged in to aposthrophecms, move on
      if (req.user && req.user.email === req.data.openstadUser.email) {
        console.log('->>> already logged in');
        return callback();
      // logout apos when
      } else if  (req.user && req.user.email === req.data.openstadUser.email) {
        console.log('->>> logout');
        req.apos.logout();
      }

      self.apos.users.find(req, { username: req.data.openstadUser.email }).permission(false).toObject(function(err, aposUser) {
          if (err) {
            return callback();
          }

          ///Call `self.apos.tasks.getReq()` to get a `req` object with
          // unlimited admin permissions.
          var taskReq = self.apos.tasks.getReq();
          self.apos.groups.find(taskReq, { title: groupName }).toObject().then(function(group) {
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
                   password: generateRandomPassword(),
                   title: user.email,
                   firstName: user.firstName,
                   lastName: user.lastName,
                   email: user.email,
                   groupIds: [ group._id ],
              /*     _permissions: {
                     admin: true
                   }*/
                 };

                 const insertOrUpdate = aposUser ? self.apos.users.update : self.apos.users.insert;

                 insertOrUpdate(taskReq, userData, {}, (err, userObject) => {
                   // after update or insert refetch the user to ensure we have a valid user
                   self.apos.users.find(req, { username: user.email }).permission(false).toObject(function(err, aposUser) {
                     req.login(aposUser, function(err) {
                       if (err) {
          //               console.log('err', err);
                         //return next(err)
                         return callback();
                       } else {
                         return req.res.redirect('/');;
                       }
                     });
                   });
                });
            }

           });
        });

      //  callback();
      }
  },
};

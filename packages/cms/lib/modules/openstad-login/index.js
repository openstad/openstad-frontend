/**
 * This module manages loggin into aposthrophecms with the openstad oAuth user,
 * when this user is an
 * @type {Object}
 */

const generateRandomPassword = () => {
  return require('crypto').randomBytes(64).toString('hex');
}

module.exports = {
  improve: 'apostrophe-login',
  construct: function(self, options) {
    self.apos.app.get('/login',  (req, res, next) => {
      const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
      res.redirect(siteUrl + '/oauth/login');
    });

    self.pageBeforeSend = (req, callback) => {

      // only login users into ApostropheCMS that are admin or editor
      if (!req.data.isAdmin && !req.data.isEditor) {
        return callback();
      }

      const groupName = req.data.isAdmin ? 'admin' : (req.data.isEditor ? 'editor' : false);

      const user = req.data.openstadUser;

      // this is a hack to allow admin to login with a unique code without email, since email is expected
      const email = user.email ? user.email : user.id + '@openstad.org';

      // if logged in to aposthrophecms, move on
      if (req.user && req.user.email === email) {
        return callback();
      // logout CMS when apostropheUser is different then openstadUser
      } else if  (req.user && req.user.email === req.data.openstadUser.email) {
        req.apos.logout();
      }


      self.apos.users.find(req, { username: email }).permission(false).toObject(function(err, aposUser) {
          if (err) {
            return callback();
          }

          ///Call `self.apos.tasks.getReq()` to get a `req` object with
          // unlimited admin permissions.
          var taskReq = self.apos.tasks.getReq();

          self.apos.groups.find(taskReq, { title: groupName }).toObject().then(function(group) {
              if (err) {
                return callback(err);
              }
              
              // throw error if group is not found, should be defined in siteConfig
              if (!group) {
                return callback(`${groupName} group for logging in user not found`);
              } else {
            //   const user = req.data.openstadUser;
            //   const email = user.email ? user.email : user.id + '@openstad.org';
               const username = user.id ? 'openstad_3_' + user.id : user.id;
               const firstName = user.firstName ? user.firstName : 'first_name_' +user.id;
               const lastName = user.lastName ? user.lastName : 'last_name_' +user.id;

               // define user object
               userData = {
                   username: email, // easy way to keep the username unique is using the email, wont be used anyway
                   title: email,
                   password: generateRandomPassword(), // generate a random password since apostrophe expects it
                   firstName: firstName,
                   lastName: lastName,
                   email: email,
                   groupIds: [ group._id ],
                 };

                 if (aposUser) {
                   userData._id = aposUser._id;
                 }

                 const insertOrUpdate = aposUser ? self.apos.users.update : self.apos.users.insert;

                 // In case user relogs in the data gets updated
                 // one downside, if the user's admin or editor rights are revoked,
                 // this will only go into effect after logging out
                 insertOrUpdate(taskReq, userData, {}, (err, userObject) => {

                   // after update or insert refetch the user to ensure we have a valid user
                   self.apos.users.find(req, { username: email }).permission(false).toObject(function(err, aposUser) {

                     req.login(aposUser, function(err) {
                       if (err) {
                         return callback();
                       } else {
                         const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
                         return req.res.redirect(siteUrl + '/');
                       }
                     });
                   });
                });
              }
           });
        });
      }
  },
};

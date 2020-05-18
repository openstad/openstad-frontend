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
    self.apos.app.get('/login',  (req, res, next) => {
      res.redirect('/oauth/login');
    });

    self.pageBeforeSend = (req, callback) => {

      console.log('pageBeforeSend');
      console.log('req.user ',req.data.openstadUser);

      // only login users into ApostropheCMS that are admin or editor
      if (!req.data.isAdmin && !req.data.isEditor) {
        return callback();
      }

      const groupName = req.data.isAdmin ? 'admin' : (req.data.isEditor ? 'editor' : false);

      console.log('groupName',groupName);
      console.log('req.user ',req.user);


      // if logged in to aposthrophecms, move on
      if (req.user && req.user.email === req.data.openstadUser.email) {
        return callback();
      // logout CMS when apostropheUser is different then openstadUser
      } else if  (req.user && req.user.email === req.data.openstadUser.email) {
        req.apos.logout();
      }

      self.apos.users.find(req, { username: req.data.openstadUser.email }).permission(false).toObject(function(err, aposUser) {
        console.log('req.usererr ', err);

          if (err) {
            return callback();
          }

          console.log('req.user ', aposUser);


          ///Call `self.apos.tasks.getReq()` to get a `req` object with
          // unlimited admin permissions.
          var taskReq = self.apos.tasks.getReq();
          self.apos.groups.find(taskReq, { title: groupName }).toObject().then(function(group) {
            console.log('req.group ', group);
            console.log('req.group ', err);

              if (err) {
                return callback(err);
              }

              // throw error if group is not found, should be defined in siteConfig
              if (!group) {
                return callback(`${groupName} group for logging in user not found`);
              } else {
               const user = req.data.openstadUser;

               // define user object
               userData = {
                   username: user.email, // easy way to keep the username unique is using the email, wont be used anyway
                   title: user.email,
                   password: generateRandomPassword(), // generate a random password since apostrophe expects it
                   firstName: user.firstName,
                   lastName: user.lastName,
                   email: user.email,
                   groupIds: [ group._id ],
                   advisoryLock: {}
                 };

                 const insertOrUpdate = aposUser ? self.apos.users.update : self.apos.users.insert;
                 console.log('req.userData ', userData);

                 // In case user relogs in the data gets updateds
                 // one downside, if the user's admin or editor rights are revoked,
                 // this will only go into effect after logging out
                 insertOrUpdate(taskReq, userData, {}, (err, userObject) => {
                   // after update or insert refetch the user to ensure we have a valid user
                   self.apos.users.find(req, { username: user.email }).permission(false).toObject(function(err, aposUser) {
                     console.log('eeeerrr ', err);

                     req.login(aposUser, function(err) {
                       console.log('err111 ', err);

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
      }
  },
};

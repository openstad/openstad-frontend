module.exports = {
  session: {
    // If this still says `undefined`, set a real secret!
    secret: process.env.SESSION_SECRET
  },
  csrf: {
   exceptions: [
//     '/modules/arguments-form-widgets/submit',
//     '/modules/user-form-widgets/submit',
//     '/modules/idea-form-widgets/submit',
     '/image',
     '/images',
     '/vimeo-upload',
     '/fetch-image',
     '/api/site/167/newslettersignup',
     '/api/site/*/newslettersignup',
//     '/api/site/*/vote/*/toggle',

//     '/vote',
//     '/api/**'
   ]
 },

};

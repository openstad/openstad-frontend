module.exports = {
  session: {
    // If this still says `undefined`, set a real secret!
    secret: '0f9233cchbgccfOOnu89894f96e4a'
  },
  csrf: {
   exceptions: [
     '/modules/arguments-form-widgets/submit',
     '/modules/user-form-widgets/submit',
     '/modules/idea-form-widgets/submit',
     '/image',
     '/images',
     '/fetch-image'
   ]
 }
};

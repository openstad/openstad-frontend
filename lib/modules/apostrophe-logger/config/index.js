module.exports = {
  bugsnag: {
    getUrl: () => {
      return process.env.LOGGING_PROVIDER_BUGSNAG_URL;
    },
    getKey: () => {
      return process.env.LOGGING_PROVIDER_BUGSNAG_KEY;
    }
  }
};

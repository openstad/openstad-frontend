const config = require('./config/index');

module.exports = {
  alias: 'logger',
  construct: (self, options) => {
    const clientLoggingProvider = process.env.LOGGING_PROVIDER_CLIENT;
    const providerConfig = config[clientLoggingProvider];

    self.addHelpers({
      renderClientProvider: () => {
        if(!providerConfig) {
          return '';
        }

        return self.partial(clientLoggingProvider, { provider: providerConfig });
      }
    });
  }
};

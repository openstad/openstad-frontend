const LogProvider = require('./lib/logProvider').LogProvider;

module.exports = {
  alias: 'logger',
  logProvider: null,
  construct: (self, options) => {
    const clientLoggingProvider = process.env.LOG_PROVIDER_CLIENT;
    if(clientLoggingProvider) {
      this.logProvider = new LogProvider(clientLoggingProvider);
    }

    self.addHelpers({
      renderClientProvider: () => {
        if(!this.logProvider) {
          return '';
        }

        return self.partial(clientLoggingProvider, { provider: this.logProvider });
      }
    });
  }
};

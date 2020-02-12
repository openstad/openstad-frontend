const LogProvider = require('./lib/logProvider').LogProvider;

module.exports = {
  alias: 'logger',
  logProvider: null,
  construct: (self, options) => {
    const logProviderClient = process.env.LOG_PROVIDER_CLIENT;
    if(logProviderClient) {
      this.logProvider = new LogProvider(logProviderClient);
    }

    self.addHelpers({
      renderClientProvider: () => {
        if(!this.logProvider) {
          return '';
        }

        return self.partial(logProviderClient, { provider: this.logProvider });
      }
    });
  }
};

var log = require('debug')('app:cron');
const dns = require('dns');
const db = require('../db');
const k8s = require('@kubernetes/client-node');

const getK8sApi = () => {
  const kc = new k8s.KubeConfig()
  kc.loadFromCluster();
  return kc.makeApiClient(k8s.NetworkingV1beta1Api);
};

const lookupPromise = async (domain) => {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err, address, family) => {
      if(err) reject(err);
      resolve(address);
    });
  });
};

const getDomainIp = async (domain) => {
  try {
    return await lookupPromise(domain);
  } catch(error) {
    // Todo: log something

    return null;
  }
};

const checkHostStatus = async () => {

  const namespace = 'default'; //Todo: get this from env variable

  const sites = await db.Site.findAll();

  const k8sApi = getK8sApi();

  const promises = sites.map(async (site) => {
    const config = site.config;

    const domainIp = getDomainIp(site.domain);
    const loadbalancerIp = 1; //Todo: get loadBalancerIp form kubenetes/client

    const ingress = await k8sApi.readNamespacedIngress(site.name, namespace);

    if(domainIp !== null && domainIp === loadbalancerIp) {
      // Todo: check if ingress settings are correct?
      if(!ingress) {
        const response = await k8sApi.createNamespacedIngress(namespace, {
          apiVersions: 'networking.k8s.io/v1beta1',
          kind: 'Ingress',
          metadata: {name: `${site.name}-custom-domain`},
          spec: {
            rules: [{
              host: site.domain,
              http: {
                paths: [{
                  backend: {
                    serviceName: 'openstad-frontend-service',
                    servicePort: 4444
                  },
                  path: '/'
                }]
              }
            }],
            tls: [{hosts: [site.domain]}]
          }
        });
      }

      // update site config with status = true
      config.host = {
        status: true
      };
      return await site.update({config});
    }

    if(ingress) {
      await k8sApi.deleteNamespacedIngress(site.name, namespace)
    }

    config.host = {
      status: false
    };
    return await site.update({config});

  });

  await Promise.all(promises);

  // Todo: some output?
};
checkHostStatus();

// Purpose
// -------
// Check site host status.
module.exports = {
  cronTime: '20 */5 * * * *',
  runOnInit: false,
  onTick: async () => {

    // Todo: check if kubernetes is enables
    checkHostStatus();


  }
};

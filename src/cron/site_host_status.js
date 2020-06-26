var log = require('debug')('app:cron');
const dns = require('dns');
const db = require('../db');
const k8s = require('@kubernetes/client-node');

const getK8sApi = () => {
  const kc = new k8s.KubeConfig();
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

const getIngress = async (k8sApi, name, namespace) => {
  try {
    return await k8sApi.readNamespacedIngress(name, namespace);
  } catch(error) {
    //Todo: log something
    console.log(error);

    return null;
  }
};

const createIngress = async (k8sApi, name, domain, namespace) => {
  return k8sApi.createNamespacedIngress(namespace, {
    apiVersions: 'networking.k8s.io/v1beta1',
    kind: 'Ingress',
    metadata: {name: `${name}-custom-domain`},
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
      tls: [{hosts: [domain]}]
    }
  });
}

const checkHostStatus = async () => {

  const namespace = 'default'; //Todo: get this from env variable

  const sites = await db.Site.findAll();
  const k8sApi = getK8sApi();

  const promises = sites.map(async (site) => {
    // Todo: skip the sites with config.host.status === true?

    const config = site.config;

    const domainIp = getDomainIp(site.domain);
    const loadbalancerIp = 1; //Todo: get loadBalancerIp form kubenetes/client

    const ingress = getIngress(k8sApi, site.name, namespace);

    if(domainIp !== null && domainIp === loadbalancerIp) {
      // Todo: check if ingress settings are correct?
      if(!ingress) {
        try {
          const response = await createIngress(k8sApi, site.name, site.domain, namespace);
        } catch(error) {
          console.error(error);
          config.host = {
            status: true
          };
          return await site.update({config});
        }

      }

      // update site config with status = true
      config.host = {
        status: true
      };
      return await site.update({config});
    }

    // Check if ingress exists and remove it because domain ip does not match loadbalancer ip
    if(ingress) {
      try {
        await k8sApi.deleteNamespacedIngress(site.name, namespace)
      } catch(error) {
        console.error(error);
      }
    }

    config.host = {
      status: false
    };

    return await site.update({config});
  });

  await Promise.all(promises);

  // Todo: some output?
  console.log('all sites checked');
};

// Todo: remove this method when done debugging.
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

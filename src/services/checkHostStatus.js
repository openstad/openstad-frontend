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
    metadata: {
      //name must be unique, lowercase, alphanumer, - is allowed
      name: `${name}`,
      annotations: {
         'cert-manager.io/cluster-issuer': 'openstad-letsencrypt-prod',
         'kubernetes.io/ingress.class': 'nginx'
      }
    },
    spec: {
      rules: [{
        host: domain,
        http: {
          paths: [{
            // todo make this dynamic
            backend: {
              serviceName: 'openstad-frontend',
              servicePort: 4444
            },
            path: '/'
          }]
        }
      }],
      tls: [{
        secretName: dbName,
        hosts: [domain]
      }]
    }
  })
};

const checkHostStatus = async (conditions) => {
  const isOnK8s = !! process.env.KUBERNETES_NAMESPACE ;
  const namespace = process.env.KUBERNETES_NAMESPACE; //Todo: get this from env variable
  const where = conditions ? conditions : {};

  const sites = await db.Site.findAll({where});

  const promises = sites.map(async (site) => {
    // Todo: skip the sites with config.host.status === true?

    const config = site.config;
    //ensure it's an object so we dont have to worry about checks later
    config.host = config.host ? config.host : {};          //

    const domainIp = getDomainIp(site.domain);

    const loadbalancerIp = 1; //Todo: get loadBalancerIp form kubenetes/client

    config.host.ip = domainIp !== null && domainIp === loadbalancerIp ? true : false;

    if (isOnK8s) {
      const k8sApi = getK8sApi();

      // get ingress config files
      const ingress = getIngress(k8sApi, site.name, namespace);

      // if ip issset but not ingress try to create one
      if (config.host.ip  && !ingress) {
        try {
          const response = await createIngress(k8sApi, site.name, site.domain, namespace);
          config.host.ingress = true;
        } catch(error) {
          // don't set to false, an error might just be that it already exist and the read check failed
          console.error('Error updating ingress for ', site.name, ' domain: ', site.domain, ' :', error);
        }
      // else if ip is not set but ingress is set, remove the ingress file
      } else  if (!config.host.ip  && ingress) {
        try {
          await k8sApi.deleteNamespacedIngress(site.name, namespace)
          config.host.ingress = false;
        } catch(error) {
          //@todo how to deal with error here?
          //most likely it doesn't exists anymore if delete doesnt work, but could also be forbidden / 
          console.error('Error deleting ingress for ', site.name, ' domain: ', site.domain, ' :', error);
        }
      }
    }

    return await site.update({config});
  });

  await Promise.all(promises);

  // Todo: some output?
  console.log('all sites checked');
};

module.exports = checkHostStatus;

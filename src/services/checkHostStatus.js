const dns = require('dns');
const db = require('../db');
const k8s = require('@kubernetes/client-node');
const ip = require('ip');

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
         'kubernetes.io/ingress.class': 'nginx',
         // if www host isset it redirects always to www. if without is isset it redirects to not www
         'nginx.ingress.kubernetes.io/from-to-www-redirect': "true"
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
  const isOnK8s = !!process.env.KUBERNETES_NAMESPACE;
  const namespace = process.env.KUBERNETES_NAMESPACE;
  const where = conditions ? conditions : {};
  const serverIp = process.env.PUBLIC_IP ? process.env.PUBLIC_IP : ip.address();

  console.log('Server IP should be: ', serverIp, ' IP from env value is: ', process.env.PUBLIC_IP, ' npm thinks it is:', ip.address());

  const sites = await db.Site.findAll({where});

  const promises = sites.map(async (site) => {
    // Todo: skip the sites with hostStatus.status === true?

    let hostStatus = site.hostStatus;
    //ensure it's an object so we dont have to worry about checks later
    hostStatus = hostStatus ? hostStatus : {};          //

    const domainIp = getDomainIp(site.domain);

    hostStatus.ip = domainIp !== null && domainIp === serverIp ? true : false;

    if (isOnK8s) {
      const k8sApi = getK8sApi();

      // get ingress config files
      const ingress = getIngress(k8sApi, site.name, namespace);

      // if ip issset but not ingress try to create one
      if (hostStatus.ip  && !ingress) {
        try {
          const response = await createIngress(k8sApi, site.name, site.domain, namespace);
          hostStatus.ingress = true;
        } catch(error) {
          // don't set to false, an error might just be that it already exist and the read check failed
          console.error('Error updating ingress for ', site.name, ' domain: ', site.domain, ' :', error);
        }
      // else if ip is not set but ingress is set, remove the ingress file
      } else  if (!hostStatus.ip  && ingress) {
        try {
    //      await k8sApi.deleteNamespacedIngress(site.name, namespace)
          hostStatus.ingress = false;
        } catch(error) {
          //@todo how to deal with error here?
          //most likely it doesn't exists anymore if delete doesnt work, but could also be forbidden /
          console.error('Error deleting ingress for ', site.name, ' domain: ', site.domain, ' :', error);
        }
      }
    }

    return await site.update({hostStatus});
  });

  await Promise.all(promises);

  // Todo: some output?
  console.log('all sites checked');
};

module.exports = checkHostStatus;

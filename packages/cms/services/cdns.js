const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.contructComponentsCdn = async function () {
  // construct cdn urls
  let openstadComponentsCdn =
    process.env.OPENSTAD_COMPONENTS_CDN ||
    'https://cdn.jsdelivr.net/npm/openstad-components@{version}/dist';
  if (openstadComponentsCdn.match('{version}')) {
    try {
      let tag = await getTag();

      // get current published version
      ({ stdout, stderr } = await exec('npm view --json openstad-components'));
      let info = stdout && stdout.toString();
      info = JSON.parse(info);
      let version = info['dist-tags'][tag];
      if (!version) {
        // fallback
        let packageFile =
          fs.readFileSync(`${__dirname}/package.json`).toString() || '';
        let match =
          packageFile &&
          packageFile.match(
            /"openstad-components":\s*"(?:[^"\d]*)((?:\d+\.)*\d+)"/
          );
        version = (match && match[1]) || null;
      }
      openstadComponentsCdn = openstadComponentsCdn.replace(
        '{version}',
        version
      );
      console.log('Using cdn', openstadComponentsCdn);
    } catch (err) {
      console.log('Error constructing cdn url', err);
    }
  }

  return openstadComponentsCdn;
};

exports.contructReactAdminCdn = async function () {
  // construct cdn urls
  let openstadReactAdminCdn =
    process.env.OPENSTAD_REACT_ADMIN_CDN ||
    'https://cdn.jsdelivr.net/npm/openstad-react-admin@{version}/dist';
  if (openstadReactAdminCdn.match('{version}')) {
    try {
      let tag = await getTag();

      // get current published version
      ({ stdout, stderr } = await exec('npm view --json openstad-react-admin'));
      let info = stdout && stdout.toString();
      info = JSON.parse(info);
      let version = info['dist-tags'][tag];
      if (!version) {
        // fallback
        let packageFile =
          fs.readFileSync(`${__dirname}/package.json`).toString() || '';
        let match =
          packageFile &&
          packageFile.match(
            /"openstad-react-openstadComponentsCdn":\s*"(?:[^"\d]*)((?:\d+\.)*\d+)"/
          );
        version = (match && match[1]) || null;
      }
      openstadReactAdminCdn = openstadReactAdminCdn.replace(
        '{version}',
        version
      );
      console.log('Using cdn', openstadReactAdminCdn);
    } catch (err) {
      console.log('Error constructing cdn url', err);
    }
  }

  return openstadReactAdminCdn;
};

async function getTag() {
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);

  let branch = '';
  let tag = 'alpha';

  try {
    let { stdout, stderr } = await exec('git rev-parse --abbrev-ref HEAD');
    branch = stdout && stdout.toString().trim();
  } catch (error) {
    // As a fallback we check for the CDN_DIST_TAG env variable
    if (process.env.CDN_DIST_TAG) {
      tag = process.env.CDN_DIST_TAG;
    }
    console.warn(`Could not get branch via git; fallback to ${tag}`);
  }

  if (branch == 'release') tag = 'beta';
  if (branch == 'master') tag = 'latest';

  return tag;
}

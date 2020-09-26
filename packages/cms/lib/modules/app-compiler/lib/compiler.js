//const archiver = require('archiver');
var ncp = require('ncp').ncp;
ncp.limit = 16;

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

/**
 * Compile defined UI to an app
 * buildData : {
    settings: {
      appTemplate: String
    }
 * }
 */


const Compiler = async function (buildData) {
  /**
   * 1. Create app build folder
   */
   const tmpDir = os.tmpdir();
   const appDirName = 'app-build-' + (new Date()).getTime();
   const appDir = tmpDir + '/' + appDirName;


   if (!fs.existsSync(appDir)){
     fs.mkdirSync(appDir);
   }

   const appTemplate = buildData.settings.appTemplate ? buildData.settings.appTemplate : 'clean';
   const appTemplateDir =

   //copy template to files
   ncp(appTemplateDir, appDir)

   //create custom files based upon appData

   //layout

   //screens

   //navigation


   //output code as zip
   //zipDirectory();
};

module.exports = Compiler;

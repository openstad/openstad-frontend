/**
 * Compile defined UI to an app
 * buildData : {
    template: String
 * }
 */


const Compiler = (function (buildData) {
/**
 * 1. Create app build folder
 */
 const tmpDir = os.tmpdir();
 const appDirName = 'app-build-' + (new Date()).getTime();
 const appDir = tmpDir + '/' + appDirName;


 if (!fs.existsSync(appDir)){
   fs.mkdirSync(appDir);
 }

 const appTemplate = buildData.name;
 



})();

module.exports = Compiler;

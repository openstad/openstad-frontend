//const archiver = require('archiver');
const ncp = require('ncp').ncp;
ncp.limit = 16;
const fs = require('fs');


//const templateParser = require('templateParser.js')
const nunjucks          = require('nunjucks');

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


const templates = {
  navigation : {
    line: "import [:name] from [:path];"
  },
  import : {
    line: "import [:name] from [:path];"
  }
}

/**
 * Compile defined UI to an app
 * buildData : {
    settings: {
      appTemplate: String
    },
    screens: {
      settings: {},
      screens: [{
        inTabMenu:
        inDrawerMenu:
      }]
    },
    navigation: {
      settings: {},
    },

 * }
 */


const Compiler = async function (buildData) {
  /**
   * 1. Create app build folder
   */
   const tmpDir = os.tmpdir();
   const appDirName = 'app-build-' + (new Date()).getTime();
   const appDir = tmpDir + '/' + appDirName;
   const appDefaultDirs = ['screens']

   if (!fs.existsSync(appDir)){
     fs.mkdirSync(appDir);
   }



   const appTemplate = buildData.settings.appTemplate ? buildData.settings.appTemplate : 'clean';
   const appTemplateDir = path.resolve(__dirname + '/templates/' + appTemplate);

   //copy template directory to files
   ncp(appTemplateDir, appDir);

   //make sure necessay dirs exist
   appDefaultDirs.forEach((defaultDir) => {
     defaultDir = appDir + '/' + defaultDir;

     if (!fs.existsSync(defaultDir)){
       fs.mkdirSync(defaultDir);
     }
   })

   const nunjucksEnv = nunjucks.configure(appTemplateDir + '/compiler-templates', {
     autoescape: true,
   });

   //create custom files based upon appData
   const appImports = [];

   // render app.js, with navigator
   const appJs  = nunjucks.render('app.tpl', {
     tabScreens: buildData.screens.screens.filter(screen => screen.inTabMenu).map(() => {
       return screen;
     });
   });

  fs.writeFileSync(appTemplateDir + '/App.js', appJs)
   //layout
   //

   //screens
   buildData.screens.screens.forEach((screen) => {
     const screenJs = nunjucks.render('screen.tpl', {
       screen: screen
     });

     fs.writeFileSync(appTemplateDir + '/screens/'+screen.componentName+'.js', screenJs)
   });

   //navigation
   /*
    tabScreens
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
    */


   //render app screen

   //output code as zip

   //zipDirectory();
};

module.exports = Compiler;

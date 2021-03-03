const path = require( "path" );

const {
    useBabelRc,
    addExternalBabelPlugins,
    removeModuleScopePlugin,
    override,
    babelInclude,
    addBabelPresets
} = require("customize-cra");

console.log('Lets go CHAMP');

module.exports = override(

    ...addBabelPresets(
        'babel-preset-expo'
    ),
    ...addExternalBabelPlugins(
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-transform-parameters",
    "@babel/plugin-transform-flow-strip-types"
),
    babelInclude([
        path.resolve("src"), // make sure you link your own source
        path.resolve("node_modules/react-native-video"),
        path.resolve("node_modules/expo-av"),
        path.resolve("node_modules/@expo"),

    ])
);
import {screens as defaultWorkoutScreens} from './defaults/WorkoutApp';

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)


const defaultSettings = {

}

const defaultNavigation = {

}

const defaultStyling = {
  header: {
    logo: {
      src: 'https://neuromindset.com/wp-content/uploads/2019/10/Logo_NeuroMindset_Blanco_horizontal_web-contorno.png',
      width: 330,
      height: 55
    },
    styles: {
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
      borderBottomWidth: 0,
      backgroundColor: '#000'
    }
  },
  body: {
    styles: {
      backgroundColor: '#000'
    }
  }
}



const defaultScreens = defaultWorkoutScreens;


console.log('defaultScreens', defaultScreens);

exports.appResource = {
  id: 1,
  title: 'New app...',
  revisions: [{
    resources: defaultResources,
    settings: defaultSettings,
    navigationSettings: defaultNavigation,
    screens: defaultScreens,
    styling:defaultStyling,
  }],
};

import React from 'react';
import { Title, RichText, Button, Video, Overview, Form, Columns, Game, Tour, Login, Splash, Images } from './components';
import {WorkoutSelectedProgram, ExerciseWorkout} from "./components/workout";

const componentsMap = {
  'title'   :{
    component: Title,
  },
  'richText'    : {
    component: RichText,
  },
  'images'   : {
    component : Images,
  },
  'button'  : {
    component :Button,
  },
  'video'  : {
    component :Video,
  },
  'overview'  : {
    component :Overview,
  },
  'form'  : {
    component :Form,
  },
  'column'   : {
    component :Columns,
  },
  'game'   :{
    component :Game,
  },
  'tour'   : {
    component :Tour,
  },
  'map'   : {
    component :Map,
  },
  'login'   : {
    component :Login,
  },
  'splash'   : {
    component :Splash,
  },
  'WorkoutSelectedProgram' : {
    component: WorkoutSelectedProgram,
  },
  'ExerciseWorkout' : {
    component: ExerciseWorkout,
  }
}

function ComponentManager(props) {
  return (
    <>
      {props.components.map((component, i)  => {
        if (!componentsMap[component.type]) {
          return 'Component not found: ' + component.type;
        }
        const FrontendComponent = componentsMap[component.type].component;

        // preComponent / postComponent allow per app to inject components, mainly used for allowing editing components to be injected without needing to be present in the frontend app itself

        return (
          <div key={i}>
            {props.preComponent && <props.preComponent />}
            <FrontendComponent
              {...component.props}
              activeResource={props.activeResource}
              resourceSchemas={props.resourceSchemas}
              resourcesData={props.resourcesData}
              navigation={props.navigation}
              formatResourceScreenName={props.formatResourceScreenName}
            />
            {props.postComponent && <props.postComponent />}
          </div>
        )
      })}
    </>
  );
}

export default ComponentManager;

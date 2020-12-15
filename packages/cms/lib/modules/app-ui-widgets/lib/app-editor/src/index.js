import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import {defaultResources,defaultSettings,defaultNavigation,defaultResourceScreens,defaultScreens, appResource} from './defaults';
import GenericApp from './frontend/GenericApp';
import Editor  from './Editor';
import editorSettings  from './editorSettings';
import {ComponentEditMenu} from './editor-ui/elements';


const preCompononent = (props) => {
  return (
    <div>
      <ComponentEditMenu {...props} />
    </div>
  )
}

const postCompononent = (props) => {
  return (
    <>

    </>
  )
}

if (process.env.FRONTEND) {

//  axios.get(`/api/app/1`)
//    .then( (response) => {
//      const appResource =  response.data;
      const latestRevisions = appResource.revisions[appResource.revisions.length -1];

      ReactDOM.render(
        <React.StrictMode>
          <GenericApp
            id={appResource.id}
            title={appResource.title}
            styling={latestRevisions.styling}
            settings={latestRevisions.settings}
            resources={latestRevisions.resources}
            navigationSettings={latestRevisions.navigationSettings}
            screens={latestRevisions.screens}
            preCompononent={preCompononent}
            postCompononent={postCompononent}
            isSignedIn={true}
          />
        </React.StrictMode>,
        document.getElementById('root')
      );

//    })
  //  .catch(function (error) {
  //    console.log(error);
  //  });

} else {


const newResourceObject = {
  type: 'step',
  data: {}
};

 const appResource = {
  id: 1,
  title: 'New app...',
  revisions: [{
    resources: [{
      name: 'step',
      items: [{
        id: 1,
        title: 'Step 1',
        description: 'Lorem ipsum....',
        position: [52.370216, 4.895168],
        images: ['https://image-server2.openstadsdeel.nl/image/9c9554218311abb0d1797945e575db97/:/rs=w:1400,h:500;cp=w:1400,h:500'],
        audio: {
          filename: 'test.mp3'
        },
      },
      {
        id: 2,
        title: 'Step 2',
        description: 'Lorem ipsum....',
        position: [52.360506, 4.908971],
        images: ['https://image-server2.openstadsdeel.nl/image/9c9554218311abb0d1797945e575db97/:/rs=w:1400,h:500;cp=w:1400,h:500']
      }],
    }]
  }],
};


const editorType = process.env.EDITOR ? process.env.EDITOR : 'tour'
console.log('editorSettings', editorSettings);

const latestRevision = appResource.revisions[appResource.revisions.length -1]
const settings = editorSettings[editorType];
console.log('latestRevision', latestRevision);

  ReactDOM.render(
    <React.StrictMode>
      <Editor
        appId={1}
        resources={latestRevision.resources}
        appResource={appResource}
        editableResources={settings.editableResources}
      />
    </React.StrictMode>,
    document.getElementById('root')
);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

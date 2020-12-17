import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const newResourceObject = {
  type: 'step',
  data: {}
};

const appResource = {
  id: 1,
  title: 'New app...',
  revisions: [{
    resourceItems: [
      {
        type: 'step',
        data: {
          id: 1,
          title: 'Step 1',
          description: 'Lorem ipsum....',
          position: [52.370216, 4.895168],
          images: ['https://image-server2.openstadsdeel.nl/image/9c9554218311abb0d1797945e575db97/:/rs=w:1400,h:500;cp=w:1400,h:500'],
          audio: {
            filename: 'test.mp3'
          }
        }
      },
      {
        type: 'step',
        data: {
          id: 2,
          title: 'Step 2',
          description: 'Lorem ipsum....',
          position: [52.360506, 4.908971],
          images: ['https://image-server2.openstadsdeel.nl/image/9c9554218311abb0d1797945e575db97/:/rs=w:1400,h:500;cp=w:1400,h:500']
        }
      },
    ]
  }],
};

ReactDOM.render(
  <React.StrictMode>
    <App
      appId={1}
      newResourceObject={newResourceObject}
    //  resourceItems={appResource.revisions[appResource.revisions.length -1].resourceItems}
      appResource={appResource}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
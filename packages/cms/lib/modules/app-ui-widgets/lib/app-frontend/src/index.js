import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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

axios.get(`/api/tour/1`)
  .then( (response) => {
    const appResource =  response.data;

    ReactDOM.render(
      <React.StrictMode>
        <App
          id={appResource.id}
          title={appResource.title}
          styling={{}}
          screens={[{
            type: "TourGuide",
            elements: appResource.revisions[appResource.revisions.length -1].resourceItems,
            coordinates: appResource.revisions[appResource.revisions.length -1].coordinates,
          }]}
        />
      </React.StrictMode>,
      document.getElementById('root')
    );

  })
  .catch(function (error) {
    console.log(error);
  });


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

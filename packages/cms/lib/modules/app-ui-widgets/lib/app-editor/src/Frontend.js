import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import GenericApp from './frontend/GenericApp';
import reportWebVitals from './reportWebVitals';

/* Obfucscate the data structure */

axios.get(`/api/app/1`)
  .then( (response) => {
    const appResource =  response.data;
    const latestRevisions = appResource.revisions[appResource.revisions.length -1];

    ReactDOM.render(
      <React.StrictMode>
        <App
          id={appResource.id}
          title={appResource.title}
          styling={latestRevisions.styling}
          settings={latestRevisions.settings}
          resources={latestRevisions.resources}
          navigationSettings={latestRevisions.navigationSettings}
          screens={latestRevisions.screens}
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

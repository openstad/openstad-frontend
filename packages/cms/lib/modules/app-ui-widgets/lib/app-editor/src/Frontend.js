import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import GenericApp from './frontend/GenericApp';
import reportWebVitals from './reportWebVitals';

/* Obfucscate the data structure */


const defaultResources = [
  {
    apiUrl: '', // if empty fetch from default settings
    name: 'games',
    nameSingle: 'game',
    namePlural: 'games',
    defaultComponents: [
      {
        type: 'game',
        props: {

        }
      }
    ]
  },
  {
    apiUrl: '', // if empty fetch from default settings
    name: 'article',
    nameSingle: 'article',
    namePlural: 'articles',
    defaultComponents: [
      {
        type: 'title',
        props: {
          key: 'title'
        }
      },
      {
        type: 'images',
        props: {
          key: 'src'
        }
      },
      {
        type: 'richText',
        props: {
          key: 'content'
        }
      },
    ]
  },
  {
    apiUrl: '', // if empty fetch from default settings
    name: 'product',
    nameSingle: 'product',
    namePlural: 'products',
    defaultComponents: [
      {
        type: 'title',
        props: {
          key: 'title'
        }
      },
      {
        type: 'richText',
        props: {
          key: 'price'
        }
      },
      {
        type: 'images',
        props: {
          key: 'src'
        }
      },
    ]
  }
];

const defaultSettings = {

}

const defaultNavigation = {

}

const defaultResourceScreens = defaultResources.map((resource, i) => {
  return {
    id : 100000 + i,
    name: `${resource.nameSingle.ucFirst()} screen`,
    components: resource.defaultComponents
  }
});

const defaultScreens = {
  startScreenId: 1,
  items: [
    {
      id: 1,
      name: 'Start page',
      type: 'static',
      components: [
        {
          type: 'title',
          props: {
            title: 'All games'
          }
        },
        {
          type: 'overview',
          props: {
            resource: 'games',
            amount: 12,
          }
        },

      ]
    },
    {...defaultResourceScreens}
  ],
}

const appResource = {
  id: 1,
  title: 'New app...',
  revisions: [{
    resources: {
      items: defaultResources,
    },
    settings: defaultSettings,
    navigationSettings: defaultNavigation,
    screens: defaultScreens
  }],
};

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

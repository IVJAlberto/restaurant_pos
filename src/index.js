import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css'

import { BrowserRouter, HashRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import store, {persistor} from './app/store';

const container = document.getElementById('root');
const root = createRoot(container);

//localhost:3000
root.render(
  <React.StrictMode>
      <HashRouter> 
      <Provider store={store}>
        <PersistGate  loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
      </HashRouter>
  </React.StrictMode>
);
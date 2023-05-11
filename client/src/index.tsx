import React, { memo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/app';
import './assets/styles/index.scss';
import { Provider } from 'react-redux';
import { setupStore } from './store';

const rootElem = document.getElementById('root') as HTMLElement;

document.body.oncontextmenu = function() { return false };

const root = ReactDOM.createRoot(
  rootElem
);

const store = setupStore();

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  
);
  
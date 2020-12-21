import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '~/client/components/App';

ReactDOM.hydrate(
  <App />,
  document.getElementById('root')
);

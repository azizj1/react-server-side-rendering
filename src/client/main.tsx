import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as StyleContext from 'isomorphic-style-loader/StyleContext';
import App from '~/client/App';
import {getInitialStateAndClear} from '~/ssr/data-cache';
import {addStateContext} from '~/ssr/StateContext';

const insertCss = (...styles: any[]) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

const addStyleContext = (app: JSX.Element) =>
  <StyleContext.Provider value={{insertCss}}>{app}</StyleContext.Provider>;

ReactDOM.hydrate(
  addStyleContext(addStateContext(<App />, getInitialStateAndClear())),
  document.getElementById('root')
);

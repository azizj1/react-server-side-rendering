import * as React from 'react';

export interface State {
  data1: string;
  data2: number;
  data3: boolean;
}

const initialSummary: State = {
  data1: '',
  data2: 0,
  data3: false,
};

export const StateContext = React.createContext<State>(initialSummary);

export const addStateContext = (children: JSX.Element, state: State) =>
  <StateContext.Provider value={state}>{children}</StateContext.Provider>;

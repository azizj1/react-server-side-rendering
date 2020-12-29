import {State} from '~/ssr/StateContext';

export const INITIAL_STATE_KEY = 'IDSK';

export function getInitialStateAndClear(): State {
 const data = (window as any)[INITIAL_STATE_KEY];
 delete (window as any)[INITIAL_STATE_KEY];
 return data;
}

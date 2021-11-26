import { useState } from 'react';

type StateMap = Record<string, any>;
type StateUpdate<State> = {
  [index in keyof State]?: State[index];
};

export function useMergedState<State extends StateMap>(
  initialState: State,
  debug = false
): [State, (newState: StateUpdate<State>) => void] {
  const [state, setState] = useState<State>(initialState);

  function mergeState(newState: StateUpdate<State>) {
    if (debug) console.log(newState);
    setState((prevState) => ({ ...prevState, ...newState }));
  }

  return [state, mergeState];
}

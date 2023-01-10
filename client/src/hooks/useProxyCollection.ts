import _ from "lodash";
import React from "react";

type WithId<T> = T & { readonly _id: string };

function useProxyCollection<T extends T[number][]>(initialState: T) {
  const withId = (value: T) => value.map((v) => ({ ...v, _id: _.uniqueId() }));

  const proxyHandler: ProxyHandler<WithId<T[number]>> = {
    set(target, prop, value, receiver) {
      setState((state) => {
        const obj = state.find((obj) => obj._id === target._id);
        obj && Reflect.set(obj, prop, value);
        return [...state];
      });
      return Reflect.set(target, prop, value, receiver);
    },
  };

  function createProxy(value: WithId<T[number]>[]) {
    return value.map((obj) => new Proxy(obj, proxyHandler));
  }

  const [state, setState] = React.useState(() => withId(initialState));
  const [proxy, setProxy] = React.useState(() => createProxy(state));

  function initProxy(value: T) {
    const valueWithId = withId(value);
    setState(valueWithId);
    setProxy(createProxy(valueWithId));
  }

  React.useEffect(() => {
    initProxy(initialState);
    // eslint-disable-next-line
  }, [initialState]);

  return proxy as T;
}

export default useProxyCollection;

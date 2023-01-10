import React from "react";
import _ from "lodash";

export interface IEventOptions {
  once?: boolean;
}

export interface IEventListener<T extends string[]> {
  event: T[number];
  listener: (...args: any[]) => void;
  options?: IEventOptions;
}

function useEventEmitter<T extends string[]>() {
  const listeners = React.useRef<IEventListener<T>[]>([]);

  function emit(eventName: T[number], ...args: any[]) {
    const matches = listeners.current.filter(
      (item) => item.event === eventName
    );
    matches.forEach((item) => {
      item.listener(...args);
      if (item.options?.once) {
        off(item.event, item.listener, item.options);
      }
    });
  }
  function on(
    event: string,
    listener: (...args: any[]) => void,
    options?: IEventOptions
  ) {
    listeners.current = [...listeners.current, { event, listener, options }];
  }
  function off(
    event: string,
    listener: (...args: any[]) => void,
    options?: IEventOptions
  ) {
    listeners.current = listeners.current.filter(
      (item) => !_.isEqual(item, { event, listener, options })
    );
  }

  return { emit, on, off };
}

export default useEventEmitter;

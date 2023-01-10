import React from "react";

export interface IDarkmodeContext {
  darkmode: boolean;
  setDarkmode: ReactSetter<boolean>;
  watchMedia: boolean;
  setWatchMedia: ReactSetter<boolean>;
}

export const DarkmodeContext = React.createContext<IDarkmodeContext | null>(
  null
);

export enum DarkmodeEnum {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

function getStorage() {
  return localStorage.getItem("darkmode");
}
function storeDarkmode(value: DarkmodeEnum) {
  localStorage.setItem("darkmode", value);
}

export function DarkmodeProvider(props: { children: JSX.Element }) {
  const getMatchMedia = () => window.matchMedia("(prefers-color-scheme: dark)");
  const [watchMedia, setWatchMedia] = React.useState(() => {
    const storage = getStorage();
    if (storage) {
      return storage === DarkmodeEnum.SYSTEM;
    }
    storeDarkmode(DarkmodeEnum.SYSTEM);
    return true;
  });
  const [darkmode, setDarkmode] = React.useState(() => {
    const storage = getStorage();
    if (storage === DarkmodeEnum.SYSTEM) {
      return getMatchMedia().matches;
    }
    return storage === DarkmodeEnum.DARK;
  });

  function updateStorage() {
    storeDarkmode(darkmode ? DarkmodeEnum.DARK : DarkmodeEnum.LIGHT);
  }

  React.useEffect(() => {
    if (watchMedia) {
      const mediaQuery = getMatchMedia();
      storeDarkmode(DarkmodeEnum.SYSTEM);
      setDarkmode(mediaQuery.matches);
      const mqListener = (e: MediaQueryListEvent) => setDarkmode(e.matches);
      mediaQuery.addEventListener("change", mqListener);
      return () => {
        mediaQuery.removeEventListener("change", mqListener);
      };
    } else {
      updateStorage();
    }
    // eslint-disable-next-line
  }, [watchMedia]);

  React.useEffect(() => {
    if (!watchMedia) {
      updateStorage();
    }
    document.querySelector("html")!.classList.toggle("dark", darkmode);
    // eslint-disable-next-line
  }, [darkmode]);

  return (
    <DarkmodeContext.Provider
      value={{ darkmode, setDarkmode, watchMedia, setWatchMedia }}
    >
      {props.children}
    </DarkmodeContext.Provider>
  );
}

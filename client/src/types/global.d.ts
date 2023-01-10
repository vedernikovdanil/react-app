export {};

declare global {
  type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;
  declare module "*.module.css";
}

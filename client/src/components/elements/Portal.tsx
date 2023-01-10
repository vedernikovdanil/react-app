import React from "react";
import ReactDOM from "react-dom";

function Portal(props: { id: string; children: JSX.Element }) {
  const root = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    root.current = document.createElement("div");
    root.current.id = props.id;
    document.body.appendChild(root.current);
    return () => {
      if (root.current) {
        document.body.removeChild(root.current);
      }
    };
  }, []);

  return (
    <>{root.current && ReactDOM.createPortal(props.children, root.current)}</>
  );
}

export default Portal;

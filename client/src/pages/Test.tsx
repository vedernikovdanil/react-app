import React from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ request, params }: any) {
  const response = await fetch("/api/test");
  const result = await response.json();
  return result;
}

function Test() {
  const loaderData = useLoaderData() as { light: boolean };
  const [light, setLight] = React.useState(loaderData.light);
  const subscribe = React.useRef(false);
  const unsubscribe = React.useRef(false);

  React.useEffect(() => {
    unsubscribe.current = false;
    subscribeLight();
    return () => {
      unsubscribe.current = true;
    };
    // eslint-disable-next-line
  }, []);

  async function fetchLight() {
    const response = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ light: !light }),
    });
    const data = await response.json();
    setLight(data.light);
  }

  async function subscribeLight() {
    if (unsubscribe.current) {
      return;
    }
    if (!subscribe.current) {
      subscribe.current = true;
      console.log("SUBSCRIBE on /api/test/subscribe");
      let error: any;
      try {
        const response = await fetch("/api/test/subscribe", { method: "POST" });
        const data = await response.json();
        setLight(data.light);
      } catch (err) {
        error = err;
      } finally {
        subscribe.current = false;
        if (error) {
          if (error instanceof Error) {
            console.error(error.message);
          }
          setTimeout(subscribeLight, 1000);
        } else {
          subscribeLight();
        }
      }
    }
  }

  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        background: light ? "lightyellow" : "grey",
        color: light ? "black" : "white",
        fontSize: "2.5em",
        cursor: "pointer",
      }}
      onClick={fetchLight}
      className="mx-auto d-flex align-items-center justify-content-center rounded"
    >
      <i className={`bi bi-lightbulb${light ? "-fill" : ""}`} />
    </div>
  );
}

export default Test;

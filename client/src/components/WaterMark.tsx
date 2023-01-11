import React from "react";

function WaterMark() {
  const date = React.useMemo(() => new Date(), []);

  return (
    <div className="d-flex gap-3 flex-wrap text-muted position-absolute bottom-0 mb-3">
      <span>© {date.getFullYear()} </span>
      <a className="nav-link" href="https://github.com/vedernikovdanil">
        <i className="bi bi-github me-1" />
        vedernikovdanil
      </a>
      <a
        className="nav-link text-end"
        href="mailto:vedernikov.1974@hotmail.com"
      >
        <i className="bi bi-envelope me-1" />
        vedernikov.1974@hotmail.com
      </a>
    </div>
  );
}

export default WaterMark;

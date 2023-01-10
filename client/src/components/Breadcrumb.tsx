import _ from "lodash";
import React from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link, useLocation } from "react-router-dom";

function BreadcrumbComponent() {
  const location = useLocation();
  const paths = React.useMemo(
    () => _.map(location.pathname.split("/"), decodeURI),
    [location]
  );

  return (
    <Breadcrumb>
      {paths.map((path, index) => (
        <Breadcrumb.Item
          key={index}
          className="text-capitalize"
          linkAs={Link}
          linkProps={{ to: path ? paths.slice(0, index + 1).join("/") : "/" }}
          active={index === paths.length - 1}
        >
          {index === 0 ? "home" : path}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;

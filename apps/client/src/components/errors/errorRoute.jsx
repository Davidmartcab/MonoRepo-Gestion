import React from "react";
import "../../styles/errorRoute.scss";
import { Link } from "react-router-dom";

function ErrorRoute() {
  return (
    <div className="error">
      <header className="error__header">Error</header>
      <div className="error__content">
        <div className="error__content__text">Error 404: Page not found</div>
        <Link to="/" className="error__content__link">Go Home</Link>
      </div>
    </div>
  );
}

export default ErrorRoute;

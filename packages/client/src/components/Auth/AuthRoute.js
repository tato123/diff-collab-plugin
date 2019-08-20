import React from "react";
import { Route, Redirect } from "react-router-dom";
import _ from "lodash";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = () => {
    // get the access token
    const accessToken = localStorage.getItem("accessToken");
    return !_.isNil(accessToken);
  };

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;

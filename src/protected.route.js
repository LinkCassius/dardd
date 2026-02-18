import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";
export const ProtectedRoute = ({
  component: Component,
  permission,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        //console.log("dddd", auth.isAuthenticated());
        //console.log("props", props);
        const currentUser = auth.getCurrentUser();

        if (!currentUser) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
        // check if route is restricted by role
        //console.log("permission : ", permission);
        // console.log("currentUser.permission: ", currentUser.permission);

        /*
        if (permission && permission.indexOf(currentUser.permission) === -1) {
          // role not authorised so redirect to home page
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }

        // authorised so return component
        return <Component {...props} />;
*/

        if (
          auth.isAuthenticated() === true &&
          currentUser.permission.includes(permission)
        ) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
